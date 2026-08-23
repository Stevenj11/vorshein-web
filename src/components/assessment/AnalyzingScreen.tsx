"use client";

import { useTranslations } from "next-intl";

export function AnalyzingScreen() {
  const t = useTranslations("assessment");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border border-line-strong" />
        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-signal" />
        <div className="absolute inset-3 rounded-full border border-signal/30" />
      </div>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
        {t("analyzing")}
      </p>
    </div>
  );
}
