export type Payment = {
  id: string;
  applicationId: string;
  memberId: string | null;
  amount: number;
  method: "qr" | "cash";
  status: "paid" | "pending" | "refund_due" | "refunded";
  date: string;
  concept: string; // e.g. "GEN 001 — Entry Assessment + Training Cycle"
  assessmentPortion: number; // Bs 30
  trainingPortion: number; // Bs 220
  refundDueAt: string | null;
  refundCompletedAt: string | null;
};
