import { NextRequest, NextResponse } from "next/server";
import { getApplication } from "@/lib/applications/store";

/**
 * Public, unauthenticated status lookup by Application ID — the only
 * self-serve way an applicant can check "was I confirmed?" without a full
 * member portal (out of scope for GEN 001). Deliberately returns only what
 * the applicant already sees on their own Entry Pass — never WhatsApp,
 * email, health notes, or assessment answers.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const application = await getApplication(id.toUpperCase());
  if (!application) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    id: application.id,
    firstName: application.firstName,
    lastName: application.lastName,
    preliminaryLevel: application.preliminaryLevel,
    status: application.status,
    turnDateISO: application.turnDateISO,
    turnTimeSlot: application.turnTimeSlot,
  });
}
