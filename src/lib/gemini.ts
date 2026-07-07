import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

/* ═══════════════════════════════════════════════════════════════════
   v2.0 TYPES — RFP Compliance Analysis Engine
   ═══════════════════════════════════════════════════════════════════ */

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type SeverityIndicator = '🔴' | '🟠' | '🟡' | '🟢'
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type FARStatus = 'COMPLIANT' | 'MISSING' | 'NOT_REQUIRED'

export interface V2Metadata {
  compliance_score: number
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW'
  pages_analyzed: number
  total_pages: number
  processing_time: string
  agency: string | null
  contract_value: string | null
  naics_code: string | null
}

export interface V2Finding {
  severity: SeverityLevel
  indicator: SeverityIndicator
  finding: string
  source: string
  timeline: string
  consequence: string
  action: string
}

export interface V2FARClause {
  required: boolean
  present: boolean
  status: FARStatus
}

export interface V2AnalysisResult {
  metadata: V2Metadata
  critical_findings: V2Finding[]
  high_findings: V2Finding[]
  medium_findings: V2Finding[]
  low_findings: V2Finding[]
  top_recommendations: string[]
  far_compliance: Record<string, V2FARClause>
}

/* ═══════════════════════════════════════════════════════════════════
   LEGACY TYPES — kept for backward compatibility with paid analyzer
   ═══════════════════════════════════════════════════════════════════ */

export interface AnalysisResult {
  executiveSummary: string
  readinessScore: number
  scoreBreakdown: {
    complianceCompleteness: number
    capabilityMatch: number
    requirementClarity: number
    historicalPatterns: number
  }
  keyMetrics: {
    contractValue: string | null
    submissionDeadline: string | null
    agency: string | null
    naicsCode: string | null
    naicsDescription: string | null
    setAsideType: string | null
  }
  complianceChecklist: Array<{
    item: string
    status: 'pass' | 'warn' | 'fail'
  }>
  risks: Array<{
    level: 'High' | 'Medium' | 'Low'
    title: string
    description: string
  }>
  recommendations: string[]
}

/* ═══════════════════════════════════════════════════════════════════
   V2.0 SYSTEM PROMPT
   ═══════════════════════════════════════════════════════════════════ */

const V2_SYSTEM_PROMPT = `You are the BidRank.pro RFP Compliance Analysis Engine v2.0. Your sole function is to analyze government RFP documents and output a structured, prioritized compliance report.

You do not engage in conversation, provide legal advice, or deviate from this output format.

## OUTPUT FORMAT
Return ONLY valid JSON matching this exact structure:
{
  "metadata": {
    "compliance_score": 0-100,
    "risk_level": "HIGH" | "MEDIUM" | "LOW",
    "pages_analyzed": <estimated pages from text length / 3000>,
    "total_pages": <total if stated, otherwise same as pages_analyzed>,
    "processing_time": "estimated seconds as string e.g. 28s",
    "agency": "agency name or null",
    "contract_value": "$X or null",
    "naics_code": "code or null"
  },
  "critical_findings": [
    {
      "severity": "CRITICAL",
      "indicator": "🔴",
      "finding": "Exact requirement quoted or closely paraphrased from RFP",
      "source": "Section and paragraph reference (e.g. Section L.3.2)",
      "timeline": "Deadline from RFP or 'Immediate' if none stated",
      "consequence": "What happens if not met (e.g. automatic disqualification)",
      "action": "Specific step the user must take"
    }
  ],
  "high_findings": [
    { "severity": "HIGH", "indicator": "🟠", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "medium_findings": [
    { "severity": "MEDIUM", "indicator": "🟡", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "low_findings": [
    { "severity": "LOW", "indicator": "🟢", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "top_recommendations": [
    "recommendation 1 (highest severity)",
    "recommendation 2",
    "recommendation 3"
  ],
  "far_compliance": {
    "FAR 52.204-24": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.219-9": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.212-3": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "DFARS 252.204-7012": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.204-21": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" }
  }
}

## CRITICAL FINDINGS DETECTION (MANDATORY)
You MUST scan the RFP for ALL of the following. Flag each match as a 🔴 CRITICAL finding:

| Category | Detection Patterns | Action Required |
|----------|-------------------|-----------------|
| Security Clearance | "Secret", "Top Secret", "TS/SCI", "SCI" | Verify all personnel hold required clearance |
| CMMC Level | "CMMC Level 1/2/3", "CMMC 1/2/3", "DFARS 252.204-7012" | Verify certification level and timeline |
| FedRAMP | "FedRAMP", "FedRAMP Authorized", "FedRAMP Moderate/High" | Verify authorization status |
| Facility Clearance | "FCL", "Facility Clearance", "Facility Security Clearance" | Verify FCL held or obtainable |
| Contract Value | Any dollar amount > $10,000,000 | Flag financial capacity risk |
| Set-Aside | "SDVOSB", "WOSB", "8(a)", "HUBZone", "Small Business" | Verify eligibility |

Every 🔴 CRITICAL finding MUST include: finding, source (section/paragraph), timeline, consequence, and action.

## FAR COMPLIANCE RULES
- Check for each of the 5 FAR clauses listed above
- FAR 52.204-24 (SAM Registration): required for ALL proposals
- FAR 52.219-9 (Subcontracting Plan): required if contract value > $750K
- FAR 52.212-3 (Offeror Representations): required for ALL proposals
- DFARS 252.204-7012 (Cybersecurity/CMMC): required for DoD contracts
- FAR 52.204-21 (Basic Safeguarding): required for ALL proposals
- ONLY flag as "MISSING" if the RFP EXPLICITLY REFERENCES the clause
- If clause is not mentioned in RFP, mark as "NOT_REQUIRED"
- NEVER flag optional clauses as missing

## FORBIDDEN LANGUAGE — NEVER USE THESE PHRASES:
- "Not addressed in Section L"
- "Missing from requirements"
- "Not found in document"
- "Not addressed"
- "Missing from"
- "Not found"

## REQUIRED LANGUAGE REPLACEMENTS:
- Instead of "Past performance not addressed" → "Section L requires past performance references. Verify yours are relevant to the specific scope of work described."
- Instead of "Subcontracting plan missing" → "FAR 52.219-9 requires a subcontracting plan for contracts exceeding $750K. Verify you have one prepared."
- Instead of "FAR clause not found" → State "FAR 52.XXX-XX [required/not required] per RFP Section [Y]."

## RECOMMENDATIONS — GENERATE EXACTLY 3
Each recommendation MUST follow this template:
"[🔴/🟠/🟡] [SEVERITY]: This [Agency] RFP requires [specific requirement] ([Section X.Y]). [Action user must take] within [timeline]. Missing this = [consequence]."

Rules:
- Ordered by severity (CRITICAL first, then HIGH, then MEDIUM)
- Include the AGENCY NAME
- Include the EXACT SECTION/PARAGRAPH reference
- Include a TIMELINE or deadline
- State the CONSEQUENCE of non-compliance
- Be ACTIONABLE (not generic advice)

## SEVERITY CLASSIFICATION
- 🔴 CRITICAL: Will disqualify proposal if not met (e.g. missing clearance, missing required certification)
- 🟠 HIGH: Major compliance gap with significant score impact (e.g. missing CMMC Level 2, incomplete past performance)
- 🟡 MEDIUM: Needs attention, moderate risk (e.g. formatting issues, incomplete team qualifications)
- 🟢 LOW: Minor issue, informational (e.g. suggestions for stronger technical approach)

## RISK LEVEL (metadata)
- HIGH: 1+ CRITICAL findings present
- MEDIUM: No CRITICAL findings but 1+ HIGH findings
- LOW: Only MEDIUM and LOW findings

## COMPLIANCE SCORE (0-100)
Base score starts at 100. Deduct:
- Each CRITICAL finding: -15 points
- Each HIGH finding: -8 points
- Each MEDIUM finding: -3 points
- Each LOW finding: -1 point
- Each MISSING FAR clause: -10 points
Minimum score: 5 (never 0)

## GENERAL RULES
- Do NOT predict or guarantee contract awards
- If a metric is not found, use null
- Be honest about limitations
- Re-scan the document before flagging any item as missing — confirm it is truly absent
- Return ONLY valid JSON, no markdown, no explanation`

/* ═══════════════════════════════════════════════════════════════════
   V2.0 ANALYZER
   ═══════════════════════════════════════════════════════════════════ */

export async function analyzeRFPV2(rfpText: string): Promise<V2AnalysisResult> {
  const startTime = Date.now()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

  // ── Pre-flight exception checks ────────────────────────────────
  const exception = preFlightCheck(rfpText)
  if (exception) throw new Error(exception)

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = `${V2_SYSTEM_PROMPT}

RFP TEXT:
${rfpText}

Return ONLY valid JSON, no markdown, no explanation.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const processingTime = ((Date.now() - startTime) / 1000).toFixed(0) + 's'

  // Parse JSON
  const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(jsonStr) as V2AnalysisResult

  // ── Validate and fix ──────────────────────────────────────────
  const validated = validateAndFix(parsed, rfpText, processingTime)

  // ── Quality gates ─────────────────────────────────────────────
  runQualityGates(validated, rfpText)

  return validated
}

/* ═══════════════════════════════════════════════════════════════════
   FREE-TIER FAST ANALYSIS
   Uses thinkingBudget=0 to skip the reasoning phase — 3-4x faster.
   Hard timeout of 45s so Vercel never kills the function silently.
   ═══════════════════════════════════════════════════════════════════ */

export async function analyzeRFPFree(rfpText: string): Promise<V2AnalysisResult> {
  const startTime = Date.now()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

  const exception = preFlightCheck(rfpText)
  if (exception) throw new Error(exception)

  // Truncate to 25 000 chars for the free tier to keep latency low
  const truncated = rfpText.length > 25_000
    ? rfpText.slice(0, 25_000) + '\n\n[Document truncated for free-tier analysis — upgrade for full document analysis]'
    : rfpText

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    // @ts-expect-error — thinkingConfig is a valid runtime field not yet in types
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
  })

  const prompt = `${V2_SYSTEM_PROMPT}

RFP TEXT:
${truncated}

Return ONLY valid JSON, no markdown, no explanation.`

  // 45-second hard timeout so we always return before Vercel's 60s limit
  const timeoutMs = 45_000
  const result = await Promise.race([
    model.generateContent(prompt),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timed out. The document may be too complex — please try a shorter excerpt or upgrade for priority processing.')), timeoutMs)
    ),
  ])

  const response = (result as Awaited<ReturnType<typeof model.generateContent>>).response.text()
  const processingTime = ((Date.now() - startTime) / 1000).toFixed(0) + 's'

  const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(jsonStr) as V2AnalysisResult

  const validated = validateAndFix(parsed, truncated, processingTime)
  runQualityGates(validated, truncated)

  return validated
}

/* ═══════════════════════════════════════════════════════════════════
   PRE-FLIGHT EXCEPTION CHECKS
   ═══════════════════════════════════════════════════════════════════ */

function preFlightCheck(text: string): string | null {
  if (!text || text.trim().length < 50) {
    return 'Unable to parse document. Please upload a text-readable PDF.'
  }

  // Check for completely unreadable content (garbled text)
  const printableRatio = (text.match(/[\x20-\x7E\n\r\t]/g) || []).length / text.length
  if (printableRatio < 0.3) {
    return 'Unable to parse document. Please upload a text-readable PDF.'
  }

  // Check for standard RFP structure
  const hasSectionL = /section\s*L\b/i.test(text)
  const hasRFPIndicators = /solicitation|request for (proposal|quotation|information)|RFP|RFQ|RFI/i.test(text)

  if (!hasSectionL && !hasRFPIndicators) {
    return 'Standard RFP structure not detected. Analysis may be incomplete.'
  }

  return null
}

/* ═══════════════════════════════════════════════════════════════════
   VALIDATION & FIXING
   ═══════════════════════════════════════════════════════════════════ */

const SEVERITY_INDICATORS: Record<string, string> = {
  CRITICAL: '🔴',
  HIGH: '🟠',
  MEDIUM: '🟡',
  LOW: '🟢',
}

function validateAndFix(
  parsed: V2AnalysisResult,
  rfpText: string,
  processingTime: string
): V2AnalysisResult {
  // Ensure all arrays exist
  parsed.critical_findings = ensureArray(parsed.critical_findings)
  parsed.high_findings = ensureArray(parsed.high_findings)
  parsed.medium_findings = ensureArray(parsed.medium_findings)
  parsed.low_findings = ensureArray(parsed.low_findings)
  parsed.top_recommendations = ensureArray(parsed.top_recommendations).slice(0, 3)

  // Fix severity indicators
  for (const arr of [parsed.critical_findings, parsed.high_findings, parsed.medium_findings, parsed.low_findings] as V2Finding[][]) {
    for (const f of arr) {
      f.indicator = SEVERITY_INDICATORS[f.severity] || '🟡'
    }
  }

  // Fix metadata
  if (!parsed.metadata) {
    parsed.metadata = {
      compliance_score: 50,
      risk_level: 'MEDIUM',
      pages_analyzed: Math.ceil(rfpText.length / 3000),
      total_pages: Math.ceil(rfpText.length / 3000),
      processing_time: processingTime,
      agency: null,
      contract_value: null,
      naics_code: null,
    }
  } else {
    parsed.metadata.processing_time = processingTime
    if (!parsed.metadata.pages_analyzed) {
      parsed.metadata.pages_analyzed = Math.ceil(rfpText.length / 3000)
    }
    if (!parsed.metadata.total_pages) {
      parsed.metadata.total_pages = parsed.metadata.pages_analyzed
    }
    // Clamp compliance score
    parsed.metadata.compliance_score = Math.max(5, Math.min(100, Math.round(parsed.metadata.compliance_score || 50)))
  }

  // Fix agency if null but detectable
  if (!parsed.metadata.agency) {
    parsed.metadata.agency = detectAgency(rfpText)
  }

  // Fix contract value if null but detectable
  if (!parsed.metadata.contract_value) {
    parsed.metadata.contract_value = detectContractValue(rfpText)
  }

  // Fix NAICS code if null
  if (!parsed.metadata.naics_code) {
    parsed.metadata.naics_code = detectNAICS(rfpText)
  }

  // Fix risk level based on findings
  if (parsed.critical_findings.length > 0) {
    parsed.metadata.risk_level = 'HIGH'
  } else if (parsed.high_findings.length > 0) {
    parsed.metadata.risk_level = 'MEDIUM'
  } else {
    parsed.metadata.risk_level = 'LOW'
  }

  // Ensure FAR compliance exists
  if (!parsed.far_compliance) {
    parsed.far_compliance = buildDefaultFARCompliance(rfpText)
  }

  // Enforce forbidden language in all findings
  enforceLanguageRules(parsed)

  return parsed
}

/* ═══════════════════════════════════════════════════════════════════
   DETECTION HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function detectAgency(text: string): string | null {
  const agencies = [
    /Department of (Defense|the Army|the Navy|the Air Force|Veterans Affairs|Homeland Security|Justice|Energy|Health and Human Services|Transportation|State|Treasury|Commerce|Labor|Education|Housing and Urban Development|Agriculture|Interior)/i,
    /\b(DOA|DOD|DON|DOA|DOJ|DOE|DHS|DOT|DOS|VA|HHS|NASA|GSA|FBI|DIA|NSA|EPA|FEMA|USDA|USAF|USMC|USN)\b/i,
    /National (Institutes of Health|Aeronautics and Space Administration|Security Agency|Oceanic and Atmospheric Administration)/i,
    /Federal (Bureau of Investigation|Aviation Administration|Emergency Management Agency|Communications Commission|Trade Commission)/i,
    /Defense (Logistics Agency|Information Systems Agency|Contract Management Agency|Intelligence Agency)/i,
    /\b(NAVSEA|NAVAIR|USAF|AFWERX|SOCOM|TRANSCOM|STRATCOM|CYBERCOM)\b/i,
  ]

  for (const pattern of agencies) {
    const match = text.match(pattern)
    if (match) return match[0].trim()
  }
  return null
}

function detectContractValue(text: string): string | null {
  // Match patterns like "$15,000,000", "$10M", "15 million", etc.
  const patterns = [
    /\$\s*[\d,]+(?:\.\d{1,2})?\s*(?:million|M)/i,
    /\$[\d,]+(?:\.\d{1,2})?\s*-\s*\$[\d,]+(?:\.\d{1,2})?/,
    /\$[\d,]+(?:\.\d{1,2})?/,
    /(?:estimated|approximate|maximum|ceiling)\s*(?:value|price|amount)\s*(?:of|is|:)?\s*\$?[\d,.]+\s*(?:million|M)?/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[0].trim()
  }
  return null
}

function detectNAICS(text: string): string | null {
  const match = text.match(/NAICS\s*(?:Code)?[:\s]*(\d{4,6})/i)
  return match ? match[1] : null
}

/* ═══════════════════════════════════════════════════════════════════
   FAR COMPLIANCE DEFAULTS
   ═══════════════════════════════════════════════════════════════════ */

function buildDefaultFARCompliance(text: string): Record<string, V2FARClause> {
  const isDoD = /department of defense|DoD|DFARS/i.test(text)
  const value = detectContractValue(text)
  const valueNum = parseDollarValue(value)
  const isLargeContract = valueNum !== null && valueNum > 750_000

  return {
    'FAR 52.204-24': {
      required: true,
      present: /52\.204-24|SAM registration|System for Award Management/i.test(text),
      status: /52\.204-24|SAM registration|System for Award Management/i.test(text) ? 'COMPLIANT' : 'MISSING',
    },
    'FAR 52.219-9': {
      required: isLargeContract,
      present: /52\.219-9|subcontract(?:ing)?\s*plan/i.test(text),
      status: /52\.219-9|subcontract(?:ing)?\s*plan/i.test(text)
        ? 'COMPLIANT'
        : isLargeContract
          ? 'MISSING'
          : 'NOT_REQUIRED',
    },
    'FAR 52.212-3': {
      required: true,
      present: /52\.212-3|offeror representations/i.test(text),
      status: /52\.212-3|offeror representations/i.test(text) ? 'COMPLIANT' : 'MISSING',
    },
    'DFARS 252.204-7012': {
      required: isDoD,
      present: /252\.204-7012|CMMC|cybersecurity/i.test(text),
      status: /252\.204-7012|CMMC|cybersecurity/i.test(text)
        ? 'COMPLIANT'
        : isDoD
          ? 'MISSING'
          : 'NOT_REQUIRED',
    },
    'FAR 52.204-21': {
      required: true,
      present: /52\.204-21|basic safeguarding/i.test(text),
      status: /52\.204-21|basic safeguarding/i.test(text) ? 'COMPLIANT' : 'NOT_REQUIRED',
    },
  }
}

function parseDollarValue(value: string | null): number | null {
  if (!value) return null
  const cleaned = value.replace(/[$,\s]/g, '').toLowerCase()
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  if (/million|m$/.test(cleaned)) return num * 1_000_000
  if (/billion|b$/.test(cleaned)) return num * 1_000_000_000
  return num
}

/* ═══════════════════════════════════════════════════════════════════
   FORBIDDEN LANGUAGE ENFORCEMENT
   ═══════════════════════════════════════════════════════════════════ */

const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /not addressed in Section L/gi, replacement: 'verify compliance per Section L requirements' },
  { pattern: /missing from requirements/gi, replacement: 'verify this requirement is addressed in your proposal' },
  { pattern: /not found in document/gi, replacement: 'could not be confirmed in the reviewed sections' },
  { pattern: /not addressed(?!\s*per)/gi, replacement: 'verify compliance' },
  { pattern: /missing from(?!\s*the)/gi, replacement: 'requires verification for' },
  { pattern: /not found(?!\s*in the reviewed)/gi, replacement: 'not confirmed in reviewed sections' },
]

function enforceLanguageRules(result: V2AnalysisResult): void {
  const allFindings = [
    ...result.critical_findings,
    ...result.high_findings,
    ...result.medium_findings,
    ...result.low_findings,
  ]

  for (const finding of allFindings) {
    for (const field of ['finding', 'action', 'consequence'] as const) {
      let text = finding[field]
      if (typeof text !== 'string') continue
      for (const { pattern, replacement } of FORBIDDEN_PATTERNS) {
        text = text.replace(pattern, replacement)
      }
      finding[field] = text
    }
  }

  // Also clean recommendations
  result.top_recommendations = result.top_recommendations.map((rec) => {
    let text = rec
    for (const { pattern, replacement } of FORBIDDEN_PATTERNS) {
      text = text.replace(pattern, replacement)
    }
    return text
  })
}

/* ═══════════════════════════════════════════════════════════════════
   QUALITY GATES
   ═══════════════════════════════════════════════════════════════════ */

function runQualityGates(result: V2AnalysisResult, rfpText: string): void {
  const gates: Array<{ name: string; passed: boolean }> = []

  // Gate 1: Critical triggers detected
  const criticalTriggers = [
    { pattern: /\b(Secret|Top Secret|TS\/SCI|SCI)\b/i, label: 'Security Clearance' },
    { pattern: /\bCMMC\s*(Level\s*)?[1-3]\b|\bDFARS\s*252\.204-7012\b/i, label: 'CMMC' },
    { pattern: /\bFedRAMP\b/i, label: 'FedRAMP' },
    { pattern: /\b(FCL|Facility\s*(Security\s*)?Clearance)\b/i, label: 'FCL' },
  ]
  const hasCriticalInRFP = criticalTriggers.some((t) => t.pattern.test(rfpText))
  const hasCriticalFinding = result.critical_findings.length > 0
  gates.push({
    name: 'Critical triggers detected',
    passed: !hasCriticalInRFP || hasCriticalFinding,
  })

  // Gate 2: No false positives on "MISSING" FAR items
  for (const [clause, data] of Object.entries(result.far_compliance)) {
    if (data.status === 'MISSING' && !data.required) {
      // Fix false positive: if not required, can't be missing
      data.status = 'NOT_REQUIRED'
    }
  }
  const noFalsePositives = Object.values(result.far_compliance).every(
    (c) => c.status !== 'MISSING' || c.required
  )
  gates.push({ name: 'No false positives on MISSING items', passed: noFalsePositives })

  // Gate 3: Recommendations have agency, section, timeline
  const agency = result.metadata.agency
  const recsHaveAgency = result.top_recommendations.every(
    (r) => !agency || r.toLowerCase().includes(agency.toLowerCase().split(' ').slice(-1)[0]) || /this agency/i.test(r) || /section\s+\w/i.test(r)
  )
  gates.push({ name: 'Recommendations include specificity', passed: recsHaveAgency })

  // Gate 4: All CRITICAL findings have source, timeline, consequence, action
  const criticalsComplete = result.critical_findings.every(
    (f) => f.source && f.timeline && f.consequence && f.action
  )
  gates.push({ name: 'CRITICAL findings complete', passed: criticalsComplete })

  // Gate 5: No forbidden language
  const allText = [
    ...result.critical_findings.map((f) => `${f.finding} ${f.action} ${f.consequence}`),
    ...result.high_findings.map((f) => `${f.finding} ${f.action} ${f.consequence}`),
    ...result.top_recommendations.join(' '),
  ].join(' ')
  const hasForbidden = FORBIDDEN_PATTERNS.some((p) => p.pattern.test(allText))
  gates.push({ name: 'No forbidden language', passed: !hasForbidden })

  // Gate 6: Exactly 3 recommendations
  gates.push({ name: 'Exactly 3 recommendations', passed: result.top_recommendations.length === 3 })

  // Log quality gate results (silent in production, visible in dev)
  if (process.env.NODE_ENV === 'development') {
    const failed = gates.filter((g) => !g.passed)
    if (failed.length > 0) {
      console.warn('[BidRank v2.0] Quality gates FAILED:', failed.map((g) => g.name))
    } else {
      console.log('[BidRank v2.0] All quality gates passed')
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════════════════════ */

function ensureArray<T>(val: T[] | undefined | null): T[] {
  return Array.isArray(val) ? val : []
}

/* ═══════════════════════════════════════════════════════════════════
   LEGACY ANALYZER (kept for paid tool backward compatibility)
   ═══════════════════════════════════════════════════════════════════ */

export async function analyzeRFP(rfpText: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = `You are an expert federal contracting analyst. Analyze the following RFP and return a JSON object with this exact structure. Be thorough, specific, and honest. Never predict contract awards or guarantee outcomes.

{
  "executiveSummary": "3-5 sentence strategic overview",
  "readinessScore": 0-100,
  "scoreBreakdown": {
    "complianceCompleteness": 0-100,
    "capabilityMatch": 0-100,
    "requirementClarity": 0-100,
    "historicalPatterns": 0-100
  },
  "keyMetrics": {
    "contractValue": "$X or null",
    "submissionDeadline": "date or null",
    "agency": "agency name or null",
    "naicsCode": "code or null",
    "naicsDescription": "description or null",
    "setAsideType": "type or null"
  },
  "complianceChecklist": [
    { "item": "description", "status": "pass|warn|fail" }
  ],
  "risks": [
    { "level": "High|Medium|Low", "title": "short title", "description": "one paragraph" }
  ],
  "recommendations": ["actionable step 1", "actionable step 2", ...]
}

CRITICAL RULES:
- readinessScore is 0-100 based on compliance, capability match, clarity, and historical patterns
- Include at least 5 compliance items and 5 risks
- Include exactly 5 recommendations
- If a metric is not found in the text, use null
- Be honest about limitations
- Do NOT say anything that could be interpreted as predicting or guaranteeing a contract award

RFP TEXT:
${rfpText}

Return ONLY valid JSON, no markdown, no explanation.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()

  const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(jsonStr) as AnalysisResult

  parsed.readinessScore = Math.max(0, Math.min(100, Math.round(parsed.readinessScore || 0)))

  if (!parsed.risks || parsed.risks.length === 0) parsed.risks = []
  if (!parsed.complianceChecklist || parsed.complianceChecklist.length === 0) parsed.complianceChecklist = []
  if (!parsed.recommendations || parsed.recommendations.length === 0) parsed.recommendations = []

  return parsed
}