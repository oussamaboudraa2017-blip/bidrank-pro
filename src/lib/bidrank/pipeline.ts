import { extractBasics } from './stage2-extractor'
import { extractRequirements } from './stage3-extractor'
import { classifyRisks, calculateScores, determineRecommendation } from './stage4-engine'
import { renderReport } from './stage5-renderer'
import { validateReport } from './validation'
import type { RFPBasics, Requirement, Risk, CategoryScores, Recommendation, PipelineResult, ValidationError } from './types'

function getDefaultProfile() {
  return {
    has_ts_sci: false,
    has_cmmc: false,
    has_fedramp_high: false,
    has_fcl: false,
    past_performance_count: 3,
    past_performance_avg_value: 5000000,
    bonding_capacity: 10000000,
  }
}

export class BidRankPipeline {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async run(rfpText: string): Promise<PipelineResult> {
    if (!rfpText || rfpText.trim().length < 50) {
      throw new Error('RFP text is too short. Please provide a complete RFP document with at least 50 characters.')
    }

    const printableRatio = (rfpText.match(/[\x20-\x7E\n\r\t]/g) || []).length / rfpText.length
    if (printableRatio < 0.3) {
      throw new Error('Unable to parse document. Please upload a text-readable PDF.')
    }

    const startTime = Date.now()

    // Stage 2: Extract basics
    console.log('[bidrank] Stage 2: Extracting basic RFP information...')
    const basics = await extractBasics(rfpText, this.apiKey)
    console.log(`[bidrank] Stage 2 complete: ${basics.agency || 'Unknown agency'}`)

    // Stage 3: Extract requirements
    console.log('[bidrank] Stage 3: Extracting requirements...')
    const requirements = await extractRequirements(rfpText, this.apiKey, basics.contract_value)
    console.log(`[bidrank] Stage 3 complete: ${requirements.length} requirements extracted`)

    // Stage 4: Risk classification & scoring (pure code — no LLM)
    console.log('[bidrank] Stage 4: Classifying risks and calculating scores...')
    const risks = classifyRisks(requirements, basics)
    const scores = calculateScores(risks, requirements, basics)
    const { recommendation, confidence } = determineRecommendation(
      scores.total,
      scores.security_certifications,
      risks
    )
    console.log(`[bidrank] Stage 4 complete: ${risks.length} risks, score ${scores.total}/100, ${recommendation}`)

    // Assemble report data
    const reportData = {
      basics,
      requirements,
      risks,
      scores,
      recommendation,
      confidence,
    }

    // Stage 5: Render report
    console.log('[bidrank] Stage 5: Rendering report...')
    const report = await renderReport(reportData, this.apiKey)
    console.log(`[bidrank] Stage 5 complete: ${report.length} chars`)

    // Validate
    console.log('[bidrank] Validating report...')
    let errors: ValidationError[] = []
    try {
      errors = validateReport(report, basics.contract_value, scores)
      console.log(`[bidrank] Validation complete: ${errors.length} warnings`)
    } catch (err) {
      if (err instanceof Error && 'errors' in err) {
        errors = (err as { errors: ValidationError[] }).errors
      }
      // Log but don't throw — validation should not crash the pipeline
      console.warn('[bidrank] Validation errors found:', errors.filter(e => e.severity !== 'WARNING').length)
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`[bidrank] Pipeline complete in ${elapsed}s`)

    return {
      report,
      data: reportData,
      errors,
    }
  }
}
