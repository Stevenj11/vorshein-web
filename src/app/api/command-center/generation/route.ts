import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getActiveGeneration, updateGeneration } from "@/lib/generation";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const current = await getActiveGeneration();
  const price = Number(body.price);
  const assessmentFee = Number(body.assessmentFee);
  const updated = await updateGeneration(current.id, {
    name: body.name,
    location: body.location,
    status: body.status,
    price,
    assessmentFee,
    // Derived server-side, never trusted from the client — guarantees
    // assessmentFee + trainingFee always equals price.
    trainingFee: price - assessmentFee,
    whatsappNumber: body.whatsappNumber,
    dates: {
      applicationsOpenISO: body.applicationsOpenISO,
      applicationsCloseISO: body.applicationsCloseISO,
      entryDatesISO: [body.entryDate1, body.entryDate2].filter(Boolean),
      trainingBeginsISO: body.trainingBeginsISO,
      clearanceWeekendISO: [body.clearanceDate1, body.clearanceDate2].filter(Boolean),
    },
    capacities: {
      foundation: {
        min: Number(body.foundationMin),
        max: Number(body.foundationMax),
        scheduleTime: body.foundationSchedule,
        entryTurnCapacity: Number(body.foundationEntryCapacity),
      },
      performance: {
        min: Number(body.performanceMin),
        max: Number(body.performanceMax),
        scheduleTime: body.performanceSchedule,
        entryTurnCapacity: Number(body.performanceEntryCapacity),
      },
      tactical: {
        min: Number(body.tacticalMin),
        max: Number(body.tacticalMax),
        scheduleTime: body.tacticalSchedule,
        entryTurnCapacity: Number(body.tacticalEntryCapacity),
      },
    },
  });

  return NextResponse.json({ generation: updated });
}
