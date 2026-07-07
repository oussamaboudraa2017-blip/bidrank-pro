export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/session')
    const { analyzeRFP } = await import('@/lib/gemini')
    const { getPlanLimits } = await import('@/lib/auth')
    const { db } = await import('@/lib/db')

    // ── Auth check ──────────────────────────────────────────────────────────
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const userId = session.user.id

    // ── Get user plan from DB ───────────────────────────────────────────────
    let plan = 'free'
    try {
      const user = await db.user.findUnique({ where: { id: userId } })
      if (user) {
        plan = user.plan
      } else {
        // Auto-create user record on first analysis (shouldn't happen with Better Auth)
        await db.user.create({
          data: {
            id: userId,
            email: session.user.email || '',
            name: session.user.name || null,
            plan: 'free',
            trialStartsAt: new Date(),
            trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        })
      }
    } catch (dbErr) {
      console.warn('[/api/analyze] DB unavailable, using free tier:', dbErr)
    }

    const limits = getPlanLimits(plan)

    // ── Rate limit check (DB-backed) ────────────────────────────────────────
    try {
      const userRecord = await db.user.findUnique({
        where: { id: userId },
        select: { analysesThisMonth: true, trialEndsAt: true },
      })
      if (userRecord && userRecord.analysesThisMonth >= limits.maxAnalysesPerMonth) {
        return NextResponse.json(
          {
            error: `Monthly analysis limit reached (${limits.maxAnalysesPerMonth}/${limits.maxAnalysesPerMonth}). Please upgrade your plan for more analyses.`,
            plan,
          },
          { status: 429 }
        )
      }
    } catch {
      // Skip rate limit if DB is unavailable
    }

    // ── Parse body (accept FormData for file upload + JSON for text) ────────
    let rfpText = ''
    let fileName: string | undefined

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const textContent = formData.get('text') as string | null

      if (file) {
        fileName = file.name
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (file.type === 'application/pdf') {
          const text = buffer.toString('latin1')
          rfpText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim()
        } else {
          rfpText = buffer.toString('utf-8')
        }

        if (!rfpText || rfpText.length < 50) {
          return NextResponse.json(
            { error: 'Could not extract text from the file. Please paste the RFP text directly.' },
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
      return NextResponse.json({ error: 'RFP text is required' }, { status: 400 })
    }

    if (rfpText.length > limits.maxTextLength) {
      return NextResponse.json(
        { error: `RFP text exceeds maximum allowed length of ${limits.maxTextLength.toLocaleString()} characters.` },
        { status: 400 }
      )
    }

    // ── Analyze with Gemini ─────────────────────────────────────────────────
    const analysis = await analyzeRFP(rfpText)

    // ── Save to database ────────────────────────────────────────────────────
    try {
      const textHash = crypto.createHash('sha256').update(rfpText).digest('hex').substring(0, 32)

      await db.rfpAnalysis.create({
        data: {
          userId,
          fileName: fileName || null,
          rfpTextHash: textHash,
          rfpText,
          executiveSummary: analysis.executiveSummary,
          readinessScore: analysis.readinessScore,
          contractValue: analysis.keyMetrics.contractValue,
          submissionDeadline: analysis.keyMetrics.submissionDeadline,
          agency: analysis.keyMetrics.agency,
          naicsCode: analysis.keyMetrics.naicsCode,
          setAsideType: analysis.keyMetrics.setAsideType,
          complianceJson: JSON.stringify(analysis.complianceChecklist),
          risksJson: JSON.stringify(analysis.risks),
          recommendationsJson: JSON.stringify(analysis.recommendations),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      })

      await db.user.update({
        where: { id: userId },
        data: { analysesThisMonth: { increment: 1 } },
      })
    } catch (dbErr) {
      console.warn('[/api/analyze] Failed to save to DB:', dbErr)
    }

    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    console.error('[/api/analyze] Error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}