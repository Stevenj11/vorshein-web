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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(76,201,240,0.1),transparent_60%)]" />

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
          className="relative mt-10 animate-fade-up"
          style={{ animationDelay: D(80) }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 scale-[2.4] bg-[radial-gradient(circle,rgba(76,201,240,0.16),transparent_70%)] blur-xl" />
          <Logo size={84} />
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
    </section>
  );
}
