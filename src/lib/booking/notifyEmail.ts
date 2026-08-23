import { Booking } from "./store";

// Resend's sandbox mode (no verified domain) only allows sending to the
// account's own signup address — this must stay in sync with whatever
// email owns the RESEND_API_KEY below, until a custom domain is verified
// at resend.com/domains (after which any "to" address works).
const NOTIFY_TO = "vorsheinoficial@gmail.com";

/**
 * Best-effort email alert on every new booking, via Resend's free tier
 * (no domain verification needed — sends from their shared onboarding
 * address). Silently does nothing if RESEND_API_KEY isn't set, and never
 * throws: a notification failure must not break the booking itself. The
 * wa.me redirect in BookingForm is the primary path; this is the backup so
 * a reservation is never missed even if the customer doesn't hit send.
 */
export async function notifyBookingByEmail(booking: Booking): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const lines = [
    `Nombre: ${booking.name}`,
    `Email: ${booking.email}`,
    `Teléfono: ${booking.phone ?? "—"}`,
    `Nivel: ${booking.level ?? "—"}`,
    `Programa: ${booking.recommendedPath ?? "—"}`,
    `Notas: ${booking.notes ?? "—"}`,
    `Idioma: ${booking.locale}`,
    `Fecha: ${booking.createdAt}`,
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VORSHEIN <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        subject: `Nueva reserva — ${booking.name}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error(
        "booking email notification rejected",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("booking email notification failed", err);
  }
}
