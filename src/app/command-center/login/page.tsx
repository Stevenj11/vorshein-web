"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CommandCenterLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/command-center/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Contraseña incorrecta.");
        setLoading(false);
        return;
      }
      router.push("/command-center");
      router.refresh();
    } catch {
      setError("Error de conexión.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/40">
          VORSHEIN // COMMAND CENTER
        </p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full border border-white/20 bg-transparent px-4 py-3.5 text-center text-white outline-none focus:border-white/60"
        />
        {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-white px-4 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-black transition-opacity disabled:opacity-40"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
