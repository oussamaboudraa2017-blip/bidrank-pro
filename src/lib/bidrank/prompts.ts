export const STAGE2_PROMPT = `You are a data extraction assistant. Extract the following fields from the
RFP text below. Output ONLY a JSON object. Do not add explanations,
markdown formatting, or any text outside the JSON.

Required fields:
{
  "agency": "Full agency name",
  "contract_title": "Full contract title",
  "contract_value": 0,
  "contract_value_text": "e.g., '$50,000,000'",
  "deadline": "YYYY-MM-DD HH:MM AM/PM Timezone",
  "deadline_iso": "ISO 8601 datetime",
  "naics_code": "XXXXXX",
  "naics_description": "Full NAICS description",
  "set_aside": "e.g., Unrestricted, 8(a), HUBZone, etc.",
  "contract_type": "e.g., Firm-Fixed-Price, Cost-Plus, etc.",
  "period_of_performance": "e.g., Base + 3 option years",
  "place_of_performance": "Primary location(s)",
  "on_site_percentage": "e.g., 80%",
  "contracting_officer_name": "Name or null",
  "contracting_officer_email": "Email or null",
  "contracting_officer_phone": "Phone or null",
  "solicitation_number": "RFP number or null"
}

RFP TEXT:
{rfp_text}

RULES:
- Use null for missing fields, never omit fields
- contract_value: extract numeric value only (e.g., 50000000)
- deadline: preserve exact timezone from RFP
- If multiple values (e.g., ceiling and target), use ceiling value`

export const STAGE3_PROMPT = `You are a requirement extraction assistant. Extract ALL requirements from
the RFP text below. Output ONLY a JSON array. Do not add explanations.

For each requirement, provide:
{
  "section": "Exact section reference, e.g., C.2.1, L.3.1",
  "requirement": "Full requirement text, verbatim or closely paraphrased",
  "category": "Technical | Security | Compliance | Financial | PastPerformance | Personnel | Administrative",
  "priority": "Critical | Important | Nice-to-Have",
  "is_mandatory": true | false,
  "mandatory_keywords": ["list of keywords that made it mandatory"],
  "submission_required": true | false,
  "exceptions_allowed": true | false
}

RFP TEXT:
{rfp_text}

RULES FOR PRIORITY:
- Critical: Contains ANY of: "mandatory", "required at time of proposal submission",
  "no exceptions", "NOT acceptable", "automatic disqualification", 
  "NO interim clearances", "must possess" + "at submission"
- Important: Required but has alternatives, grace periods, or can be obtained after award
- Nice-to-Have: Optional, scoring differentiator, or "desired" not "required"

RULES FOR is_mandatory:
- true if requirement uses words: "shall", "must", "mandatory", "required"
- false if uses: "should", "may", "desired", "preferred"

RULES FOR submission_required:
- true if requirement must be met AT proposal submission time
- false if can be met after award or during performance

MINIMUM REQUIREMENTS:
- For contracts > $10M: minimum 25 requirements
- For contracts <= $10M: minimum 15 requirements

If you cannot find enough requirements, extract sub-requirements by breaking
down complex requirements into components.`

export const STAGE5_PROMPT = `You are a report formatting assistant. You will be given structured data
from an RFP analysis. Your job is to format this data into a professional
markdown report following the exact template below. Do NOT add analysis,
opinions, or new information. Use ONLY the data provided.

INPUT DATA:
{json_data}

REPORT TEMPLATE:

# BidRank RFP Analysis Report
Generated on {current_date}

*The Bid Readiness Score and analysis are AI-generated indicators based on 
RFP text and self-reported business profile. They are not a prediction of 
contract award and should not be the sole basis for any bid/no-bid decision.*

---

## Executive Summary

{agency} seeks {contract_title}. This is a {set_aside}, {contract_type} 
contract valued at up to {contract_value_text}, requiring {strategic_assessment}

**Bid Readiness Score: {readiness_score}/100**

**Bid/No-Bid Recommendation: {recommendation}**
**Confidence: {confidence}%**

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Contract Value | {contract_value_text} |
| Deadline | {deadline} |
| Agency | {agency} |
| NAICS Code | {naics_code} |
| NAICS Description | {naics_description} |
| Set-Aside | {set_aside} |
| Contract Type | {contract_type} |
| Period of Performance | {period_of_performance} |
| Place of Performance | {place_of_performance} |
| On-Site Requirement | {on_site_percentage} |
| Contracting Officer | {contracting_officer_name} {contracting_officer_email} |

---

## Bid Readiness Score Breakdown

| Category | Score /100 | Weight | Weighted Score |
|----------|-----------|--------|----------------|
| Security & Certifications | {security_score} | 40% | {security_weighted} |
| Past Performance | {past_score} | 20% | {past_weighted} |
| Technical Capability | {technical_score} | 15% | {technical_weighted} |
| Compliance | {compliance_score} | 10% | {compliance_weighted} |
| Financial Capacity | {financial_score} | 10% | {financial_weighted} |
| Timeline Feasibility | {timeline_score} | 5% | {timeline_weighted} |
| **TOTAL** | | | **{total_score}/100** |

---

## Bid/No-Bid Recommendation

**{recommendation}**

{primary_reason}

Key Factors:
{key_factors_bullets}

---

## Required Actions

{required_actions_list}

---

## Compliance Score: {compliance_score}/100

| Category | Score |
|----------|-------|
| FAR Clauses | {far_score}% |
| DFARS Clauses | {dfars_score}% |
| Set-Aside Eligibility | {setaside_score}% |
| Past Performance | {pp_score}% |
| Security & Certifications | {security_score}% |
| Financial Management | {financial_mgmt_score}% |
| Technical Capability | {technical_score}% |

### Detailed Compliance Checklist

| Status | Item | Citation |
|--------|------|----------|
{compliance_checklist_rows}

---

## Risk Heatmap

| Category | Risk Level | Rationale |
|----------|-----------|-----------|
{risk_heatmap_rows}

---

## Risk Details

{risk_details_sections}

---

## Extracted Requirements ({requirement_count})

| Section | Requirement | Priority | Status |
|---------|-------------|----------|--------|
{requirements_rows}

---

## Recommended Next Steps

{recommended_steps_list}

---

## Competitive Intelligence

| Item | Detail |
|------|--------|
| Estimated Competition Pool | {competition_pool} |
| Likely Incumbent Advantage | {incumbent_advantage} |
| Primary Barriers to Entry | {barriers_list} |
| Teaming Opportunity Assessment | {teaming_assessment} |
| Estimated Number of Bidders | {estimated_bidders} |

---

## Cost & Investment Analysis

| Item | Estimate |
|------|----------|
| Proposal Development Cost | {proposal_dev_cost} |
| Compliance Investment (if missing certs) | {compliance_investment} |
| Estimated Capture Timeline for Future Pursuit | {capture_timeline} |
| Break-Even Contract Value Threshold | {break_even} |
| Estimated Profit Margin (FFP) | {profit_margin} |
| Working Capital Required | {working_capital} |

---

*BidRank.pro — AI-Powered RFP Analysis | This report is auto-generated and 
should be reviewed by qualified capture management professionals.*`
