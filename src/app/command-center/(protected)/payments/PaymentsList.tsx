"use client";

import { useMemo, useState } from "react";
import { normalizeApplicationId } from "@/lib/applications/format";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { RefundButton } from "./RefundButton";

type EnrichedPayment = {
  id: string;
  applicationId: string;
  applicantName: string;
  amount: number;
  method: "qr" | "cash";
  status: "paid" | "pending" | "refund_due" | "refunded";
  date: string;
};

// Shares the same normalization as the public status lookup and Check-in
// search, so "0004", "VS0004", "A0004", or "VRSN-A0004" all match here too —
// whatever format the applicant actually reads off their Entry Pass.
function matches(query: string, payment: EnrichedPayment): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;
  if (normalizeApplicationId(trimmed) === normalizeApplicationId(payment.applicationId)) return true;
  return payment.applicantName.toUpperCase().includes(trimmed.toUpperCase());
}

export function PaymentsList({ payments }: { payments: EnrichedPayment[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => payments.filter((p) => matches(query, p)), [payments, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por código (VS0004, 0004) o nombre…"
        className="mb-4 w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="flex flex-col gap-2 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400">{p.applicationId}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
              </span>
            </div>
            <p className="text-base font-medium text-white">{p.applicantName}</p>
            <p className="font-mono text-sm text-white">Bs {p.amount}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
              {PAYMENT_METHOD_LABEL[p.method] ?? p.method} · {new Date(p.date).toLocaleDateString("es-BO")}
            </p>
            {p.status === "refund_due" && (
              <div className="mt-1">
                <RefundButton id={p.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center font-mono text-xs uppercase tracking-[0.15em] text-white/30">
          {query.trim() ? <>Sin resultados para &ldquo;{query}&rdquo;.</> : "Sin pagos todavía."}
        </p>
      )}
    </div>
  );
}
