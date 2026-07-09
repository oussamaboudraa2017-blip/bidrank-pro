/**
 * Server-side PDF text extraction.
 *
 * Primary: pdf-parse  (Node.js-native, no Worker/thread complexity — works
 *           reliably in Vercel serverless, AWS Lambda, Docker, etc.)
 * Fallback: pdfjs-dist legacy build with correct workerSrc resolution.
 */

export async function extractPDFText(buffer: Buffer): Promise<string> {
  // ── Method 1: pdf-parse (most reliable in serverless) ────────────────
  try {
    // Default import — pdf-parse exposes a single function
    const pdfParse = (await import('pdf-parse')).default as (
      data: Buffer,
      options?: Record<string, unknown>
    ) => Promise<{ text: string; numpages: number }>

    const result = await pdfParse(buffer)
    const text = (result.text || '').trim()

    if (text.length >= 50) {
      console.info(`[extract-pdf] pdf-parse OK — ${result.numpages} pages, ${text.length} chars`)
      return text
    }

    // pdf-parse succeeded but returned very little text — try next method
    console.warn('[extract-pdf] pdf-parse returned < 50 chars, trying pdfjs-dist fallback')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn('[extract-pdf] pdf-parse failed, trying pdfjs-dist fallback:', msg)
  }

  // ── Method 2: pdfjs-dist v6 legacy build (fake worker) ───────────────
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    // In pdfjs-dist v6 the fake-worker path does a dynamic import() of
    // `workerSrc`.  Using the *bare specifier* works in Node.js because
    // the runtime can resolve it from node_modules.  The `/*webpackIgnore*/`
    // comment inside pdfjs-dist ensures webpack/Next.js leaves the import
    // untouched so Node.js resolves it at runtime.
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'pdfjs-dist/legacy/build/pdf.worker.mjs'

    const doc = await pdfjsLib
      .getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableAutoFetch: true,
      })
      .promise

    const textParts: string[] = []
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .filter((item: { str?: string }) => 'str' in item && typeof item.str === 'string')
        .map((item: { str: string }) => item.str)
        .join(' ')
      if (pageText.trim()) textParts.push(pageText)
    }

    await doc.destroy()
    const text = textParts.join('\n').trim()

    if (text.length >= 50) {
      console.info(`[extract-pdf] pdfjs-dist OK — ${doc.numPages} pages, ${text.length} chars`)
      return text
    }

    console.warn('[extract-pdf] pdfjs-dist returned < 50 chars')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn('[extract-pdf] pdfjs-dist fallback failed:', msg)
  }

  throw new Error(
    'Unable to extract text from PDF. All extraction methods failed. ' +
    'Please paste the RFP text directly.'
  )
}