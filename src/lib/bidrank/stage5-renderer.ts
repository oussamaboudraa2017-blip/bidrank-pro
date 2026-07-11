import { GoogleGenerativeAI } from '@google/generative-ai'
import { STAGE5_PROMPT } from './prompts'
import { GEMINI_CONFIG, SAFETY_SETTINGS, DEFAULT_MODEL, MAX_RETRIES, RETRY_BASE_DELAY } from './config'
import type { ReportData } from './types'

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
      const response = result.response.text()
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from model')
      }
      return response
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

function formatDate(): string {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function buildRiskHeatmapTable(risks: ReportData['risks']): string {
  const categoryOrder = [
    'Security Clearance', 'CMMC Certification', 'Cloud Authorization',
    'Facility Clearance', 'Past Performance', 'Technical Requirements',
    'Compliance', 'Financial', 'Timeline', 'Personnel',
    'Subcontracting', 'Supply Chain Risk Management',
  ]
  const sorted = [...risks].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  )
  return sorted
    .map(r => `| ${r.category} | ${r.level} | ${r.rationale} |`)
    .join('\n')
}

function buildRiskDetails(risks: ReportData['risks']): string {
  return risks
    .filter(r => r.level === 'CRITICAL' || r.level === 'HIGH')
    .map(r => {
      const cls = r.level === 'CRITICAL' ? 'critical' : 'high'
      return `### **${r.category}** — *${r.level}*  \n**Requirement:** ${r.requirement}  \n**Section:** ${r.citation}  \n**Rationale:** ${r.rationale}  \n**Consequence:** ${getConsequenceText(r)}`
    })
    .join('\n\n')
}

function getConsequenceText(risk: ReportData['risks'][0]): string {
  if (risk.level === 'CRITICAL' && risk.submission_required) return 'AUTOMATIC DISQUALIFICATION'
  if (risk.level === 'CRITICAL') return 'Significant competitive disadvantage'
  if (risk.level === 'HIGH') return 'Significant competitive disadvantage'
  return 'Reduces competitiveness'
}

function buildRequirementsTable(requirements: ReportData['requirements']): string {
  return requirements
    .slice(0, 50)
    .map(r => `| ${r.section} | ${r.requirement.substring(0, 80)}${r.requirement.length > 80 ? '...' : ''} | ${r.priority} | ${r.is_mandatory ? 'Mandatory' : 'Optional'} |`)
    .join('\n')
}

function buildComplianceChecklist(risks: ReportData['risks'], requirements: ReportData['requirements']): string {
  const items: string[] = []
  for (const req of requirements.filter(r => r.is_mandatory).slice(0, 20)) {
    const status = req.submission_required ? '⚠️ Action Required' : '✅ Met'
    items.push(`| ${status} | ${req.requirement.substring(0, 60)} | ${req.section} |`)
  }
  return items.join('\n')
}

function buildKeyFactors(risks: ReportData['risks']): string {
  const critical = risks.filter(r => r.level === 'CRITICAL')
  const high = risks.filter(r => r.level === 'HIGH')

  const factors: string[] = []
  for (const r of critical.slice(0, 3)) {
    factors.push(`- 🔴 **${r.category}** (CRITICAL): ${r.rationale}`)
  }
  for (const r of high.slice(0, 3)) {
    factors.push(`- 🟠 **${r.category}** (HIGH): ${r.rationale}`)
  }
  if (factors.length === 0) {
    factors.push('- No critical or high risk factors identified')
  }
  return factors.join('\n')
}

function buildRequiredActions(risks: ReportData['risks']): string {
  const critical = risks.filter(r => r.level === 'CRITICAL' && r.submission_required)
  const actions: string[] = []
  for (const r of critical.slice(0, 5)) {
    actions.push(`- **IMMEDIATE**: Address ${r.category} — ${r.rationale}`)
  }
  if (actions.length === 0) {
    actions.push('- No immediate mandatory actions identified')
  }
  return actions.join('\n')
}

function buildRecommendedSteps(risks: ReportData['risks'], basics: ReportData['basics']): string {
  const steps: string[] = []
  const criticalCount = risks.filter(r => r.level === 'CRITICAL').length

  if (criticalCount > 0) {
    steps.push('1. **Address critical risks first** — resolve all CRITICAL-level items before proceeding')
  }
  steps.push('2. **Verify certifications** — confirm all required security clearances, CMMC level, and FedRAMP status')
  steps.push('3. **Prepare past performance** — compile 3-5 relevant references with POC details')
  steps.push('4. **Develop technical approach** — create detailed SOW response with methodology')
  steps.push('5. **Review compliance** — verify FAR/DFARS clauses and submission format')
  steps.push('6. **Allocate resources** — ensure staffing plan meets on-site requirements')
  if (basics.contract_value > 10000000) {
    steps.push('7. **Financial planning** — verify bonding capacity and cash flow for this contract value')
  }
  return steps.join('\n')
}

export async function renderReport(data: ReportData, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: GEMINI_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  })

  const riskHeatmapRows = buildRiskHeatmapTable(data.risks)
  const riskDetailsSections = buildRiskDetails(data.risks)
  const requirementsRows = buildRequirementsTable(data.requirements)
  const complianceChecklistRows = buildComplianceChecklist(data.risks, data.requirements)
  const keyFactorsBullets = buildKeyFactors(data.risks)
  const requiredActionsList = buildRequiredActions(data.risks)
  const recommendedStepsList = buildRecommendedSteps(data.risks, data.basics)

  const complianceScore = data.scores.compliance
  const totalScore = data.scores.total

  const promptData = {
    agency: data.basics.agency,
    contract_title: data.basics.contract_title,
    set_aside: data.basics.set_aside,
    contract_type: data.basics.contract_type,
    contract_value_text: data.basics.contract_value_text,
    strategic_assessment: data.risks.filter(r => r.level === 'CRITICAL').length > 0
      ? 'significant compliance and certification hurdles that must be addressed before bidding'
      : 'standard compliance and capability requirements typical for this contract type',
    readiness_score: totalScore,
    recommendation: data.recommendation,
    confidence: data.confidence,
    deadline: data.basics.deadline,
    naics_code: data.basics.naics_code,
    naics_description: data.basics.naics_description,
    period_of_performance: data.basics.period_of_performance,
    place_of_performance: data.basics.place_of_performance,
    on_site_percentage: data.basics.on_site_percentage,
    contracting_officer_name: data.basics.contracting_officer_name || 'N/A',
    contracting_officer_email: data.basics.contracting_officer_email || '',
    security_score: data.scores.security_certifications,
    past_score: data.scores.past_performance,
    technical_score: data.scores.technical_capability,
    compliance_score_value: complianceScore,
    financial_score: data.scores.financial_capacity,
    timeline_score: data.scores.timeline_feasibility,
    security_weighted: Math.round(data.scores.security_certifications * 0.40),
    past_weighted: Math.round(data.scores.past_performance * 0.20),
    technical_weighted: Math.round(data.scores.technical_capability * 0.15),
    compliance_weighted: Math.round(complianceScore * 0.10),
    financial_weighted: Math.round(data.scores.financial_capacity * 0.10),
    timeline_weighted: Math.round(data.scores.timeline_feasibility * 0.05),
    total_score: totalScore,
    primary_reason: data.recommendation === 'NO-BID'
      ? 'This opportunity presents risks that outweigh the potential reward at this time.'
      : data.recommendation === 'CONDITIONAL'
        ? 'This opportunity is viable pending resolution of identified compliance and capability gaps.'
        : 'This opportunity aligns well with your capabilities and presents a favorable risk profile.',
    key_factors_bullets: keyFactorsBullets,
    required_actions_list: requiredActionsList,
    far_score: Math.min(100, complianceScore + 10),
    dfars_score: data.risks.some(r => r.category === 'CMMC Certification') ? Math.min(100, complianceScore) : 100,
    setaside_score: data.basics.set_aside ? 90 : 100,
    pp_score: data.scores.past_performance,
    financial_mgmt_score: data.scores.financial_capacity,
    compliance_checklist_rows: complianceChecklistRows,
    risk_heatmap_rows: riskHeatmapRows,
    risk_details_sections: riskDetailsSections,
    requirement_count: data.requirements.length,
    requirements_rows: requirementsRows,
    recommended_steps_list: recommendedStepsList,
    competition_pool: data.basics.set_aside ? 'Small business set-aside — limited pool' : 'Full and open — larger pool expected',
    incumbent_advantage: data.basics.agency ? 'Unknown — check USAspending.gov for incumbent data' : 'Unknown',
    barriers_list: data.risks.filter(r => r.level === 'CRITICAL').slice(0, 3).map(r => r.category).join(', ') || 'Standard barriers apply',
    teaming_assessment: data.risks.some(r => r.level === 'CRITICAL') ? 'Teaming recommended to address critical gaps' : 'Teaming optional — core capabilities appear sufficient',
    estimated_bidders: data.basics.set_aside ? '3-5' : '5-10',
    proposal_dev_cost: data.basics.contract_value > 50000000 ? '$150,000 - $250,000' : data.basics.contract_value > 10000000 ? '$50,000 - $100,000' : '$15,000 - $50,000',
    compliance_investment: data.risks.some(r => r.category === 'CMMC Certification') ? '$50,000 - $150,000' : data.risks.some(r => r.category === 'Security Clearance') ? '$10,000 - $50,000' : 'Minimal',
    capture_timeline: data.recommendation === 'NO-BID' ? '6-12 months (address blockers first)' : 'Immediate — begin proposal development',
    break_even: data.basics.contract_value ? `$${(data.basics.contract_value * 0.05).toLocaleString()}` : 'N/A',
    profit_margin: data.basics.contract_type?.toLowerCase().includes('fixed') ? '8-12%' : '5-8%',
    working_capital: data.basics.contract_value ? `$${Math.round(data.basics.contract_value * 0.15).toLocaleString()}` : 'N/A',
  }

  const jsonData = JSON.stringify(promptData, null, 2)
  const currentDate = formatDate()
  const prompt = STAGE5_PROMPT
    .replace('{json_data}', jsonData)
    .replace('{current_date}', currentDate)

  const responseText = await generateWithRetry(model, prompt)

  const cleaned = cleanJSON(responseText)

  if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
    try {
      const parsed = JSON.parse(cleaned)
      if (parsed.report || parsed.markdown) return parsed.report || parsed.markdown
      return JSON.stringify(parsed, null, 2)
    } catch {
      // Not JSON, return as-is
    }
  }

  return cleaned || responseText
}
