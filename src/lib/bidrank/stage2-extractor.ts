import { GoogleGenerativeAI } from '@google/generative-ai'
import { STAGE2_PROMPT } from './prompts'
import { GEMINI_CONFIG, SAFETY_SETTINGS, DEFAULT_MODEL, MAX_RETRIES, RETRY_BASE_DELAY } from './config'
import type { RFPBasics } from './types'

function cleanJSON(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7)
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3)
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3)
  return cleaned.trim()
}

async function generateWithRetry(
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
  prompt: string
): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (err) {
      const msg = String(err).toLowerCase()
      if ((msg.includes('429') || msg.includes('rate limit') || msg.includes('quota')) && attempt < MAX_RETRIES - 1) {
        const wait = Math.pow(2, attempt) + Math.random()
        console.warn(`[bidrank] Rate limited. Waiting ${wait.toFixed(1)}s... (attempt ${attempt + 1}/${MAX_RETRIES})`)
        await new Promise(r => setTimeout(r, wait * 1000))
      } else {
        throw err
      }
    }
  }
  throw new Error(`Max retries (${MAX_RETRIES}) exceeded`)
}

export async function extractBasics(rfpText: string, apiKey: string): Promise<RFPBasics> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: GEMINI_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  })

  const truncated = rfpText.slice(0, 5000)
  const prompt = STAGE2_PROMPT.replace('{rfp_text}', truncated)

  const responseText = await generateWithRetry(model, prompt)
  const cleaned = cleanJSON(responseText)
  const parsed = JSON.parse(cleaned) as RFPBasics

  // Validate required fields
  const defaultBasics: RFPBasics = {
    agency: parsed.agency || '',
    contract_title: parsed.contract_title || '',
    contract_value: parsed.contract_value || 0,
    contract_value_text: parsed.contract_value_text || '',
    deadline: parsed.deadline || '',
    deadline_iso: parsed.deadline_iso || '',
    naics_code: parsed.naics_code || '',
    naics_description: parsed.naics_description || '',
    set_aside: parsed.set_aside || '',
    contract_type: parsed.contract_type || '',
    period_of_performance: parsed.period_of_performance || '',
    place_of_performance: parsed.place_of_performance || '',
    on_site_percentage: parsed.on_site_percentage || '',
    contracting_officer_name: parsed.contracting_officer_name ?? null,
    contracting_officer_email: parsed.contracting_officer_email ?? null,
    contracting_officer_phone: parsed.contracting_officer_phone ?? null,
    solicitation_number: parsed.solicitation_number ?? null,
  }

  return defaultBasics
}
