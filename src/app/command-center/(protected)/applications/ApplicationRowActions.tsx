"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationStatus } from "@/lib/applications/types";

async function setStatus(id: string, status: ApplicationStatus, officialLevel?: string) {
  await fetch(`/api/command-center/applications/${id}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, officialLevel }),
  });
}

export function ApplicationRowActions({
  id,
  status,
  preliminaryLevel,
}: {
  id: string;
  status: ApplicationStatus;
  preliminaryLevel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    await action();
    router.refresh();
    setBusy(false);
  }

  const btn =
    "shrink-0 border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-white hover:text-white disabled:opacity-30";

  return (
    <div className="flex flex-wrap gap-1.5">
      {status === "RESERVED" && (
        <button disabled={busy} className={btn} onClick={() => run(() => setStatus(id, "CONFIRMED"))}>
          Confirm
        </button>
      )}
      {(status === "RESERVED" || status === "CONFIRMED") && (
        <button disabled={busy} className={btn} onClick={() => run(() => setStatus(id, "CHECKED_IN"))}>
          Check-in
        </button>
      )}
      {preliminaryLevel !== "INCONCLUSIVE" && status !== "ADMITTED" && (
        <button
          disabled={busy}
          className={btn}
          onClick={() =>
            run(() =>
              setStatus(
                id,
                "ADMITTED",
                preliminaryLevel === "TACTICAL"
                  ? "tactical"
                  : preliminaryLevel === "PERFORMANCE"
                    ? "performance"
                    : "foundation",
              ),
            )
          }
        >
          Confirm {preliminaryLevel}
        </button>
      )}
      {status !== "ADMITTED" && (
        <button disabled={busy} className={btn} onClick={() => run(() => setStatus(id, "MANUAL_REVIEW"))}>
          Manual Review
        </button>
      )}
      {status !== "ADMITTED" && status !== "NOT_YET_ELIGIBLE" && (
        <button disabled={busy} className={btn} onClick={() => run(() => setStatus(id, "NOT_YET_ELIGIBLE"))}>
          Not Yet Eligible
        </button>
      )}
      {status !== "NO_SHOW" && status !== "ADMITTED" && (
        <button disabled={busy} className={btn} onClick={() => run(() => setStatus(id, "NO_SHOW"))}>
          No-show
        </button>
      )}
    </div>
  );
}
