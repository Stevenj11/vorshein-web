import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getApplication, updateApplication } from "@/lib/applications/store";
import { ApplicationStatus } from "@/lib/applications/types";
import { promoteApplicationToMember } from "@/lib/members/store";
import {
  sendAdmissionEmail,
  sendEntryConfirmedEmail,
  sendNotYetEligibleEmail,
} from "@/lib/emails/templates";

const VALID_STATUSES: ApplicationStatus[] = [
  "RESERVED",
  "CONFIRMED",
  "CHECKED_IN",
  "SIGNED",
  "PAID",
  "ASSESSED",
  "MANUAL_REVIEW",
  "ADMITTED",
  "NOT_YET_ELIGIBLE",
  "NO_SHOW",
  "WAITLIST",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as ApplicationStatus | undefined;
  const officialLevel = body?.officialLevel as
    | "foundation"
    | "performance"
    | "tactical"
    | undefined;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const application = await getApplication(id);
  if (!application) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Admission always requires an explicit officialLevel — the system
  // recommends, the coach/admin confirms (spec section 29).
  if (status === "ADMITTED") {
    if (!officialLevel) {
      return NextResponse.json({ error: "officialLevel required for admission" }, { status: 400 });
    }
    const member = await promoteApplicationToMember(application, officialLevel);
    const updated = await updateApplication(id, {
      status,
      officialLevel,
      memberId: member.id,
    });
    await sendAdmissionEmail(application, member.id, officialLevel);
    return NextResponse.json({ application: updated, memberId: member.id });
  }

  const updated = await updateApplication(id, { status });

  if (status === "CONFIRMED") await sendEntryConfirmedEmail(application);
  if (status === "NOT_YET_ELIGIBLE") await sendNotYetEligibleEmail(application);

  return NextResponse.json({ application: updated });
}
