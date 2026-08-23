"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getCompetitionStatus } from "@/lib/assessment/competition";
import { AssessmentResult } from "@/lib/assessment/scoring";
import { LEVEL_TO_PROGRAM_SLUG } from "@/lib/programs";

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export function ResultScreen({
  result,
  onRetake,
}: {
  result: AssessmentResult;
  onRetake: () => void;
}) {
  const readiness = useCountUp(result.readiness);
  const competition = getCompetitionStatus(result.level);
  const locale = useLocale();
  const t = useTranslations("assessment.result");
  const tl = useTranslations("scoring.levelName");
  const tp = useTranslations("scoring.levelPath");
  const tt = useTranslations("scoring.tags");

  const strength = result.strengthTag ? tt(result.strengthTag) : "—";
  const priority = result.priorityTags.length
    ? result.priorityTags.map((tag) => tt(tag)).join(" + ")
    : "—";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("label")}
        </span>
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="font-mono text-xs text-fg-faint">
            {t("levelLabel", { n: result.levelNumber })}
          </span>
        </div>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight md:text-6xl">
          {tl(result.level)}
        </h1>
      </div>

      <div className="mt-14 flex flex-col items-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("readinessLabel")}
        </span>
        <div className="mt-3 font-mono text-6xl font-medium text-signal tabular-nums">
          {readiness}
          <span className="text-2xl text-fg-faint"> / 100</span>
        </div>
        <div className="mt-4 h-px w-64 bg-line">
          <div
            className="h-px bg-signal transition-all duration-700"
            style={{ width: `${readiness}%` }}
          />
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {[
          { label: t("strength"), value: strength },
          { label: t("priority"), value: priority },
          { label: t("recommendedPath"), value: tp(result.level) },
        ].map((item) => (
          <div key={item.label} className="bg-panel p-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {item.label}
            </span>
            <p className="mt-2 text-sm font-medium text-fg">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border border-line px-6 py-5">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("competitionStatus")}
          </span>
          <p
            className={`mt-1 font-mono text-sm uppercase tracking-[0.15em] ${
              competition.eligible ? "text-signal" : "text-fg-muted"
            }`}
          >
            {competition.eligible ? t("eligible") : t("locked")}
          </p>
        </div>
        <p className="max-w-[55%] text-right text-xs text-fg-muted">
          {competition.eligible
            ? t("eligibleMessage")
            : t("lockedMessage", { level: tl(competition.requiredLevel) })}
        </p>
      </div>

      {result.safetyFlag && (
        <div className="mt-6 border border-line-strong px-6 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("safetyNoteLabel")}
          </span>
          <p className="mt-1 text-sm text-fg-muted">
            {t(
              result.safetyFlag === "significant"
                ? "safetyNoteSignificant"
                : "safetyNoteMinor",
            )}
          </p>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-4">
        <a
          href={`/${locale}/reserve?level=${encodeURIComponent(result.level)}&path=${encodeURIComponent(tp(result.level))}`}
          className="inline-flex w-full items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal sm:w-auto"
        >
          {t("reserve")}
        </a>
        <Button
          href={`/training/${LEVEL_TO_PROGRAM_SLUG[result.level]}`}
          variant="ghost"
          className="w-full sm:w-auto"
        >
          {t("viewProgram")}
        </Button>
        <button
          onClick={onRetake}
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
        >
          {t("retake")}
        </button>
      </div>
    </div>
  );
}
