"use client";

import { useState } from "react";
import { Application } from "@/lib/applications/types";
import { APPLICATION_STATUS_LABEL } from "@/lib/commandCenterLabels";

type Action = "checkin" | "sign" | "pay_qr" | "pay_cash";

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 font-mono text-[10px] text-white/70">
        {n}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">{text}</span>
    </div>
  );
}

export default function CheckinPage() {
  const [query, setQuery] = useState("");
  const [app, setApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function search() {
    setError(null);
    setApp(null);
    const res = await fetch(`/api/command-center/checkin?id=${encodeURIComponent(query.trim())}`);
    if (!res.ok) {
      setError("No encontrado.");
      return;
    }
    const data = await res.json();
    setApp(data.application);
  }

  async function action(a: Action) {
    if (!app) return;
    setBusy(true);
    const res = await fetch("/api/command-center/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, action: a }),
    });
    const data = await res.json();
    if (res.ok) setApp(data.application);
    setBusy(false);
  }

  function next() {
    setApp(null);
    setQuery("");
  }

  const bigBtn =
    "w-full border border-white/20 px-6 py-6 text-center text-sm font-mono uppercase tracking-[0.15em] transition-colors active:bg-white active:text-black disabled:opacity-30";

  const notCheckedIn = app && !["CHECKED_IN", "SIGNED", "PAID"].includes(app.status);
  const notSigned = app && app.status === "CHECKED_IN";
  const notPaid = app && app.status === "SIGNED";
  const done = app && app.status === "PAID";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="border border-white/10 p-4">
        <StepLabel n={1} text="Busca al postulante por su ID" />
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="VRSN-A0001"
            className="flex-1 border border-white/20 bg-transparent px-4 py-3 text-center font-mono uppercase text-white outline-none focus:border-white"
          />
          <button onClick={search} className="border border-white/20 px-5 py-3 text-xs font-mono uppercase tracking-[0.15em]">
            Buscar
          </button>
        </div>
        {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
      </div>

      {app && (
        <div className="border border-white/10 p-4">
          <StepLabel n={2} text="Avanza su evaluación presencial" />

          <div className="border border-white/10 p-4 text-center">
            <p className="font-mono text-xs text-cyan-400">{app.id}</p>
            <p className="mt-1 text-lg font-bold">{app.firstName} {app.lastName}</p>
            <p className="mt-1 font-mono text-xs text-white/50">
              {app.preliminaryLevel} · {app.turnDateISO} · {app.turnTimeSlot}
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-white/70">
              {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
            </p>
          </div>

          {/* Only ever one decision on screen at a time, matching the real
              order of the process — not all four actions at once. */}
          <div className="mt-4 flex flex-col gap-3">
            {notCheckedIn && (
              <button disabled={busy} className={`${bigBtn} bg-white text-black`} onClick={() => action("checkin")}>
                Marcar Check-in
              </button>
            )}
            {notSigned && (
              <button disabled={busy} className={`${bigBtn} bg-white text-black`} onClick={() => action("sign")}>
                Marcar Firmado
              </button>
            )}
            {notPaid && (
              <>
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Registrar pago
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button disabled={busy} className={bigBtn} onClick={() => action("pay_qr")}>
                    QR
                  </button>
                  <button disabled={busy} className={bigBtn} onClick={() => action("pay_cash")}>
                    Efectivo
                  </button>
                </div>
              </>
            )}
            {done && (
              <p className="text-center font-mono text-sm uppercase tracking-[0.15em] text-emerald-400">
                Completo ✓
              </p>
            )}
            <button className={`${bigBtn} border-white/40`} onClick={next}>
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
