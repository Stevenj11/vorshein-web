import { NextRequest, NextResponse } from "next/server";
import { classify, checkEligibility, ClassificationInput } from "@/lib/assessment/gates";
import {
  countForTurn,
  createApplication,
  findByWhatsapp,
  nextApplicationId,
} from "@/lib/applications/store";
import { Application, Division } from "@/lib/applications/types";
import { getActiveGeneration, turnoTimeRange } from "@/lib/generation";
import { sendApplicationReceivedEmail } from "@/lib/emails/templates";

const WHATSAPP_RE = /^[0-9+\s()-]{7,20}$/;

function divisionFor(age: number): Division {
  return age <= 25 ? "A" : "B";
}

/** Every failure path returns { error: <machine code> } — the frontend maps
 * each code to a specific, friendly message. Never leak internal details. */
function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return fail("invalid_body", 400);

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const birthYear = Number(body.birthYear);
    const whatsapp = String(body.whatsapp ?? "").trim();
    const answers = body.assessmentAnswers as ClassificationInput | undefined;
    const sex = body.sex === "female" ? "female" : "male";

    if (!firstName || !lastName) return fail("missing_name", 400);
    if (!birthYear || birthYear < 1930 || birthYear > new Date().getFullYear()) {
      return fail("invalid_birth_year", 400);
    }
    if (!WHATSAPP_RE.test(whatsapp)) return fail("invalid_whatsapp", 400);
    if (!answers) return fail("missing_assessment", 400);

    const age = new Date().getFullYear() - birthYear;
    const generation = await getActiveGeneration();

    // Backend re-validates eligibility and classification — never trusts the
    // client's claimed level (spec section 21).
    const eligibility = checkEligibility({ age, sex }, generation.eligibility);
    if (!eligibility.eligible) return fail("not_eligible", 403);

    const existing = await findByWhatsapp(whatsapp, generation.id);
    if (existing) return fail("duplicate_application", 409);

    const classification = classify(answers);
    const officialSlug: "foundation" | "performance" | "tactical" =
      classification.level === "TACTICAL"
        ? "tactical"
        : classification.level === "PERFORMANCE"
          ? "performance"
          : "foundation";

    // Resolved from a specific turno id (never from level alone) and
    // re-validated against the level here — never trust the client's turno
    // choice without confirming it actually serves this level.
    const requestedTurno = generation.turnos.find(
      (t) => t.id === body.turnId && t.levels.includes(officialSlug),
    );
    const turno = requestedTurno ?? generation.turnos.find((t) => t.levels.includes(officialSlug));
    if (!turno) return fail("no_turno_available", 409);

    const turnDateISO =
      turno.day === "saturday" ? generation.dates.entryDatesISO[0] : generation.dates.entryDatesISO[1];
    const turnTimeSlot = turnoTimeRange(turno);

    const existingCount = await countForTurn(turnDateISO, turnTimeSlot);
    const status = existingCount >= turno.maxCapacity ? "WAITLIST" : "RESERVED";

    const id = await nextApplicationId();
    const now = new Date();
    const deadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    const application: Application = {
      id,
      generationId: generation.id,
      createdAt: now.toISOString(),
      firstName,
      lastName,
      birthYear,
      age,
      division: divisionFor(age),
      whatsapp,
      email: null,
      emergencyContactName: null,
      emergencyContactRelation: null,
      emergencyContactPhone: null,
      healthNote: null,
      preliminaryLevel: classification.level,
      assessmentAnswers: answers as unknown as Record<string, number | string>,
      manualReviewReason: classification.needsManualReview ? classification.reasons.join(" ") : null,
      turnDateISO,
      turnTimeSlot,
      status,
      whatsappConfirmDeadlineISO: deadline.toISOString(),
      checkedInAt: null,
      signedAt: null,
      entryAssessmentScores: null,
      officialLevel: null,
      paymentAmount: null,
      paymentMethod: null,
      paymentStatus: null,
      paymentDate: null,
      memberId: null,
      rosterConsent: false,
    };

    await createApplication(application);

    // Email is best-effort — the applicant's confirmation channel is
    // WhatsApp, not email (no email is even collected at this step), so a
    // failure here must never fail the application itself.
    try {
      await sendApplicationReceivedEmail(application);
    } catch (emailError) {
      console.error("sendApplicationReceivedEmail failed", emailError);
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("POST /api/applications failed", error);
    return fail("server_error", 500);
  }
}
