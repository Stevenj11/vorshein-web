"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/command-center", label: "Dashboard" },
  { href: "/command-center/applications", label: "Applications" },
  { href: "/command-center/checkin", label: "Check-in" },
  { href: "/command-center/members", label: "Members" },
  { href: "/command-center/attendance", label: "Attendance" },
  { href: "/command-center/payments", label: "Payments" },
  { href: "/command-center/generation", label: "Generation" },
];

export function CommandCenterNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 py-2">
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
  );
}
