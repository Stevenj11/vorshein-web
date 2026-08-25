import { NextRequest, NextResponse } from "next/server";
import { classify, checkEligibility, ClassificationInput } from "@/lib/assessment/gates";
import {
  countForTurn,
  createApplication,
  nextApplicationId,
} from "@/lib/applications/store";
import { Application, Division } from "@/lib/applications/types";
import { getActiveGeneration } from "@/lib/generation";
import { sendApplicationReceivedEmail } from "@/lib/emails/templates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function computeAge(birthDateISO: string): number {
  const birth = new Date(birthDateISO);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function divisionFor(age: number): Division {
  return age <= 25 ? "A" : "B";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const birthDateISO = String(body.birthDateISO ?? "");
  const whatsapp = String(body.whatsapp ?? "").trim();
  const email = String(body.email ?? "").trim();
  const emergencyContactName = String(body.emergencyContactName ?? "").trim();
  const emergencyContactRelation = String(body.emergencyContactRelation ?? "").trim();
  const emergencyContactPhone = String(body.emergencyContactPhone ?? "").trim();
  const healthNote = body.healthNote ? String(body.healthNote).trim() : null;
  const answers = body.assessmentAnswers as ClassificationInput | undefined;
  const sex = body.sex === "female" ? "female" : "male";

  if (
    !firstName ||
    !lastName ||
    !birthDateISO ||
    !whatsapp ||
    !EMAIL_RE.test(email) ||
    !emergencyContactName ||
    !emergencyContactPhone ||
    !answers
  ) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const age = computeAge(birthDateISO);
  const generation = await getActiveGeneration();

  // Backend re-validates eligibility and classification — never trusts the
  // client's claimed level (spec section 21).
  const eligibility = checkEligibility({ age, sex }, generation.eligibility);
  if (!eligibility.eligible) {
    return NextResponse.json({ error: "not eligible", reason: eligibility.reason }, { status: 403 });
  }

  const classification = classify(answers);
  const officialSlug: "foundation" | "performance" | "tactical" =
    classification.level === "TACTICAL"
      ? "tactical"
      : classification.level === "PERFORMANCE"
        ? "performance"
        : "foundation";

  const capacity = generation.capacities[officialSlug];
  const turnDateISO = body.turnDateISO && generation.dates.entryDatesISO.includes(body.turnDateISO)
    ? body.turnDateISO
    : generation.dates.entryDatesISO[0];
  const turnTimeSlot = capacity.scheduleTime;

  const existingCount = await countForTurn(turnDateISO, turnTimeSlot);
  const status = existingCount >= capacity.entryTurnCapacity ? "WAITLIST" : "RESERVED";

  const id = await nextApplicationId();
  const now = new Date();
  const deadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  const application: Application = {
    id,
    generationId: generation.id,
    createdAt: now.toISOString(),
    firstName,
    lastName,
    birthDateISO,
    age,
    division: divisionFor(age),
    whatsapp,
    email,
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhone,
    healthNote,
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
  await sendApplicationReceivedEmail(application);

  return NextResponse.json({ application });
}
