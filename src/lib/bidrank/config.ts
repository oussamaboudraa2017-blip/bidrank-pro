import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { RiskLevel, GeminiConfig } from './types'

export const MANDATORY_SUBMISSION_KEYWORDS = [
  'mandatory',
  'required at time of proposal submission',
  'no exceptions',
  'NOT acceptable',
  'will not be considered',
  'automatic disqualification',
  'must possess',
  'NO interim clearances',
] as const

export const RISK_LEVEL_MAP: Record<string, { category: string; level?: RiskLevel; trigger_value?: number }> = {
  'ts/sci': { category: 'Security Clearance', level: 'CRITICAL' },
  'top secret': { category: 'Security Clearance', level: 'CRITICAL' },
  'secret clearance': { category: 'Security Clearance', level: 'HIGH' },
  'cmmc level 3': { category: 'CMMC Certification', level: 'CRITICAL' },
  'cmmc level 2': { category: 'CMMC Certification', level: 'HIGH' },
  'fedramp high': { category: 'Cloud Authorization', level: 'CRITICAL' },
  'fedramp moderate': { category: 'Cloud Authorization', level: 'HIGH' },
  'facility clearance': { category: 'Facility Clearance', level: 'CRITICAL' },
  fcl: { category: 'Facility Clearance', level: 'CRITICAL' },
  'past performance': { category: 'Past Performance', level: 'HIGH' },
  '$10m': { category: 'Past Performance', level: 'HIGH' },
  'classified component': { category: 'Past Performance', level: 'HIGH' },
  'firm-fixed-price': { category: 'Financial', trigger_value: 50000000 },
}

export const FINANCIAL_RISK_RULES: Record<string, [number, number, RiskLevel][]> = {
  FFP: [
    [0, 10000000, 'MEDIUM'],
    [10000000, 50000000, 'HIGH'],
    [50000000, Infinity, 'CRITICAL'],
  ],
}

export const TIMELINE_RISK_RULES: [number, number, RiskLevel][] = [
  [0, 14, 'CRITICAL'],
  [15, 30, 'HIGH'],
  [31, 60, 'MEDIUM'],
  [61, 90, 'LOW'],
  [91, Infinity, 'Very Low'],
]

export const ONSITE_RISK_RULES: [number, number, RiskLevel][] = [
  [80, 100, 'HIGH'],
  [50, 79, 'MEDIUM'],
  [0, 49, 'LOW'],
]

export const SCORING_WEIGHTS = {
  security_certifications: 0.40,
  past_performance: 0.20,
  technical_capability: 0.15,
  compliance: 0.10,
  financial_capacity: 0.10,
  timeline_feasibility: 0.05,
} as const

export const SCORING_RUBRIC: Record<number, string> = {
  90: 'Fully met, verified, documented',
  70: 'Mostly met, minor gaps addressable',
  50: 'Partially met, significant effort needed',
  30: 'Mostly missing, unlikely to achieve',
  0: 'Completely missing, impossible before deadline',
}

export const GEMINI_CONFIG: GeminiConfig = {
  temperature: 0.0,
  top_p: 0.1,
  top_k: 1,
  max_output_tokens: 8192,
  candidate_count: 1,
}

export const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
]

export const DEFAULT_MODEL = 'gemini-1.5-flash'
export const MAX_RETRIES = 3
export const RETRY_BASE_DELAY = 2

export const ALL_CATEGORIES = [
  'Security Clearance',
  'CMMC Certification',
  'Cloud Authorization',
  'Facility Clearance',
  'Past Performance',
  'Technical Requirements',
  'Compliance',
  'Financial',
  'Timeline',
  'Personnel',
  'Subcontracting',
  'Supply Chain Risk Management',
] as const

export const REPORT_SECTIONS = [
  'Executive Summary',
  'Key Metrics',
  'Bid Readiness Score',
  'Bid/No-Bid Recommendation',
  'Required Actions',
  'Compliance Score',
  'Risk Heatmap',
  'Risk Details',
  'Extracted Requirements',
  'Recommended Next Steps',
  'Competitive Intelligence',
  'Cost & Investment',
] as const

export const MANDATORY_CONSEQUENCE = 'AUTOMATIC DISQUALIFICATION'
export const HIGH_CONSEQUENCE = 'Significant competitive disadvantage'
export const MEDIUM_CONSEQUENCE = 'Reduces competitiveness'
