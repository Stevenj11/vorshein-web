import { listAttendance } from "@/lib/attendance/store";
import { getActiveGeneration } from "@/lib/generation";
import { listMembers } from "@/lib/members/store";
import { AttendanceClient } from "./AttendanceClient";

export default async function AttendancePage() {
  const [members, records, generation] = await Promise.all([
    listMembers(),
    listAttendance(),
    getActiveGeneration(),
  ]);

  return <AttendanceClient members={members} initialRecords={records} generationId={generation.id} />;
}
