export type AttendanceMark = "present" | "absent" | "late";

export type AttendanceRecord = {
  memberId: string;
  generationId: string;
  level: "foundation" | "performance" | "tactical";
  sessionNumber: number; // 1-8
  dateISO: string;
  mark: AttendanceMark;
};
