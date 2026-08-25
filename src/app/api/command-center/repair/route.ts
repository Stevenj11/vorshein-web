import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  repairDuplicateApplicationIds,
  repairOrphanedAdmittedStatus,
} from "@/lib/applications/store";

/** One-off (but safe to re-run any time — a no-op once there's nothing to
 * fix) data-integrity repair for the ID-collision bug: reassigns fresh IDs
 * to any duplicate Application ID, then restores ADMITTED status on any
 * application whose memberId proves it was already promoted. */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const reassignedIds = await repairDuplicateApplicationIds();
  const restoredStatus = await repairOrphanedAdmittedStatus();

  return NextResponse.json({ reassignedIds, restoredStatus });
}
