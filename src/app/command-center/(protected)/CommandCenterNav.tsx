"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/command-center", label: "Panel" },
  { href: "/command-center/applications", label: "Postulaciones" },
  { href: "/command-center/checkin", label: "Check-in" },
  { href: "/command-center/members", label: "Miembros" },
  { href: "/command-center/attendance", label: "Asistencia" },
  { href: "/command-center/payments", label: "Pagos" },
  { href: "/command-center/generation", label: "Generación" },
];

export function CommandCenterNav() {
  const pathname = usePathname();

  return (
    <div className="relative border-b border-white/10">
      <nav className="flex gap-1 overflow-x-auto px-4 py-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 whitespace-nowrap px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                active ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-void to-transparent sm:hidden" />
    </div>
  );
}
