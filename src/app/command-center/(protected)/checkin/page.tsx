"use client";

import { useState } from "react";
import { Application } from "@/lib/applications/types";
import { APPLICATION_STATUS_LABEL } from "@/lib/commandCenterLabels";

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

  async function action(a: "checkin" | "sign" | "pay_qr" | "pay_cash") {
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

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="border border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 font-mono text-[10px] text-white/70">
            1
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            Busca al postulante por su ID
          </span>
        </div>
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
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 font-mono text-[10px] text-white/70">
              2
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
              Avanza su evaluación presencial
            </span>
          </div>

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

          <div className="mt-4 grid grid-cols-1 gap-3">
            <button disabled={busy} className={bigBtn} onClick={() => action("checkin")}>
              Check-in
            </button>
            <button disabled={busy} className={bigBtn} onClick={() => action("sign")}>
              Firmado
            </button>
            <button disabled={busy} className={bigBtn} onClick={() => action("pay_qr")}>
              Pago QR
            </button>
            <button disabled={busy} className={bigBtn} onClick={() => action("pay_cash")}>
              Pago Efectivo
            </button>
            <button className={`${bigBtn} bg-white text-black`} onClick={next}>
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
