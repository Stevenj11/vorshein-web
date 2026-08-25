import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteApplication, getApplication } from "@/lib/applications/store";

/** Only ever deletes applications already in a terminal negative state
 * (rejected/no-show) — the row action that calls this hides the button
 * for anything else, and this is the server-side backstop for that. */
const DELETABLE_STATUSES = ["NOT_YET_ELIGIBLE", "NO_SHOW", "WAITLIST"];

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await getApplication(id);
  if (!application) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!DELETABLE_STATUSES.includes(application.status)) {
    return NextResponse.json({ error: "cannot delete an active application" }, { status: 400 });
  }

  await deleteApplication(id);
  return NextResponse.json({ ok: true });
}
