// Shared onboarding trigger — can be called from webhook or API route
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { onboardingEmail1 } from "@/lib/emails/onboarding-1-welcome";

export async function triggerOnboardingSequence(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) {
    console.warn("[onboarding] User not found or has no email:", userId);
    return { success: false, message: "User not found" };
  }

  const name = user.name || "there";

  // Send Email 1 immediately
  const email1 = onboardingEmail1(name);
  const result = await sendEmail({
    to: user.email,
    subject: email1.subject,
    html: email1.html,
  });
  console.log(
    `[onboarding] Email 1 sent to ${user.email}: ${result.success ? "OK" : result.message}`
  );

  // Schedule emails 2–7
  const schedule = [
    { day: 1, emailKey: "onboarding_2" },
    { day: 2, emailKey: "onboarding_3" },
    { day: 3, emailKey: "onboarding_4" },
    { day: 5, emailKey: "onboarding_5" },
    { day: 7, emailKey: "onboarding_6" },
    { day: 10, emailKey: "onboarding_7" },
  ];

  let scheduledCount = 0;
  for (const item of schedule) {
    const sendAt = new Date(Date.now() + item.day * 24 * 60 * 60 * 1000);
    try {
      await db.onboardingEmail.create({
        data: {
          userId,
          emailKey: item.emailKey,
          scheduledAt: sendAt,
          status: "scheduled",
        },
      });
      scheduledCount++;
    } catch {
      // Duplicate — already scheduled (e.g., webhook fired twice)
    }
  }

  console.log(`[onboarding] Scheduled ${scheduledCount} future emails for ${user.email}`);
  return { success: result.success, scheduledCount };
}