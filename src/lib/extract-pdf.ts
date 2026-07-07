/**
 * Server-side PDF text extraction using pdfjs-dist.
 * Works in Node.js / Vercel serverless without the test-data issues of pdf-parse.
 */

export async function extractPDFText(buffer: Buffer): Promise<string> {
  // Dynamic import to keep this out of the client bundle
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

  // Use the fake worker (no separate worker thread needed in Node.js)
  pdfjsLib.GlobalWorkerOptions.workerSrc = ''

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise

  const textParts: string[] = []

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .filter((item: any) => 'str' in item && typeof item.str === 'string')
      .map((item: any) => item.str as string)
      .join(' ')
    if (pageText.trim()) {
      textParts.push(pageText)
    }
  }

  return textParts.join('\n').trim()
}