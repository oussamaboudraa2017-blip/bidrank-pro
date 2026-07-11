import { ALL_CATEGORIES, REPORT_SECTIONS } from './config'
import type { CategoryScores, ValidationError, ValidationSeverity } from './types'

export class ValidationError_ extends Error {
  public errors: ValidationError[]
  constructor(errors: ValidationError[]) {
    super(`Blocking validation errors: ${JSON.stringify(errors)}`)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

interface ValidationRule {
  id: string
  check: string
  test: (report: string, contractValue: number, scores: CategoryScores) => boolean
  severity: ValidationSeverity
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'V001',
    check: "No 'lower evaluation' for CRITICAL mandatory requirements",
    test: (report: string) => {
      if (!report.includes('CRITICAL')) return true
      if (report.toLowerCase().includes('lower evaluation')) {
        return !report.includes('AUTOMATIC DISQUALIFICATION')
      }
      return true
    },
    severity: 'BLOCKING',
  },
  {
    id: 'V002',
    check: 'All 12 risk categories present in heatmap',
    test: (report: string) => {
      return ALL_CATEGORIES.every(cat => report.includes(cat))
    },
    severity: 'BLOCKING',
  },
  {
    id: 'V003',
    check: 'Minimum requirements extracted',
    test: (report: string, contractValue: number) => {
      const sectionRefs = report.match(/[|]\s*([CLHMK]\.)/g)
      const count = sectionRefs ? sectionRefs.length : 0
      const minimum = contractValue > 10000000 ? 25 : 15
      return count >= minimum
    },
    severity: 'BLOCKING',
  },
  {
    id: 'V004',
    check: 'Score math is correct',
    test: (_report: string, _contractValue: number, scores: CategoryScores) => {
      const calculated = Math.round(
        scores.security_certifications * 0.40 +
        scores.past_performance * 0.20 +
        scores.technical_capability * 0.15 +
        scores.compliance * 0.10 +
        scores.financial_capacity * 0.10 +
        scores.timeline_feasibility * 0.05
      )
      return Math.abs(scores.total - calculated) < 1
    },
    severity: 'BLOCKING',
  },
  {
    id: 'V005',
    check: 'All 12 report sections present',
    test: (report: string) => {
      return REPORT_SECTIONS.every(section => report.includes(section))
    },
    severity: 'BLOCKING',
  },
  {
    id: 'V006',
    check: 'Confidence matches recommendation',
    test: (report: string) => {
      const hasNoBid = report.includes('NO-BID') && report.includes('95%')
      const hasConditional = report.includes('CONDITIONAL') && report.includes('85%')
      const hasBid = report.includes('BID') && !report.includes('NO-BID') && report.includes('90%')
      return hasNoBid || hasConditional || hasBid
    },
    severity: 'WARNING',
  },
]

export function validateReport(
  reportText: string,
  contractValue: number,
  scores: CategoryScores
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const rule of VALIDATION_RULES) {
    try {
      const passed = rule.test(reportText, contractValue, scores)
      if (!passed) {
        errors.push({
          id: rule.id,
          check: rule.check,
          severity: rule.severity,
        })
      }
    } catch (err) {
      errors.push({
        id: rule.id,
        check: `${rule.check} - ERROR: ${err instanceof Error ? err.message : String(err)}`,
        severity: 'ERROR',
      })
    }
  }

  const blocking = errors.filter(e => e.severity === 'BLOCKING')
  if (blocking.length > 0) {
    throw new ValidationError_(errors)
  }

  return errors
}
