export interface BadgeDefinition {
  key: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  requirement: string;
  category: "analysis" | "compliance" | "engagement" | "achievement";
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { key: "first_analysis", name: "First Analysis", description: "Completed your first RFP analysis", icon: "FileSearch", requirement: "Complete 1 analysis", category: "analysis" },
  { key: "analyst_5", name: "RFP Reader", description: "Completed 5 RFP analyses", icon: "BookOpen", requirement: "Complete 5 analyses", category: "analysis" },
  { key: "analyst_25", name: "Power Analyst", description: "Completed 25 RFP analyses", icon: "Zap", requirement: "Complete 25 analyses", category: "analysis" },
  { key: "analyst_50", name: "Bid Veteran", description: "Completed 50 RFP analyses", icon: "Award", requirement: "Complete 50 analyses", category: "achievement" },
  { key: "compliance_master", name: "Compliance Master", description: "10 analyses with 80%+ compliance score", icon: "ShieldCheck", requirement: "10 analyses scoring 80%+", category: "compliance" },
  { key: "risk_spotter", name: "Risk Spotter", description: "Flagged 50 total risks across analyses", icon: "AlertTriangle", requirement: "Flag 50 risks", category: "compliance" },
  { key: "streak_7", name: "Week Warrior", description: "Analyzed RFPs 7 days in a row", icon: "Flame", requirement: "7-day analysis streak", category: "engagement" },
  { key: "early_adopter", name: "Early Adopter", description: "Signed up during BidRank's launch period", icon: "Star", requirement: "Signed up in 2025-2026", category: "achievement" },
];