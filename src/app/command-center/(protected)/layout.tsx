import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { CommandCenterNav } from "./CommandCenterNav";
import { LogoutButton } from "./LogoutButton";

export default async function CommandCenterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/command-center/login");

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          VORSHEIN // COMMAND CENTER
        </p>
        <LogoutButton />
      </header>
      <CommandCenterNav />
      <main className="px-4 py-6 pb-24">{children}</main>
    </div>
  );
}
