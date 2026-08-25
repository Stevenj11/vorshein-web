import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getApplication, updateApplication } from "@/lib/applications/store";
import { recordPayment } from "@/lib/payments/store";
import { getActiveGeneration } from "@/lib/generation";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const application = await getApplication(id.trim().toUpperCase());
  if (!application) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ application });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const action = body?.action as "checkin" | "sign" | "pay_qr" | "pay_cash" | undefined;
  if (!id || !action) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const application = await getApplication(id);
  if (!application) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (action === "checkin") {
    const updated = await updateApplication(id, {
      status: "CHECKED_IN",
      checkedInAt: new Date().toISOString(),
    });
    return NextResponse.json({ application: updated });
  }

  if (action === "sign") {
    const updated = await updateApplication(id, {
      status: "SIGNED",
      signedAt: new Date().toISOString(),
    });
    return NextResponse.json({ application: updated });
  }

  // pay_qr / pay_cash
  const method = action === "pay_qr" ? "qr" : "cash";
  const generation = await getActiveGeneration();
  await recordPayment({
    applicationId: id,
    memberId: application.memberId,
    amount: generation.price,
    method,
    status: "paid",
    date: new Date().toISOString(),
    concept: "GEN 001 — Entry Assessment + Training Cycle",
    assessmentPortion: generation.assessmentFee,
    trainingPortion: generation.trainingFee,
    refundDueAt: null,
    refundCompletedAt: null,
  });
  const updated = await updateApplication(id, {
    status: "PAID",
    paymentAmount: generation.price,
    paymentMethod: method,
    paymentStatus: "paid",
    paymentDate: new Date().toISOString(),
  });
  return NextResponse.json({ application: updated });
}
