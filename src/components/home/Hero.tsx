"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { isIntroDone } from "@/lib/introLoaderState";

const LOADER_TOTAL_MS = 2800;

export function Hero() {
  const t = useTranslations("home.hero");
  const ts = useTranslations("stats");
  // The intro loader only plays once per real page load (it lives in the
  // root layout). On a client-side navigation back to this page it has
  // already finished, so skip the delay that exists solely to let the
  // loader's exit transition clear before this content fades in.
  const [skipIntroDelay] = useState(() => isIntroDone());
  const baseDelay = skipIntroDelay ? 0 : LOADER_TOTAL_MS;
  const D = (offset: number) => `${baseDelay + offset}ms`;

  const stats = [
    { value: "10", label: ts("modules") },
    { value: "03", label: ts("levels") },
    { value: "09", label: ts("questions") },
  ];

  return (
    <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden border-b border-line">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(76,201,240,0.08),transparent_60%)]" />
      <div
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent"
        style={{ animation: "scan-line 9s linear infinite" }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-10">
        {/* Watermark: anchored to this content column (not the full-bleed
            section), so it sits near the headline instead of drifting off
            into empty space on wide viewports. Masked so it fades into the
            background rather than sitting on top of it like a flat sticker.
            Static — the only motion is an occasional slow light sheen
            passing across it, like a reflection on brushed metal, rather
            than the mark itself spinning. */}
        <div
          className="pointer-events-none absolute right-0 top-12 hidden h-[520px] w-[520px] overflow-hidden opacity-0 sm:block md:top-8 md:h-[600px] md:w-[600px]"
          style={{
            animation: `fade-up 1600ms cubic-bezier(0.16,1,0.3,1) ${D(0)} both`,
            maskImage:
              "radial-gradient(circle at 55% 45%, black 0%, black 45%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at 55% 45%, black 0%, black 45%, transparent 75%)",
          }}
        >
          {/* `animation`/`mask` above put this wrapper in its own stacking
              context, which cuts mix-blend-mode off from the real page
              background. This backdrop — same color as the page — gives the
              blend something correct to cancel against from inside that
              context, so it still reads as "no background" instead of a box. */}
          <div className="absolute inset-0 bg-void" />
          <div className="relative h-full w-full">
            <Logo size={600} className="opacity-[0.22]" />
            <div
              className="absolute left-1/2 top-1/2 h-[140%] w-[10%] bg-gradient-to-b from-transparent via-signal/40 to-transparent blur-md"
              style={{
                animation: "sheen-sweep 6s ease-in-out infinite alternate",
              }}
            />
          </div>
        </div>

        <div
          className="flex animate-fade-up items-center gap-3"
          style={{ animationDelay: D(0) }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
            {t("eyebrow")}
          </span>
        </div>

        <h1
          className="mt-6 max-w-4xl animate-fade-up text-balance text-6xl font-extrabold leading-[0.95] tracking-tight md:text-8xl"
          style={{ animationDelay: D(80) }}
        >
          {t("headlineLine1")}
          <br />
          {t("headlineLine2")}
        </h1>

        <p
          className="mt-7 max-w-xl animate-fade-up text-lg text-fg-muted"
          style={{ animationDelay: D(200) }}
        >
          {t("sub")}
        </p>

        <div
          className="mt-10 flex animate-fade-up flex-col gap-4 sm:flex-row"
          style={{ animationDelay: D(300) }}
        >
          <Button href="/vorshein">{t("ctaPrimary")}</Button>
          <Button href="/assessment" variant="ghost">
            {t("ctaSecondary")}
          </Button>
        </div>

        <div
          className="mt-16 grid animate-fade-up grid-cols-3 divide-x divide-line border-y border-line py-5 sm:max-w-md"
          style={{ animationDelay: D(400) }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-5 first:pl-0">
              <div className="font-mono text-2xl font-medium text-signal tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
