"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/command-center/logout", { method: "POST" });
    router.push("/command-center/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white">
      Logout
    </button>
  );
}
