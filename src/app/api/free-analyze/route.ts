import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory rate limiter for free tier (no DB required)
const freeAnalysisLog = new Map<string, { count: number; resetAt: number }>()
const FREE_MONTHLY_LIMIT = 3

function getRateLimitKey(ip: string): string {
  const month = new Date().toISOString().slice(0, 7) // "2026-07"
  return `${ip}:${month}`
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = getRateLimitKey(ip)
  const entry = freeAnalysisLog.get(key)
  const now = Date.now()

  if (!entry || now > entry.resetAt) {
    // Reset or create
    freeAnalysisLog.set(key, { count: 1, resetAt: getMonthEnd() })
    return { allowed: true, remaining: FREE_MONTHLY_LIMIT - 1 }
  }

  if (entry.count >= FREE_MONTHLY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: FREE_MONTHLY_LIMIT - entry.count }
}

function getMonthEnd(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime()
}

/* ═══════════════════════════════════════════════════════════════════
   DOCUMENT TEXT EXTRACTION
   ═══════════════════════════════════════════════════════════════════ */

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { extractPDFText } = await import('@/lib/extract-pdf')
  return extractPDFText(buffer)
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return (result.value || '').trim()
}

async function extractTextFromXLSX(buffer: Buffer): Promise<string> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const allText: string[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    // Convert sheet to array of arrays, then join cells with spaces
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    for (const row of rows) {
      const rowText = (row as unknown[])
        .map((cell) => (cell !== null && cell !== undefined ? String(cell) : ''))
        .filter((s) => s.length > 0)
        .join(' ')
      if (rowText) allText.push(rowText)
    }
  }

  return allText.join('\n').trim()
}

async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()?.toLowerCase() || ''

  try {
    if (ext === 'pdf' || file.type === 'application/pdf') {
      return await extractTextFromPDF(buffer)
    }

    if (ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractTextFromDOCX(buffer)
    }

    if (ext === 'xlsx' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return await extractTextFromXLSX(buffer)
    }

    // Fallback: try as plain text (handles .txt and other formats)
    return buffer.toString('utf-8').trim()
  } catch (err) {
    console.error(`[free-analyze] Failed to parse ${file.name}:`, err)
    throw new Error(
      `Unable to extract text from "${file.name}". Please ensure the file is a valid PDF, DOCX, or XLSX, or paste the RFP text directly.`
    )
  }
}

/* ═══════════════════════════════════════════════════════════════════
   POST HANDLER
   ═══════════════════════════════════════════════════════════════════ */

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit by IP ──────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Monthly free analysis limit reached (${FREE_MONTHLY_LIMIT}/${FREE_MONTHLY_LIMIT}). Upgrade to Starter for unlimited analyses.`,
          remaining: 0,
        },
        { status: 429 }
      )
    }

    // ── Parse file or text ────────────────────────────────────
    let rfpText = ''
    let fileName: string | undefined
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const textContent = formData.get('text') as string | null

      if (file) {
        fileName = file.name
        rfpText = await extractTextFromFile(file)

        if (!rfpText || rfpText.length < 50) {
          return NextResponse.json(
            { error: 'Unable to extract enough text from this document. The file may be image-based (scanned PDF) or empty. Please upload a text-readable document or paste the RFP text directly.' },
            { status: 400 }
          )
        }
      } else if (textContent) {
        rfpText = textContent
      }
    } else {
      const body = await request.json()
      rfpText = body.text || ''
      fileName = body.fileName
    }

    if (!rfpText || typeof rfpText !== 'string') {
      return NextResponse.json({ error: 'RFP text is required.' }, { status: 400 })
    }

    if (rfpText.length > 50_000) {
      return NextResponse.json(
        { error: 'RFP text exceeds the free tier limit of 50,000 characters. Upgrade for larger documents.' },
        { status: 400 }
      )
    }

    // ── Analyze with free-tier fast engine ───────────────────
    const { analyzeRFPFree } = await import('@/lib/gemini')
    const analysis = await analyzeRFPFree(rfpText)

    return NextResponse.json(
      {
        ...analysis,
        _meta: {
          tier: 'free',
          remaining_analyses: rateCheck.remaining,
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rateCheck.remaining),
        },
      }
    )
  } catch (error) {
    console.error('[/api/free-analyze] Error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'

    // Return user-friendly exception messages
    const exceptionMessages = [
      'Unable to parse document',
      'Unable to extract',
      'Standard RFP structure not detected',
    ]

    const isException = exceptionMessages.some((m) => message.includes(m))
    const status = isException ? 422 : 500

    return NextResponse.json({ error: message }, { status })
  }
}