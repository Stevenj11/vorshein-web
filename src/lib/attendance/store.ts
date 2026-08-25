import { readJsonArray, writeJsonArray } from "@/lib/jsonStore";
import { AttendanceRecord } from "./types";

async function readAll(): Promise<AttendanceRecord[]> {
  return readJsonArray<AttendanceRecord>("attendance");
}

async function writeAll(records: AttendanceRecord[]): Promise<void> {
  await writeJsonArray("attendance", records);
}

export async function listAttendance(): Promise<AttendanceRecord[]> {
  return readAll();
}

export async function markAttendance(record: AttendanceRecord): Promise<void> {
  const all = await readAll();
  const idx = all.findIndex(
    (r) =>
      r.memberId === record.memberId &&
      r.level === record.level &&
      r.sessionNumber === record.sessionNumber,
  );
  if (idx === -1) all.push(record);
  else all[idx] = record;
  await writeAll(all);
}

export async function attendanceFor(
  level: "foundation" | "performance" | "tactical",
  sessionNumber: number,
): Promise<AttendanceRecord[]> {
  const all = await readAll();
  return all.filter((r) => r.level === level && r.sessionNumber === sessionNumber);
}
