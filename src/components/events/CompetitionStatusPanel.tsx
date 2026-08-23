"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { getCompetitionStatus } from "@/lib/assessment/competition";
import { useAssessmentResult } from "@/lib/assessment/storage";

export function CompetitionStatusPanel() {
  const result = useAssessmentResult();
  const status = getCompetitionStatus(result?.level ?? null);
  const t = useTranslations("assessment.result");
  const tc = useTranslations("competition");
  const tl = useTranslations("scoring.levelName");
  const tn = useTranslations("nav");

  const label = !result
    ? tc("noResultLabel")
    : status.eligible
      ? t("eligible")
      : t("locked");
  const message = !result
    ? tc("noResultMessage")
    : status.eligible
      ? t("eligibleMessage")
      : t("lockedMessage", { level: tl(status.requiredLevel) });

  return (
    <div className="border border-line">
      <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center md:p-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            {t("competitionStatus")}
          </span>
          <p
            className={`mt-2 font-mono text-3xl uppercase tracking-[0.1em] ${
              status.eligible ? "text-signal" : "text-fg"
            }`}
          >
            {label}
          </p>
          <p className="mt-2 max-w-md text-sm text-fg-muted">{message}</p>
        </div>

        {!result && (
          <Button href="/assessment">{tn("findYourLevel")}</Button>
        )}
        {result && !status.eligible && (
          <Button href="/training" variant="ghost">
            {t("viewProgram")}
          </Button>
        )}
      </div>
    </div>
  );
}
