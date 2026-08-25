/**
 * Shared Resend sender for the GEN 001 lifecycle emails (sections 76-80).
 *
 * IMPORTANT CURRENT LIMITATION: Resend's sandbox mode (no verified domain)
 * only allows sending to the account's own signup address
 * (vorsheinoficial@gmail.com). Until a domain is verified at
 * resend.com/domains, emails "to" a real applicant address will be
 * rejected by Resend and logged here, not delivered. The code is correct
 * and ready — activating real delivery to applicants only needs domain
 * verification, no code changes.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VORSHEIN <onboarding@resend.dev>",
        to: [params.to],
        subject: params.subject,
        text: params.text,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error("email send rejected", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("email send failed", err);
  }
}
