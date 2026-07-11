import {
  MANDATORY_SUBMISSION_KEYWORDS,
  RISK_LEVEL_MAP,
  FINANCIAL_RISK_RULES,
  TIMELINE_RISK_RULES,
  ONSITE_RISK_RULES,
  SCORING_WEIGHTS,
  ALL_CATEGORIES,
  MANDATORY_CONSEQUENCE,
  HIGH_CONSEQUENCE,
  MEDIUM_CONSEQUENCE,
} from './config'
import type {
  RFPBasics,
  Requirement,
  Risk,
  RiskLevel,
  CategoryScores,
  Recommendation,
} from './types'

function calculateFinancialRisk(basics: RFPBasics): RiskLevel {
  const value = basics.contract_value || 0
  const type = (basics.contract_type || '').toUpperCase()

  if (type.includes('FFP') || type.includes('FIRM-FIXED') || type.includes('FIRM FIXED')) {
    const rules = FINANCIAL_RISK_RULES.FFP
    for (const [min, max, level] of rules) {
      if (value > min && value <= max) return level
    }
  }
  return 'LOW'
}

function calculateTimelineRisk(basics: RFPBasics): RiskLevel {
  if (!basics.deadline_iso) return 'MEDIUM'
  try {
    const deadline = new Date(basics.deadline_iso)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    for (const [min, max, level] of TIMELINE_RISK_RULES) {
      if (daysRemaining >= min && daysRemaining <= max) return level
    }
    return 'Very Low'
  } catch {
    return 'MEDIUM'
  }
}

function calculatePersonnelRisk(basics: RFPBasics): RiskLevel {
  const onsite = (basics.on_site_percentage || '0%').replace('%', '')
  const num = parseInt(onsite, 10)
  if (isNaN(num)) return 'MEDIUM'

  for (const [min, max, level] of ONSITE_RISK_RULES) {
    if (num >= min && num <= max) return level
  }
  return 'LOW'
}

function classifyRequirement(req: Requirement, basics: RFPBasics): Risk | null {
  const reqText = req.requirement.toLowerCase()
  const { is_mandatory, submission_required } = req

  const hasMandatoryKeyword = MANDATORY_SUBMISSION_KEYWORDS.some(kw =>
    reqText.includes(kw.toLowerCase())
  )

  let level: RiskLevel = 'LOW'
  if (hasMandatoryKeyword && submission_required) {
    level = 'CRITICAL'
  } else if (hasMandatoryKeyword) {
    level = 'HIGH'
  } else if (is_mandatory) {
    level = 'MEDIUM'
  }

  let category: string = req.category

  for (const [keyword, mapping] of Object.entries(RISK_LEVEL_MAP)) {
    if (reqText.includes(keyword)) {
      category = mapping.category
      if (mapping.level) {
        level = mapping.level
      }
      break
    }
  }

  if (category === 'Financial' || req.category === 'Financial') {
    level = calculateFinancialRisk(basics)
  }

  const timelineLevel = calculateTimelineRisk(basics)
  const personnelLevel = calculatePersonnelRisk(basics)

  let rationale: string
  if (level === 'CRITICAL') {
    rationale = 'This requirement must be met at time of submission. Failure results in automatic disqualification.'
  } else if (level === 'HIGH') {
    rationale = 'This requirement is a significant compliance factor. Missing it creates a major competitive disadvantage.'
  } else if (level === 'MEDIUM') {
    rationale = 'This requirement reduces competitiveness if not fully addressed.'
  } else {
    rationale = 'This requirement is manageable with standard capabilities.'
  }

  return {
    category,
    level,
    requirement: req.requirement,
    citation: req.section,
    rationale,
    is_mandatory,
    submission_required,
  }
}

function calculateSecurityScore(risks: Risk[]): number {
  const criticalSecurity = risks.filter(r =>
    ['Security Clearance', 'CMMC Certification', 'Cloud Authorization', 'Facility Clearance'].includes(r.category) &&
    r.level === 'CRITICAL'
  )
  if (criticalSecurity.length > 0) return 15

  const highSecurity = risks.filter(r =>
    ['Security Clearance', 'CMMC Certification', 'Cloud Authorization', 'Facility Clearance'].includes(r.category) &&
    r.level === 'HIGH'
  )
  if (highSecurity.length > 0) return 35

  return 85
}

function calculatePastPerformanceScore(requirements: Requirement[]): number {
  const ppReqs = requirements.filter(r => r.category === 'PastPerformance')
  if (ppReqs.length === 0) return 80

  let constraints = 0
  for (const r of ppReqs) {
    const text = r.requirement.toLowerCase()
    if (text.includes('$10m')) constraints++
    if (text.includes('classified')) constraints++
    if (text.includes('ts/sci')) constraints++
  }

  if (constraints >= 3) return 40
  if (constraints >= 2) return 60
  if (constraints >= 1) return 75
  return 85
}

function calculateTechnicalScore(requirements: Requirement[]): number {
  const techReqs = requirements.filter(r => r.category === 'Technical')
  if (techReqs.length === 0) return 70

  let specialized = 0
  for (const r of techReqs) {
    const text = r.requirement.toLowerCase()
    if (['ai/ml', 'quantum', 'exploit', 'reverse engineering'].some(k => text.includes(k))) {
      specialized++
    }
  }

  if (specialized >= 3) return 55
  if (specialized >= 1) return 65
  return 75
}

function calculateComplianceScore(risks: Risk[]): number {
  const complianceRisks = risks.filter(r => r.category === 'Compliance')
  const critical = complianceRisks.filter(r => r.level === 'CRITICAL').length
  const high = complianceRisks.filter(r => r.level === 'HIGH').length

  if (critical > 0) return 40
  if (high > 0) return 65
  return 85
}

function calculateFinancialCapacityScore(basics: RFPBasics): number {
  const value = basics.contract_value || 0
  if (value > 50000000) return 50
  if (value > 10000000) return 70
  return 85
}

function calculateTimelineScore(basics: RFPBasics): number {
  if (!basics.deadline_iso) return 60
  try {
    const deadline = new Date(basics.deadline_iso)
    const now = new Date()
    const days = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 14) return 20
    if (days <= 30) return 40
    if (days <= 60) return 60
    if (days <= 90) return 80
    return 95
  } catch {
    return 60
  }
}

function getConsequence(riskLevel: RiskLevel, isMandatoryAtSubmission: boolean): string {
  if (riskLevel === 'CRITICAL' && isMandatoryAtSubmission) return MANDATORY_CONSEQUENCE
  if (riskLevel === 'CRITICAL') return HIGH_CONSEQUENCE
  if (riskLevel === 'HIGH') return HIGH_CONSEQUENCE
  return MEDIUM_CONSEQUENCE
}

function ensureAllCategoriesPresent(risks: Risk[]): Risk[] {
  const existingCategories = new Set(risks.map(r => r.category))

  for (const cat of ALL_CATEGORIES) {
    if (!existingCategories.has(cat)) {
      risks.push({
        category: cat,
        level: 'LOW',
        requirement: 'Not addressed in RFP',
        citation: 'N/A',
        rationale: 'No specific requirements identified for this category.',
        is_mandatory: false,
        submission_required: false,
      })
    }
  }

  return risks
}

export function classifyRisks(requirements: Requirement[], basics: RFPBasics): Risk[] {
  const risks: Risk[] = []
  for (const req of requirements) {
    const risk = classifyRequirement(req, basics)
    if (risk) risks.push(risk)
  }
  return ensureAllCategoriesPresent(risks)
}

export function calculateScores(risks: Risk[], requirements: Requirement[], basics: RFPBasics): CategoryScores {
  const scores: CategoryScores = {
    security_certifications: calculateSecurityScore(risks),
    past_performance: calculatePastPerformanceScore(requirements),
    technical_capability: calculateTechnicalScore(requirements),
    compliance: calculateComplianceScore(risks),
    financial_capacity: calculateFinancialCapacityScore(basics),
    timeline_feasibility: calculateTimelineScore(basics),
    total: 0,
  }

  const total = Math.round(
    scores.security_certifications * SCORING_WEIGHTS.security_certifications +
    scores.past_performance * SCORING_WEIGHTS.past_performance +
    scores.technical_capability * SCORING_WEIGHTS.technical_capability +
    scores.compliance * SCORING_WEIGHTS.compliance +
    scores.financial_capacity * SCORING_WEIGHTS.financial_capacity +
    scores.timeline_feasibility * SCORING_WEIGHTS.timeline_feasibility
  )
  scores.total = total

  return scores
}

export function determineRecommendation(
  totalScore: number,
  securityScore: number,
  risks: Risk[]
): { recommendation: Recommendation; confidence: number } {
  const criticalCount = risks.filter(r => r.level === 'CRITICAL').length

  if (criticalCount > 0) return { recommendation: 'NO-BID', confidence: 95 }
  if (totalScore >= 75) return { recommendation: 'BID', confidence: 90 }
  if (totalScore >= 50) return { recommendation: 'CONDITIONAL', confidence: 85 }
  return { recommendation: 'NO-BID', confidence: 95 }
}

export { getConsequence, calculateFinancialRisk, calculateTimelineRisk, calculatePersonnelRisk }
