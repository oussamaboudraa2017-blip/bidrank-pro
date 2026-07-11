import { GoogleGenerativeAI } from '@google/generative-ai'
import { STAGE3_PROMPT } from './prompts'
import { GEMINI_CONFIG, SAFETY_SETTINGS, DEFAULT_MODEL, MAX_RETRIES, RETRY_BASE_DELAY } from './config'
import type { Requirement } from './types'

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

export async function extractRequirements(
  rfpText: string,
  apiKey: string,
  contractValue: number
): Promise<Requirement[]> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: GEMINI_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  })

  const truncated = rfpText.slice(0, 20000)
  const minReqs = contractValue > 10000000 ? 25 : 15
  let prompt = STAGE3_PROMPT.replace('{rfp_text}', truncated)

  const responseText = await generateWithRetry(model, prompt)
  const cleaned = cleanJSON(responseText)
  let requirements = JSON.parse(cleaned) as Requirement[]

  // Retry with stronger prompt if minimum not met
  if (requirements.length < minReqs) {
    prompt += `\n\nWARNING: Only found ${requirements.length} requirements. Minimum is ${minReqs}. Please extract more sub-requirements by breaking down complex requirements.`
    const retryText = await generateWithRetry(model, prompt)
    const retryCleaned = cleanJSON(retryText)
    requirements = JSON.parse(retryCleaned) as Requirement[]
  }

  // Validate and fill defaults for each requirement
  return requirements.map((r, i) => ({
    section: r.section || `Section ${String.fromCharCode(65 + (i % 26))}`,
    requirement: r.requirement || '',
    category: r.category || 'Technical',
    priority: r.priority || 'Important',
    is_mandatory: r.is_mandatory ?? r.priority === 'Critical',
    mandatory_keywords: Array.isArray(r.mandatory_keywords) ? r.mandatory_keywords : [],
    submission_required: r.submission_required ?? false,
    exceptions_allowed: r.exceptions_allowed ?? true,
  }))
}
