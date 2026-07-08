import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

/* ═══════════════════════════════════════════════════════════════════
   v2.1 TYPES — RFP Compliance Analysis Engine
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
  set_aside: string | null
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

export interface V2Requirement {
  id: string
  section: string
  requirement: string
  priority: 'Critical' | 'Important' | 'Nice-to-Have'
  status: 'Met' | 'Partial' | 'Missing'
}

export interface V2AnalysisResult {
  metadata: V2Metadata
  risk_heatmap: Record<string, 'Critical' | 'High' | 'Medium' | 'Low'>
  requirement_extractor: V2Requirement[]
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
   V2.1 SYSTEM PROMPT
   ═══════════════════════════════════════════════════════════════════ */

const V2_SYSTEM_PROMPT = `You are the BidRank.pro RFP Compliance Analysis Engine v2.1. Your sole function is to:
- Ingest PDF or text-based government RFP documents
- Extract and analyze key sections (L, M, K, B, J, H)
- Identify compliance gaps, risks, and critical requirements
- Output a structured, prioritized compliance report

Constraint: You do not engage in conversation, provide legal advice, or deviate from this output format.

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
    "naics_code": "code or null",
    "set_aside": "set-aside type or null"
  },
  "risk_heatmap": {
    "technical_requirements": "Critical" | "High" | "Medium" | "Low",
    "compliance": "Critical" | "High" | "Medium" | "Low",
    "financial": "Critical" | "High" | "Medium" | "Low",
    "security_clearance": "Critical" | "High" | "Medium" | "Low",
    "timeline": "Critical" | "High" | "Medium" | "Low",
    "subcontracting": "Critical" | "High" | "Medium" | "Low",
    "past_performance": "Critical" | "High" | "Medium" | "Low",
    "personnel": "Critical" | "High" | "Medium" | "Low"
  },
  "requirement_extractor": [
    {
      "id": "REQ-001",
      "section": "Section L",
      "requirement": "Exact requirement text from RFP",
      "priority": "Critical" | "Important" | "Nice-to-Have",
      "status": "Met" | "Partial" | "Missing"
    }
  ],
  "critical_findings": [
    {
      "severity": "CRITICAL",
      "indicator": "\\u{1F534}",
      "finding": "Exact requirement quoted or closely paraphrased from RFP",
      "source": "Section and paragraph reference (e.g. Section L.3.2)",
      "timeline": "Deadline from RFP or 'Immediate' if none stated",
      "consequence": "What happens if not met (e.g. automatic disqualification)",
      "action": "Specific step the user must take"
    }
  ],
  "high_findings": [
    { "severity": "HIGH", "indicator": "\\u{1F7E0}", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "medium_findings": [
    { "severity": "MEDIUM", "indicator": "\\u{1F7E1}", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "low_findings": [
    { "severity": "LOW", "indicator": "\\u{1F7E2}", "finding": "...", "source": "...", "timeline": "...", "consequence": "...", "action": "..." }
  ],
  "top_recommendations": [
    "recommendation 1 (highest severity)",
    "recommendation 2",
    "recommendation 3",
    "recommendation 4",
    "recommendation 5"
  ],
  "far_compliance": {
    "FAR 52.204-24": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.219-9": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.212-3": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "DFARS 252.204-7012": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" },
    "FAR 52.204-21": { "required": true/false, "present": true/false, "status": "COMPLIANT" | "MISSING" | "NOT_REQUIRED" }
  }
}

## CRITICAL FINDINGS DETECTION (MANDATORY — P0)
You MUST scan the RFP for ALL of the following. Flag each match as a CRITICAL finding:

| Category | Detection Patterns | Required Action | UI Section |
|----------|-------------------|-----------------|------------|
| Security Clearance | "Secret", "Top Secret", "TS/SCI", "clearance for key/all personnel" | Verify all personnel hold required clearance | Risk Heatmap + Details + Extractor |
| CMMC Level | "CMMC Level [123]", "DFARS 252.204-7012" | Verify certification level and timeline | Requirement Extractor |
| FedRAMP | "FedRAMP", "FedRAMP Authorized", "cloud authorization" | Verify authorization status | Requirement Extractor |
| Facility Clearance | "FCL", "Facility Clearance", "FCL required" | Verify FCL held or obtainable | Requirement Extractor |
| Contract Value | >$2M for 8(a) / >$10M general | Flag financial capacity risk | Risk Heatmap + Financial |
| Set-Aside | "SDVOSB", "WOSB", "8(a)", "HUBZone" | Verify eligibility | Set-Aside Type + Score Card |

### Zero-Tolerance Rules:
- NO "Medium" or "Low" classification for security clearance — ALWAYS "High" or "Critical"
- NO "Low" financial risk at >$2M for 8(a) companies
- NO ignoring CMMC, FedRAMP, or FCL in DoD cloud contracts

### Critical Finding Format (Unified Across All Sections):
CRITICAL: [Exact requirement from RFP]
Source: [Section and paragraph]
Timeline: [Deadline from RFP, or "Immediate"]
Consequence: [What happens if not met]
Action: [Specific step the user must take]

## CONSISTENCY ACROSS ALL SECTIONS (P0 — MANDATORY)
MUST match severity level for the same item across ALL report sections:

| Item | Risk Heatmap | Risk Details | Req. Extractor | Compliance Score Card |
|------|-------------|--------------|----------------|----------------------|
| Security Clearance | Critical | High or Critical | Critical | "Missing" = Critical |
| Past Performance | Medium | Medium | Critical (if <3/3) | "2 of 3" = Medium |
| Financial Requirements | Medium | — | — | 45% = Medium |
| Timeline | High | High | — | — |

## FINANCIAL RISK ANALYSIS
Use these thresholds when setting the "financial" risk_heatmap value:

| Company Type | Contract Value | Financial Risk Level |
|-------------|---------------|---------------------|
| 8(a) / Small | >$1M | Medium |
| 8(a) / Small | >$2M | High |
| 8(a) / Small | >$5M | Critical |
| General | >$10M | High |
| General | >$25M | Critical |

Additional risk factors: bonding requirements not documented, security clearance costs, CMMC/FedRAMP certification costs, FCL inspection costs.

## FAR COMPLIANCE RULES
- Check for each of the 5 FAR clauses listed in the output format
- FAR 52.204-24 (SAM Registration): required for ALL proposals
- FAR 52.219-9 (Subcontracting Plan): required if contract value > $750K
- FAR 52.212-3 (Offeror Representations): required for ALL proposals
- DFARS 252.204-7012 (Cybersecurity/CMMC): required for DoD contracts
- FAR 52.204-21 (Basic Safeguarding): required for ALL proposals
- ONLY flag as "MISSING" if the RFP EXPLICITLY REFERENCES the clause
- If clause is not mentioned in RFP, mark as "NOT_REQUIRED"
- NEVER flag optional clauses as missing

## REQUIREMENT EXTRACTOR RULES
- Extract ALL requirements from Sections L, M, H, K, B, J
- Each requirement gets a unique ID: REQ-001, REQ-002, etc.
- Priority: "Critical" = mandatory, "Important" = evaluated, "Nice-to-Have" = optional
- Status: "Met" = clearly addressed, "Partial" = partially addressed, "Missing" = not addressed
- Security clearance, CMMC, FedRAMP, FCL requirements MUST appear in the extractor

## FORBIDDEN LANGUAGE — NEVER USE THESE PHRASES:
- "Not addressed in Section L"
- "Missing from requirements"
- "Not found in document"
- "Not documented" (without context)
- "Not addressed"
- "Missing from"
- "Not found"

## REQUIRED LANGUAGE REPLACEMENTS:
- Instead of "Past performance not addressed" -> "Section L requires [X] past performance references. Verify yours are relevant to [specific scope]."
- Instead of "Subcontracting plan missing" -> "FAR 52.219-9 requires a subcontracting plan for contracts exceeding $750K. Verify you have one prepared."
- Instead of "Security Clearance Documentation Missing" -> "CRITICAL: RFP requires [Secret/Top Secret] for [key/all] personnel. Verify active clearances."
- Instead of "Bonding Capacity Not Documented" -> "Bonding capacity not documented — verify coverage for [contract value]."
- Instead of "FAR clause not found" -> State "FAR 52.XXX-XX [required/not required] per RFP Section [Y]."

## RECOMMENDATIONS — GENERATE EXACTLY 5
Each recommendation MUST follow this template:
"[SEVERITY]: This [Agency] RFP requires [specific requirement] ([Section X.Y]). [Action user must take] within [timeline]. Missing this = [consequence]."

Rules:
- Exactly 5 recommendations (ordered Critical -> High -> Medium)
- Each MUST include: agency name, exact RFP section/paragraph, timeline, consequence, specific action
- Match the severity indicators from findings: Critical, High, Medium

### Correct Example:
"CRITICAL: This DoD RFP requires Secret clearance for ALL key personnel (Section H.4.2). Begin clearance process or identify cleared subcontractor within 14 days. Missing this = automatic disqualification."

### Incorrect Example (DO NOT DO THIS):
"Address the security clearance requirement immediately" (generic, no Secret mention, no section, no consequence)

## SEVERITY CLASSIFICATION
- CRITICAL: Will disqualify proposal if not met (missing clearance, missing required certification)
- HIGH: Major compliance gap with significant score impact (missing FedRAMP, high value for small business)
- MEDIUM: Needs attention, moderate risk (incomplete past performance, subcontracting plan)
- LOW: Minor issue, informational (evaluation criteria weight distribution)

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
- Return ONLY valid JSON, no markdown, no explanation
- Before returning, verify ALL quality gates pass (see below)

## QUALITY GATES (verify before returning)
- All critical triggers detected (Secret/TS, CMMC, FedRAMP, FCL)
- Consistency: Severity matches across Risk Heatmap + Details + Extractor
- Security Clearance = High or Critical in Risk Details (NOT Medium)
- Financial Requirements = Medium minimum at >$2M for 8(a)
- CMMC / FedRAMP / FCL present in Requirement Extractor for DoD cloud
- Recommendations include agency name, section, timeline, consequence
- Exactly 5 recommendations
- FAR compliance only flags clauses explicitly referenced in RFP
If any gate fails, re-process before returning.`

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
  // Pass thinkingConfig via the generationConfig field supported at runtime
  // but not yet reflected in the SDK's TypeScript types.
  const modelConfig = {
    model: 'gemini-2.5-flash',
    generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as Record<string, unknown>,
  }
  const model = genAI.getGenerativeModel(modelConfig)

  const prompt = `${V2_SYSTEM_PROMPT}

RFP TEXT:
${truncated}

Return ONLY valid JSON, no markdown, no explanation.`

  // 45-second hard timeout — always returns before Vercel's 60s function limit.
  // The timer is cleared in `finally` so it never leaks across requests.
  const timeoutMs = 45_000
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error('Analysis timed out. The document may be too complex — please try a shorter excerpt or upgrade for priority processing.')),
      timeoutMs,
    )
  })

  let response: string
  try {
    const result = await Promise.race([model.generateContent(prompt), timeoutPromise])
    response = result.response.text()
  } finally {
    clearTimeout(timeoutId)
  }

  const processingTime = ((Date.now() - startTime) / 1000).toFixed(0) + 's'

  // Safe JSON parse — map malformed model output to a structured 422 error
  // rather than a generic 500 that loses the failure reason.
  const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  let parsed: V2AnalysisResult
  try {
    parsed = JSON.parse(jsonStr) as V2AnalysisResult
  } catch {
    throw new Error('Unable to parse analysis output. The AI returned an unexpected format — please try again.')
  }

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

const SEVERITY_INDICATORS: Record<SeverityLevel, SeverityIndicator> = {
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
  parsed.top_recommendations = ensureArray(parsed.top_recommendations).slice(0, 5)

  // Fix severity indicators
  for (const arr of [parsed.critical_findings, parsed.high_findings, parsed.medium_findings, parsed.low_findings] as V2Finding[][]) {
    for (const f of arr) {
      f.indicator = SEVERITY_INDICATORS[f.severity] || '🟡'
    }
  }

  // ── Ensure risk_heatmap exists ──────────────────────────────
  if (!parsed.risk_heatmap) {
    parsed.risk_heatmap = buildDefaultRiskHeatmap(rfpText, parsed)
  }

  // ── Ensure requirement_extractor exists ─────────────────────
  if (!parsed.requirement_extractor || parsed.requirement_extractor.length === 0) {
    parsed.requirement_extractor = buildDefaultRequirements(rfpText)
  }

  // ── Ensure FAR compliance exists FIRST ───────────────────────
  // Must be built before score calculation so missingFARs is accurate.
  if (!parsed.far_compliance) {
    parsed.far_compliance = buildDefaultFARCompliance(rfpText)
  }

  // ── Score cross-validation: recalculate from findings ──────────
  // The prompt tells the AI to start at 100 and deduct per finding, but
  // the AI frequently ignores its own formula.  We recalculate here and
  // use the LOWER of AI score vs calculated score so the result is
  // never more optimistic than the evidence warrants.
  const missingFARs = Object.values(parsed.far_compliance).filter(
    (c) => c.status === 'MISSING'
  ).length
  const calculatedScore = Math.max(
    5,
    100
      - parsed.critical_findings.length * 15
      - parsed.high_findings.length * 8
      - parsed.medium_findings.length * 3
      - parsed.low_findings.length * 1
      - missingFARs * 10,
  )

  // Fix metadata
  if (!parsed.metadata) {
    parsed.metadata = {
      compliance_score: calculatedScore,
      risk_level: 'MEDIUM',
      pages_analyzed: Math.ceil(rfpText.length / 3000),
      total_pages: Math.ceil(rfpText.length / 3000),
      processing_time: processingTime,
      agency: null,
      contract_value: null,
      naics_code: null,
      set_aside: null,
    }
  } else {
    parsed.metadata.processing_time = processingTime
    if (!parsed.metadata.pages_analyzed) {
      parsed.metadata.pages_analyzed = Math.ceil(rfpText.length / 3000)
    }
    if (!parsed.metadata.total_pages) {
      parsed.metadata.total_pages = parsed.metadata.pages_analyzed
    }
    // Use the LOWER of AI score vs formula-derived score
    const aiScore = Math.max(5, Math.min(100, Math.round(parsed.metadata.compliance_score || 50)))
    parsed.metadata.compliance_score = Math.min(aiScore, calculatedScore)
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

  // Fix set_aside if null
  if (!parsed.metadata.set_aside) {
    parsed.metadata.set_aside = detectSetAside(rfpText)
  }

  // Fix risk level: derive from BOTH findings AND score for consistency
  // A high score with CRITICAL findings, or a low score with no findings,
  // both indicate a mismatch — risk level should reflect the worse signal.
  const score = parsed.metadata.compliance_score
  const hasCriticals = parsed.critical_findings.length > 0
  const hasHighs = parsed.high_findings.length > 0

  let riskFromFindings: 'HIGH' | 'MEDIUM' | 'LOW'
  if (hasCriticals) riskFromFindings = 'HIGH'
  else if (hasHighs) riskFromFindings = 'MEDIUM'
  else riskFromFindings = 'LOW'

  let riskFromScore: 'HIGH' | 'MEDIUM' | 'LOW'
  if (score < 40) riskFromScore = 'HIGH'
  else if (score < 65) riskFromScore = 'MEDIUM'
  else riskFromScore = 'LOW'

  // Take the MORE conservative (worse) risk level
  const riskOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }
  parsed.metadata.risk_level =
    riskOrder[riskFromFindings] <= riskOrder[riskFromScore] ? riskFromFindings : riskFromScore

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

function detectSetAside(text: string): string | null {
  const patterns: Array<{ re: RegExp; label: string }> = [
    { re: /\b8\s*\(\s*a\s*\)\s*(?:Only|sole\s*source|certified)/i, label: '8(a) Only' },
    { re: /\b8\s*\(\s*a\s*\)/i, label: '8(a)' },
    { re: /\bSDVOSB\b/i, label: 'SDVOSB' },
    { re: /\bWOSB\b/i, label: 'WOSB' },
    { re: /\bHUBZone\b/i, label: 'HUBZone' },
    { re: /\bService-Disabled Veteran-Owned\b/i, label: 'SDVOSB' },
    { re: /\bWomen-Owned Small Business\b/i, label: 'WOSB' },
    { re: /\bHistorically Underutilized Business Zone\b/i, label: 'HUBZone' },
    { re: /\bSmall Business\s*(?:Set-Aside|only)?\b/i, label: 'Small Business' },
  ]
  for (const { re, label } of patterns) {
    if (re.test(text)) return label
  }
  return null
}

/* ═══════════════════════════════════════════════════════════════════
   DEFAULT RISK HEATMAP & REQUIREMENT EXTRACTOR
   ═══════════════════════════════════════════════════════════════════ */

function buildDefaultRiskHeatmap(
  text: string,
  _parsed: V2AnalysisResult
): Record<string, 'Critical' | 'High' | 'Medium' | 'Low'> {
  const value = detectContractValue(text)
  const valueNum = parseDollarValue(value)
  const isSmallBiz = /\b(small business|8\s*\(\s*a\s*\)|SDVOSB|WOSB|HUBZone)\b/i.test(text)
  const isDoD = /department of defense|DoD|DFARS/i.test(text)
  const hasSecurityClearance = /\b(Secret|Top Secret|TS\/SCI|clearance)\b/i.test(text)
  const hasCMMC = /\bCMMC\b/i.test(text)
  const hasFedRAMP = /\bFedRAMP\b/i.test(text)
  const hasFCL = /\b(FCL|Facility\s*(Security\s*)?Clearance)\b/i.test(text)
  const hasSubcontracting = /subcontract(?:ing)?\s*plan/i.test(text)
  const hasPastPerf = /past performance/i.test(text)

  // Financial risk based on v2.1 thresholds
  let financial: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low'
  if (isSmallBiz && valueNum !== null) {
    if (valueNum > 5_000_000) financial = 'Critical'
    else if (valueNum > 2_000_000) financial = 'High'
    else if (valueNum > 1_000_000) financial = 'Medium'
  } else if (!isSmallBiz && valueNum !== null) {
    if (valueNum > 25_000_000) financial = 'Critical'
    else if (valueNum > 10_000_000) financial = 'High'
  }

  // Security clearance: always High or Critical per zero-tolerance rule
  const securityClearance: 'Critical' | 'High' | 'Medium' | 'Low' =
    hasSecurityClearance ? (/\bTop Secret\b/i.test(text) ? 'Critical' : 'High') : 'Low'

  return {
    technical_requirements: 'Medium',
    compliance: 'Medium',
    financial,
    security_clearance: securityClearance,
    timeline: 'Medium',
    subcontracting: hasSubcontracting ? 'Medium' : 'Low',
    past_performance: hasPastPerf ? 'Medium' : 'Low',
    personnel: 'Low',
  }
}

function buildDefaultRequirements(text: string): V2Requirement[] {
  const reqs: V2Requirement[] = []
  let id = 1

  const addReq = (section: string, requirement: string, priority: 'Critical' | 'Important' | 'Nice-to-Have', status: 'Met' | 'Partial' | 'Missing') => {
    reqs.push({ id: `REQ-${String(id++).padStart(3, '0')}`, section, requirement, priority, status })
  }

  // Security clearance
  if (/\b(Secret|Top Secret|TS\/SCI)\b/i.test(text)) {
    const match = text.match(/\b(Secret|Top Secret|TS\/SCI)\b/i)
    addReq('Section H', `${match?.[0] || 'Security'} clearance for key personnel`, 'Critical', 'Missing')
  }

  // CMMC
  if (/\bCMMC\s*(Level\s*)?([1-3])\b/i.test(text)) {
    const match = text.match(/\bCMMC\s*(Level\s*)?([1-3])\b/i)
    addReq('Section K', `CMMC Level ${match?.[2] || '2'} certification`, 'Critical', 'Missing')
  }

  // FedRAMP
  if (/\bFedRAMP\b/i.test(text)) {
    addReq('Contract', 'FedRAMP Authorization', 'Critical', 'Missing')
  }

  // FCL
  if (/\b(FCL|Facility\s*(Security\s*)?Clearance)\b/i.test(text)) {
    addReq('Section K', 'Facility Clearance (FCL)', 'Critical', 'Missing')
  }

  // Past performance
  if (/past performance/i.test(text)) {
    const match = text.match(/(\d+)\s*(?:of\s*)?(\d+)\s*past performance/i)
    addReq('Section L', 'Past performance references', 'Critical', match ? 'Partial' : 'Missing')
  }

  // Subcontracting plan
  if (/subcontract(?:ing)?\s*plan/i.test(text)) {
    addReq('Section L', 'Small business subcontracting plan', 'Important', 'Partial')
  }

  // Key personnel
  if (/key personnel/i.test(text)) {
    addReq('Section L', 'Key personnel resumes with relevant experience', 'Important', 'Met')
  }

  // Bonding
  if (/\bbond(?:ing)?\b/i.test(text)) {
    addReq('Section K', 'Bonding capacity documentation', 'Important', 'Missing')
  }

  // Quality assurance
  if (/quality assurance/i.test(text)) {
    addReq('Section M', 'Quality assurance surveillance plan', 'Nice-to-Have', 'Partial')
  }

  // ISO certification
  if (/ISO\s*27001/i.test(text)) {
    addReq('Section H', 'ISO 27001 certification or equivalent', 'Nice-to-Have', 'Missing')
  }

  return reqs
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

  // Gate 6: Exactly 5 recommendations
  gates.push({ name: 'Exactly 5 recommendations', passed: result.top_recommendations.length === 5 })

  // Gate 7: Security clearance is High or Critical (never Medium/Low)
  const securityFindings = [
    ...result.critical_findings,
    ...result.high_findings,
    ...result.medium_findings,
    ...result.low_findings,
  ].filter((f) => /clearance/i.test(f.finding))
  const securitySeverityOk = securityFindings.every(
    (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH'
  )
  gates.push({ name: 'Security Clearance = High or Critical', passed: securityFindings.length === 0 || securitySeverityOk })

  // Gate 8: Risk heatmap consistency with findings
  if (result.risk_heatmap) {
    const securityHeatmap = result.risk_heatmap.security_clearance
    const securityConsistent = securityHeatmap === 'Critical' || securityHeatmap === 'High'
      ? true // OK if heatmap says High/Critical
      : securityFindings.length === 0 // OK if no security findings exist
    gates.push({ name: 'Risk heatmap consistency', passed: securityConsistent })
  }

  // Log quality gate results (silent in production, visible in dev)
  if (process.env.NODE_ENV === 'development') {
    const failed = gates.filter((g) => !g.passed)
    if (failed.length > 0) {
      console.warn('[BidRank v2.1] Quality gates FAILED:', failed.map((g) => g.name))
    } else {
      console.log('[BidRank v2.1] All quality gates passed')
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

  const prompt = `You are the BidRank.pro RFP Compliance Analysis Engine. Analyze the following government RFP and return a JSON object with this exact structure. Be thorough, specific, and honest. Never predict contract awards or guarantee outcomes.

{
  "executiveSummary": "3-5 sentence strategic overview of the opportunity, key requirements, and strategic positioning",
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
    { "item": "Specific FAR clause or requirement with context", "status": "pass|warn|fail" }
  ],
  "complianceCategories": [
    { "name": "Category name", "score": 0-100 }
  ],
  "risks": [
    { "level": "High|Medium|Low", "title": "short title", "description": "one paragraph with specific RFP references" }
  ],
  "riskHeatmap": [
    { "category": "category name", "level": "Critical|High|Medium|Low" }
  ],
  "bidRecommendation": {
    "verdict": "BID|NO-BID|CONDITIONAL|NEEDS REVIEW",
    "confidence": 0-100,
    "reasoning": "2-3 sentence justification referencing specific RFP factors",
    "actionItems": ["Specific action 1", "Specific action 2", ...]
  },
  "requirements": [
    { "id": "REQ-001", "section": "Section L", "text": "Exact requirement", "priority": "Critical|Important|Nice-to-Have", "status": "Met|Partial|Missing" }
  ],
  "recommendations": [
    "[SEVERITY]: This [Agency] RFP requires [specific requirement] ([Section X.Y]). [Action] within [timeline]. Missing this = [consequence].",
    "... exactly 5 recommendations ordered by severity"
  ]
}

## CRITICAL DETECTION RULES (MANDATORY):
- Security Clearance (Secret, Top Secret, TS/SCI): ALWAYS classify risk as "High" or higher — NEVER "Medium" or "Low"
- CMMC Level: Must appear in requirements as Critical/Missing if referenced in RFP
- FedRAMP: Must appear in requirements as Critical if referenced in RFP
- Facility Clearance (FCL): Must appear in requirements if referenced
- Contract Value >$2M for 8(a)/small biz: Financial risk must be at least "Medium"
- Set-Aside (SDVOSB, WOSB, 8(a), HUBZone): Must appear in keyMetrics

## ZERO-TOLERANCE SECURITY RULE:
If the RFP requires Security Clearance (Secret/Top Secret/TS/SCI) OR CMMC Level 2+ certification, the bidRecommendation.verdict MUST be:
- "NO-BID" if the user has no way to confirm clearance eligibility or CMMC certification
- "CONDITIONAL" ONLY if the reasoning explicitly states the user ALREADY holds the required clearance/certification
- NEVER return "BID" when clearance or CMMC Level 2+ is required
- The reasoning MUST mention the specific clearance level and timeline from the RFP

## FORBIDDEN LANGUAGE — NEVER USE:
- "Not addressed in Section L", "Missing from requirements", "Not found in document", "Not documented"
INSTEAD: "Section L requires [X]. Verify yours are relevant to [specific scope]."

## FINANCIAL RISK THRESHOLDS:
- 8(a)/Small >$1M = Medium financial risk, >$2M = High, >$5M = Critical
- General >$10M = High, >$25M = Critical

## SCORING:
- readinessScore: 0-100 based on compliance, capability, clarity, patterns
- complianceCategories: include at least 4 categories (FAR Clauses, Set-Aside Eligibility, Past Performance, Financial, Security)
- bidRecommendation.confidence: 0-100 (percentage)
- At least 8 complianceChecklist items, at least 4 risks, exactly 5 recommendations
- Each risk MUST reference a specific RFP section or clause
- Each recommendation MUST include: agency name, exact section reference, timeline, consequence

RFP TEXT:
${rfpText}

Return ONLY valid JSON, no markdown, no explanation.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()

  const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(jsonStr) as AnalysisResult

  parsed.readinessScore = Math.max(0, Math.min(100, Math.round(parsed.readinessScore || 0)))

  // ── Fix raw ISO dates in keyMetrics ──────────────────────────────
  if (parsed.keyMetrics?.submissionDeadline) {
    const d = parsed.keyMetrics.submissionDeadline
    const isoMatch = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})/.test(d)
    if (isoMatch) {
      try {
        const parsed_d = new Date(d)
        if (!isNaN(parsed_d.getTime())) {
          parsed.keyMetrics.submissionDeadline = parsed_d.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
          })
        }
      } catch { /* keep original */ }
    }
  }

  if (!parsed.risks || parsed.risks.length === 0) parsed.risks = []
  if (!parsed.complianceChecklist || parsed.complianceChecklist.length === 0) parsed.complianceChecklist = []
  if (!parsed.recommendations || parsed.recommendations.length === 0) parsed.recommendations = []

  // ── Build riskHeatmap from risks if AI didn't return it ──────────
  const standardCategories = ['Security Clearance', 'Technical Requirements', 'Compliance', 'Financial', 'Timeline', 'Past Performance', 'Personnel', 'Subcontracting']
  if (!parsed.riskHeatmap || parsed.riskHeatmap.length === 0) {
    const riskToCategory = (title: string): string => {
      const t = title.toLowerCase()
      if (/clearance|security|cmmc|fcl/i.test(t)) return 'Security Clearance'
      if (/financial|bond|cash|cost/i.test(t)) return 'Financial'
      if (/timeline|schedule|deadline|aggressive/i.test(t)) return 'Timeline'
      if (/past performance|reference/i.test(t)) return 'Past Performance'
      if (/technical|requirement|scope/i.test(t)) return 'Technical Requirements'
      if (/subcontract/i.test(t)) return 'Subcontracting'
      if (/personnel|staff/i.test(t)) return 'Personnel'
      if (/compliance|far|regulation/i.test(t)) return 'Compliance'
      return 'Other'
    }
    const categoryLevels: Record<string, string> = {}
    for (const r of parsed.risks) {
      const cat = riskToCategory(r.title)
      const current = categoryLevels[cat] || 'Low'
      const order = ['Low', 'Medium', 'High', 'Critical']
      const next = r.level === 'High' ? 'High' : r.level
      if ((order.indexOf(next) ?? 0) > (order.indexOf(current) ?? 0)) {
        categoryLevels[cat] = next
      }
    }
    parsed.riskHeatmap = Object.entries(categoryLevels).map(([category, level]) => ({ category, level }))
    for (const s of standardCategories) {
      if (!categoryLevels[s]) {
        parsed.riskHeatmap.push({ category: s, level: 'Low' })
      }
    }
  } else {
    // AI returned some categories — merge with any missing standards
    const existingCats = new Set(parsed.riskHeatmap.map(h => h.category.toLowerCase()))
    for (const s of standardCategories) {
      if (!existingCats.has(s.toLowerCase())) {
        parsed.riskHeatmap.push({ category: s, level: 'Low' })
      }
    }
  }

  // ── Zero-tolerance enforcement: security clearance / CMMC ───────
  // If the RFP requires clearance or CMMC Level 2+, the verdict must
  // never be "BID" — the user cannot confirm eligibility from RFP text alone.
  const hasClearanceReq = /secret|top secret|ts\/sci|security clearance/i.test(rfpText)
  const hasCMMCReq = /cmmc\s*level\s*[2-3]/i.test(rfpText)
  if (hasClearanceReq || hasCMMCReq) {
    const v = parsed.bidRecommendation?.verdict
    if (v === 'BID') {
      parsed.bidRecommendation.verdict = 'CONDITIONAL'
      parsed.bidRecommendation.reasoning =
        `ZERO-TOLERANCE OVERRIDE: This RFP requires ${hasClearanceReq ? 'security clearance' : ''}${hasClearanceReq && hasCMMCReq ? ' and ' : ''}${hasCMMCReq ? 'CMMC Level 2+ certification' : ''}. BidRank cannot confirm your eligibility — verify before proceeding. ` +
        (parsed.bidRecommendation.reasoning || '')
    }
    // Ensure risks reflect the security requirement
    if (hasClearanceReq && !parsed.risks.some(r => /clearance/i.test(r.title))) {
      parsed.risks.unshift({
        level: 'High',
        title: 'Security Clearance Requirement',
        description: 'This RFP requires security clearance for key personnel. Verify your team\'s clearance status or identify cleared subcontractors before bidding.',
      })
    }
  }

  return parsed
}