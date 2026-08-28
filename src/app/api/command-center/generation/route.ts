import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getActiveGeneration, updateGeneration } from "@/lib/generation";
import { listApplications } from "@/lib/applications/store";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const current = await getActiveGeneration();
  const price = Number(body.price);
  const assessmentFee = Number(body.assessmentFee);

  // Detect entry-date changes and find CONFIRMED applications still pointing
  // at a date that's about to disappear — the admin needs to know who to
  // notify, since we never move an application's turn date silently.
  const oldEntryDates = current.dates.entryDatesISO;
  const newEntryDates = [body.entryDate1, body.entryDate2].filter(Boolean);
  const removedDates = oldEntryDates.filter((d) => !newEntryDates.includes(d));
  let affectedApplications: { id: string; firstName: string; lastName: string; whatsapp: string; turnDateISO: string; turnTimeSlot: string }[] = [];
  if (removedDates.length > 0) {
    const allApplications = await listApplications();
    affectedApplications = allApplications
      .filter(
        (a) =>
          removedDates.includes(a.turnDateISO) &&
          (a.status === "CONFIRMED" || a.status === "RESERVED"),
      )
      .map((a) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        whatsapp: a.whatsapp,
        turnDateISO: a.turnDateISO,
        turnTimeSlot: a.turnTimeSlot,
      }));
  }

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
    // Day/levels are structural (which two levels share a turno) and aren't
    // exposed in the form — only time and capacity are admin-editable.
    turnos: current.turnos.map((turno) => ({
      ...turno,
      startTime: body[`turno_${turno.id}_startTime`] || turno.startTime,
      endTime: body[`turno_${turno.id}_endTime`] || turno.endTime,
      minCapacity: Number(body[`turno_${turno.id}_min`] ?? turno.minCapacity),
      maxCapacity: Number(body[`turno_${turno.id}_max`] ?? turno.maxCapacity),
    })),
  });

  return NextResponse.json({ generation: updated, affectedApplications });
}
