import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listApplications } from "@/lib/applications/store";
import { listMembers } from "@/lib/members/store";
import { listAttendance } from "@/lib/attendance/store";
import { listPayments } from "@/lib/payments/store";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const str = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${str.replaceAll('"', '""')}"`;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  let rows: Record<string, unknown>[] = [];

  if (type === "applications") rows = await listApplications();
  else if (type === "members") rows = await listMembers();
  else if (type === "attendance") rows = await listAttendance();
  else if (type === "payments") rows = await listPayments();
  else return NextResponse.json({ error: "unknown export type" }, { status: 400 });

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}.csv"`,
    },
  });
}
