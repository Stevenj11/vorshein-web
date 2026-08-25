"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefundButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function refund() {
    setBusy(true);
    await fetch(`/api/command-center/payments/${id}/refund`, { method: "POST" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      disabled={busy}
      onClick={refund}
      className="border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70 hover:border-white hover:text-white disabled:opacity-30"
    >
      Marcar Reembolsado
    </button>
  );
}
