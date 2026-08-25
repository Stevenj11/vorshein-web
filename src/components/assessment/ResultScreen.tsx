"use client";

import { useLocale, useTranslations } from "next-intl";
import { classify } from "@/lib/assessment/gates";
import { LEVEL_TO_PROGRAM_SLUG } from "@/lib/programs";
import { preliminaryToLevel } from "@/lib/assessment/scoring";
import { Button } from "@/components/ui/Button";

export function ResultScreen({
  result,
  onRetake,
}: {
  result: ReturnType<typeof classify>;
  onRetake: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("assessment.result");
  const tl = useTranslations("scoring.levelName");
  const tp = useTranslations("scoring.levelPath");

  const level = preliminaryToLevel(result.level);
  const isInconclusive = result.level === "INCONCLUSIVE";

  const levelLine = isInconclusive
    ? t("inconclusiveHeading")
    : `${tl(result.level)} // ${t("preliminaryTag")}`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("label")}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
          {levelLine}
        </h1>
        <p className="mt-5 text-fg-muted">
          {isInconclusive ? t("inconclusiveBody") : t("preliminaryBody")}
        </p>
      </div>

      {!isInconclusive && level && (
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          <div className="bg-panel p-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {t("recommendedPath")}
            </span>
            <p className="mt-2 text-sm font-medium text-fg">{tp(result.level)}</p>
          </div>
          <div className="bg-panel p-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {t("statusLabel")}
            </span>
            <p className="mt-2 text-sm font-medium text-signal">
              {t("pendingVerification")}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 border border-line-strong px-6 py-4 text-center">
        <p className="text-sm text-fg-muted">{t("officialDisclaimer")}</p>
      </div>

      {result.needsManualReview && (
        <div className="mt-6 border border-line-strong px-6 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("manualReviewLabel")}
          </span>
          <p className="mt-1 text-sm text-fg-muted">{t("manualReviewBody")}</p>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-4">
        {!isInconclusive && level ? (
          <>
            <a
              href={`/${locale}/apply?level=${encodeURIComponent(result.level)}&path=${encodeURIComponent(tp(result.level))}`}
              className="inline-flex w-full items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal sm:w-auto"
            >
              {t("apply")}
            </a>
            <Button
              href={`/training/${LEVEL_TO_PROGRAM_SLUG[level]}`}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              {t("viewProgram")}
            </Button>
          </>
        ) : (
          <a
            href={`/${locale}/apply?level=INCONCLUSIVE`}
            className="inline-flex w-full items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal sm:w-auto"
          >
            {t("apply")}
          </a>
        )}
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
