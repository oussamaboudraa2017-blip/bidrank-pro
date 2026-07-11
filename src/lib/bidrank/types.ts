export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'Very Low'
export type Priority = 'Critical' | 'Important' | 'Nice-to-Have'
export type RequirementCategory =
  | 'Technical'
  | 'Security'
  | 'Compliance'
  | 'Financial'
  | 'PastPerformance'
  | 'Personnel'
  | 'Administrative'
export type Recommendation = 'BID' | 'NO-BID' | 'CONDITIONAL'
export type ValidationSeverity = 'BLOCKING' | 'WARNING' | 'ERROR'

export interface RFPBasics {
  agency: string
  contract_title: string
  contract_value: number
  contract_value_text: string
  deadline: string
  deadline_iso: string
  naics_code: string
  naics_description: string
  set_aside: string
  contract_type: string
  period_of_performance: string
  place_of_performance: string
  on_site_percentage: string
  contracting_officer_name: string | null
  contracting_officer_email: string | null
  contracting_officer_phone: string | null
  solicitation_number: string | null
}

export interface Requirement {
  section: string
  requirement: string
  category: RequirementCategory
  priority: Priority
  is_mandatory: boolean
  mandatory_keywords: string[]
  submission_required: boolean
  exceptions_allowed: boolean
}

export interface Risk {
  category: string
  level: RiskLevel
  requirement: string
  citation: string
  rationale: string
  is_mandatory: boolean
  submission_required: boolean
}

export interface CategoryScores {
  security_certifications: number
  past_performance: number
  technical_capability: number
  compliance: number
  financial_capacity: number
  timeline_feasibility: number
  total: number
}

export interface ReportData {
  basics: RFPBasics
  requirements: Requirement[]
  risks: Risk[]
  scores: CategoryScores
  recommendation: Recommendation
  confidence: number
}

export interface ValidationError {
  id: string
  check: string
  severity: ValidationSeverity
}

export interface CompanyProfile {
  has_ts_sci: boolean
  has_cmmc: boolean
  has_fedramp_high: boolean
  has_fcl: boolean
  past_performance_count: number
  past_performance_avg_value: number
  bonding_capacity: number
}

export interface PipelineResult {
  report: string
  data: ReportData
  errors: ValidationError[]
}

export interface GeminiConfig {
  temperature: number
  top_p: number
  top_k: number
  max_output_tokens: number
  candidate_count: number
}
