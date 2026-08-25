import { PreliminaryLevel } from "../assessment/gates";

export type ApplicationStatus =
  | "RESERVED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "SIGNED"
  | "PAID"
  | "ASSESSED"
  | "MANUAL_REVIEW"
  | "ADMITTED"
  | "NOT_YET_ELIGIBLE"
  | "NO_SHOW"
  | "WAITLIST";

export type Division = "A" | "B"; // A: 18-25, B: 26-30

export type EntryAssessmentScores = {
  aquaticControl: number;
  technique: number;
  endurance: number;
  physical: number;
  execution: number;
};

export type Application = {
  id: string; // VRSN-A####
  generationId: string;
  createdAt: string;

  // Applicant data
  firstName: string;
  lastName: string;
  birthDateISO: string;
  age: number;
  division: Division;
  whatsapp: string;
  email: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  healthNote: string | null; // private, never public

  // Assessment
  preliminaryLevel: PreliminaryLevel;
  assessmentAnswers: Record<string, number | string>;
  manualReviewReason: string | null;

  // Entry logistics
  turnDateISO: string;
  turnTimeSlot: string;

  // Lifecycle
  status: ApplicationStatus;
  whatsappConfirmDeadlineISO: string;
  checkedInAt: string | null;
  signedAt: string | null;

  // Entry Assessment (presencial)
  entryAssessmentScores: EntryAssessmentScores | null;
  officialLevel: "foundation" | "performance" | "tactical" | null;

  // Payment
  paymentAmount: number | null;
  paymentMethod: "qr" | "cash" | null;
  paymentStatus: "pending" | "paid" | "refund_due" | "refunded" | null;
  paymentDate: string | null;

  // Member linkage (once admitted)
  memberId: string | null;

  // Public roster consent (only relevant once a Member exists)
  rosterConsent: boolean;
};
