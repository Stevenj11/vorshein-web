"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BRAND } from "@/lib/brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/training", label: t("training") },
    { href: "/apply", label: t("gen001") },
    { href: "/vorshein", label: t("about") },
    { href: "/events", label: t("events") },
    { href: "/estado", label: t("myApplication") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo size={26} />
          <span className="font-mono text-sm font-medium tracking-[0.25em]">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <span
                  className={`transition-colors ${
                    active ? "text-fg" : "text-fg-muted group-hover:text-fg"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute inset-x-4 -bottom-[1px] h-px bg-signal transition-transform duration-200 ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-6 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-signal hover:text-signal"
          >
            {t("findYourLevel")}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/estado"
            onClick={() => setOpen(false)}
            className="flex h-9 items-center border border-line-strong px-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-muted transition-colors hover:border-signal hover:text-signal"
          >
            {t("myApplication")}
          </Link>
          <button
            aria-label={t("toggleMenu")}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-fg transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-fg transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="min-h-[calc(100svh-72px)] border-t border-line bg-void px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.2em] text-fg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/assessment"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-fit items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-signal"
            >
              {t("findYourLevel")}
            </Link>
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
