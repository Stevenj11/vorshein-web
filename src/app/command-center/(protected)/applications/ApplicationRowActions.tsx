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

async function deleteApp(id: string) {
  await fetch(`/api/command-center/applications/${id}`, { method: "DELETE" });
}

/**
 * Only ever shows ONE obvious next step by default (the button matching
 * where this application actually is in the funnel), plus a "More" toggle
 * for the exception paths (manual review / not yet eligible / no-show).
 * The old version rendered up to 6 buttons on every row regardless of
 * status, which read as cluttered/confusing in real use.
 */
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
  const [showMore, setShowMore] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    await action();
    router.refresh();
    setBusy(false);
  }

  const officialSlug =
    preliminaryLevel === "TACTICAL"
      ? "tactical"
      : preliminaryLevel === "PERFORMANCE"
        ? "performance"
        : "foundation";

  const canAdmit = preliminaryLevel !== "INCONCLUSIVE" && status !== "ADMITTED";
  const admit = () => run(() => setStatus(id, "ADMITTED", officialSlug));

  const primaryBtn =
    "shrink-0 border border-white bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black transition-opacity hover:opacity-80 disabled:opacity-30";
  const secondaryBtn =
    "shrink-0 border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-white hover:text-white disabled:opacity-30";
  const dangerBtn =
    "shrink-0 border border-red-500/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-red-400 transition-colors hover:border-red-400 hover:text-red-300 disabled:opacity-30";
  const moreToggle =
    "shrink-0 px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-white";

  const rejected = status === "NOT_YET_ELIGIBLE" || status === "NO_SHOW" || status === "WAITLIST";
  const admitted = status === "ADMITTED";

  function confirmDelete() {
    if (window.confirm("¿Eliminar esta postulación de forma permanente? Esta acción no se puede deshacer.")) {
      run(() => deleteApp(id));
    }
  }

  let primary: React.ReactNode = null;
  if (status === "RESERVED") {
    primary = (
      <button disabled={busy} className={primaryBtn} onClick={() => run(() => setStatus(id, "CONFIRMED"))}>
        Confirmar
      </button>
    );
  } else if (status === "CONFIRMED") {
    primary = (
      <button disabled={busy} className={primaryBtn} onClick={() => run(() => setStatus(id, "CHECKED_IN"))}>
        Check-in
      </button>
    );
  } else if (canAdmit && !rejected) {
    primary = (
      <button disabled={busy} className={primaryBtn} onClick={admit}>
        Admitir {preliminaryLevel}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {primary}
      {rejected && (
        <button disabled={busy} className={dangerBtn} onClick={confirmDelete}>
          Eliminar
        </button>
      )}
      <button
        type="button"
        className={moreToggle}
        onClick={() => setShowMore((v) => !v)}
        aria-expanded={showMore}
      >
        {showMore ? "Menos ▴" : "Más ▾"}
      </button>
      {showMore && (
        <>
          {admitted ? (
            <button
              disabled={busy}
              className={secondaryBtn}
              onClick={() => {
                if (
                  window.confirm(
                    "¿Revertir la admisión? Esto corrige el estado de la postulación, pero no elimina el registro en Miembros si ya se creó — revísalo ahí también si hace falta.",
                  )
                ) {
                  run(() => setStatus(id, "CONFIRMED"));
                }
              }}
            >
              Corregir — Revertir a Confirmado
            </button>
          ) : (
            <>
              {canAdmit && status !== "RESERVED" && status !== "CONFIRMED" && (
                <button disabled={busy} className={secondaryBtn} onClick={admit}>
                  Admitir {preliminaryLevel}
                </button>
              )}
              <button disabled={busy} className={secondaryBtn} onClick={() => run(() => setStatus(id, "MANUAL_REVIEW"))}>
                Revisión Manual
              </button>
              {status !== "NOT_YET_ELIGIBLE" && (
                <button disabled={busy} className={secondaryBtn} onClick={() => run(() => setStatus(id, "NOT_YET_ELIGIBLE"))}>
                  Aún No Elegible
                </button>
              )}
              {status !== "NO_SHOW" && (
                <button disabled={busy} className={secondaryBtn} onClick={() => run(() => setStatus(id, "NO_SHOW"))}>
                  No Se Presentó
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
