// Central registry mapping emailKey → template function
// Each template returns { subject: string, html: string }
// Templates that need user name receive it as argument

import { onboardingEmail2 } from "./onboarding-2-compliance-score";
import { onboardingEmail3 } from "./onboarding-3-risk-heatmap";
import { onboardingEmail4 } from "./onboarding-4-past-performance";
import { onboardingEmail5 } from "./onboarding-5-case-study";
import { onboardingEmail6 } from "./onboarding-6-trial-ending";
import { onboardingEmail7 } from "./onboarding-7-final-push";

type EmailTemplate = { subject: string; html: string };

// Templates that need a user name parameter
const templatesWithName = new Set(["onboarding_6", "onboarding_7"]);

export function getOnboardingEmail(
  emailKey: string,
  userName?: string
): EmailTemplate | null {
  switch (emailKey) {
    case "onboarding_2":
      return onboardingEmail2();
    case "onboarding_3":
      return onboardingEmail3();
    case "onboarding_4":
      return onboardingEmail4();
    case "onboarding_5":
      return onboardingEmail5();
    case "onboarding_6":
      return onboardingEmail6(userName || "there");
    case "onboarding_7":
      return onboardingEmail7(userName || "there");
    default:
      console.warn(`[email dispatch] Unknown emailKey: ${emailKey}`);
      return null;
  }
}