import { promises as fs } from "fs";
import path from "path";
import { AttendanceRecord } from "./types";

const FILE = path.join(process.cwd(), "data", "attendance.json");

async function readAll(): Promise<AttendanceRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as AttendanceRecord[];
  } catch {
    return [];
  }
}

async function writeAll(records: AttendanceRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(records, null, 2), "utf-8");
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
