import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { appendBooking } from "@/lib/booking/store";
import { notifyBookingByEmail } from "@/lib/booking/notifyEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
  const level = typeof body?.level === "string" ? body.level : null;
  const recommendedPath =
    typeof body?.recommendedPath === "string" ? body.recommendedPath : null;
  const locale = body?.locale === "en" ? "en" : "es";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "invalid name or email" },
      { status: 400 },
    );
  }

  const booking = {
    id: randomUUID(),
    name,
    email,
    phone: phone || null,
    notes: notes || null,
    level,
    recommendedPath,
    locale,
    createdAt: new Date().toISOString(),
  };

  await appendBooking(booking);
  // Awaited (not fire-and-forget): on a serverless deploy, background work
  // left running after the response is sent can get cut off before it
  // completes, which would silently defeat the point of a backup alert.
  await notifyBookingByEmail(booking);

  return NextResponse.json({ ok: true });
}
