"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `¿Eliminar a ${name} (${id}) de forma permanente? Esto no elimina su postulación original, solo el registro de Miembro. Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setBusy(true);
    await fetch(`/api/command-center/members/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      disabled={busy}
      onClick={handleDelete}
      className="border border-red-500/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-red-400 transition-colors hover:border-red-400 hover:text-red-300 disabled:opacity-30"
    >
      Eliminar
    </button>
  );
}
