"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";
import { isIntroDone } from "@/lib/introLoaderState";

const LOADER_TOTAL_MS = 2800;

/**
 * Minimal, logo-first hero — a full rewrite of the old text-dominant
 * version. The brand mark is the protagonist; the campaign line
 * ("Nadar es el principio...") survives only as a small secondary quote,
 * not the largest thing on the screen. One obvious primary action
 * (assessment) plus a quiet secondary link for anyone who wants the full
 * story, instead of forcing every visitor through the philosophy first.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const [skipIntroDelay] = useState(() => isIntroDone());
  const baseDelay = skipIntroDelay ? 0 : LOADER_TOTAL_MS;
  const D = (offset: number) => `${baseDelay + offset}ms`;

  return (
    <section className="relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden border-b border-line px-6 py-24 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(76,201,240,0.14),transparent_62%)]" />
      <div
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent"
        style={{ animation: "scan-line 10s linear infinite" }}
      />

      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-signal/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-signal/10 blur-[100px]" />

      {/* Corner brackets frame the whole viewport so the negative space
          reads as a deliberate, tactical composition rather than empty
          black — same visual language as ImagePlaceholder's frame. */}
      {(
        [
          ["left-6 top-6 md:left-10 md:top-10", "border-l border-t"],
          ["right-6 top-6 md:right-10 md:top-10", "border-r border-t"],
          ["bottom-6 left-6 md:bottom-10 md:left-10", "border-b border-l"],
          ["bottom-6 right-6 md:bottom-10 md:right-10", "border-b border-r"],
        ] as const
      ).map(([pos, border]) => (
        <div
          key={pos}
          className={`pointer-events-none absolute h-4 w-4 ${pos} ${border} border-signal/30`}
        />
      ))}

      <div className="relative flex w-full max-w-lg flex-col items-center">
        <div
          className="flex animate-fade-up items-center gap-3"
          style={{ animationDelay: D(0) }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            {t("eyebrow")}
          </span>
        </div>

        <div
          className="relative mt-10 animate-fade-up overflow-hidden"
          style={{ animationDelay: D(80) }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 scale-[2.4] bg-[radial-gradient(circle,rgba(76,201,240,0.16),transparent_70%)] blur-xl" />
          <Logo size={84} />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[10%] bg-gradient-to-b from-transparent via-signal/50 to-transparent blur-sm"
            style={{ animation: "sheen-sweep 5s ease-in-out infinite alternate" }}
          />
        </div>

        <h1
          className="mt-7 animate-fade-up font-mono text-sm uppercase tracking-[0.5em] text-fg"
          style={{ animationDelay: D(140) }}
        >
          Vorshein
        </h1>

        <p
          className="mt-5 max-w-sm animate-fade-up text-balance text-lg text-fg-muted"
          style={{ animationDelay: D(200) }}
        >
          {t("tagline")}
        </p>

        <p
          className="mt-3 max-w-xs animate-fade-up text-pretty font-mono text-xs uppercase tracking-[0.1em] text-fg-faint"
          style={{ animationDelay: D(240) }}
        >
          {t("campaignLine")}
        </p>

        <div
          className="mt-10 flex animate-fade-up flex-col items-center gap-4"
          style={{ animationDelay: D(300) }}
        >
          <Button href="/assessment">{t("ctaPrimary")}</Button>
          <Link
            href="/vorshein"
            className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
          >
            {t("moreLink")} →
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-fg-faint">
          Scroll
        </span>
        <div className="relative h-8 w-px overflow-hidden bg-line-strong">
          <span
            className="absolute left-0 h-2 w-px bg-signal"
            style={{ animation: "scroll-hint 2.2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
