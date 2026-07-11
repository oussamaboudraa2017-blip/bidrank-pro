import { NextRequest, NextResponse } from 'next/server'
import { BidRankPipeline } from '@/lib/bidrank'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    let rfpText = ''
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const textContent = formData.get('text') as string | null

      if (file) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const ext = file.name.split('.').pop()?.toLowerCase() || ''

        if (ext === 'pdf' || file.type === 'application/pdf') {
          const { extractPDFText } = await import('@/lib/extract-pdf')
          rfpText = await extractPDFText(buffer)
        } else if (ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const mammoth = await import('mammoth')
          const result = await mammoth.extractRawText({ buffer })
          rfpText = (result.value || '').trim()
        } else {
          rfpText = buffer.toString('utf-8').trim()
        }

        if (!rfpText || rfpText.length < 50) {
          return NextResponse.json(
            { error: 'Could not extract enough text from the file.' },
            { status: 400 }
          )
        }
      } else if (textContent) {
        rfpText = textContent
      }
    } else {
      const body = await request.json()
      rfpText = body.text || ''
    }

    if (!rfpText || typeof rfpText !== 'string') {
      return NextResponse.json({ error: 'RFP text is required' }, { status: 400 })
    }

    if (rfpText.length > 200_000) {
      return NextResponse.json(
        { error: 'RFP text exceeds maximum length of 200,000 characters.' },
        { status: 400 }
      )
    }

    const pipeline = new BidRankPipeline(apiKey)
    const result = await pipeline.run(rfpText)

    return NextResponse.json(
      {
        report: result.report,
        data: result.data,
        validation_errors: result.errors,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[/api/bidrank-analyze] Error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
