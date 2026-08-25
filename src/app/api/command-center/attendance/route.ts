import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { markAttendance } from "@/lib/attendance/store";
import { AttendanceMark } from "@/lib/attendance/types";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { memberId, generationId, level, sessionNumber, mark } = body ?? {};
  if (!memberId || !generationId || !level || !sessionNumber || !mark) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  await markAttendance({
    memberId,
    generationId,
    level,
    sessionNumber,
    mark: mark as AttendanceMark,
    dateISO: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
