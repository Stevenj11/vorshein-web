"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Application } from "@/lib/applications/types";
import { saveMyApplicationId } from "@/lib/applications/myApplication";
import { formatWeekdayDate } from "@/lib/enrollment";
import { useAssessmentResult } from "@/lib/assessment/storage";
import { EntryPassCard } from "./EntryPassCard";

type Status = "idle" | "submitting" | "success" | "error";
type CohortAvailability = {
  turnId: string;
  turnDateISO: string;
  timeSlot: string;
  reserved: number;
  capacity: number;
  full: boolean;
  secondDateISO: string | null;
  secondTimeSlot: string | null;
};

function CapacityDots({ reserved, capacity }: { reserved: number; capacity: number }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {Array.from({ length: capacity }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < reserved ? "bg-signal" : "border border-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

const ERROR_KEY: Record<string, string> = {
  missing_name: "errorName",
  invalid_birth_year: "errorBirthYear",
  invalid_whatsapp: "errorWhatsapp",
  missing_assessment: "errorNeedsAssessment",
  not_eligible: "errorNotEligible",
  duplicate_application: "errorDuplicate",
  server_error: "errorServer",
};

/**
 * Identity (name, WhatsApp) is already known from the assessment's
 * identity step — this form only ever asks for a turn, so applying reads
 * as one continuous flow instead of retyping the same details twice.
 */
export function ApplicationForm({
  price,
  currency,
  whatsappNumber,
}: {
  price: number;
  currency: string;
  whatsappNumber: string;
}) {
  const t = useTranslations("apply.form");
  const locale = useLocale();
  const stored = useAssessmentResult();
  const [status, setStatus] = useState<Status>("idle");
  const [application, setApplication] = useState<Application | null>(null);
  const [turn, setTurn] = useState<CohortAvailability | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (!stored) return;
    const level = stored.preliminaryLevel.toLowerCase();
    fetch(`/api/applications/turns?level=${level}`)
      .then((res) => res.json())
      .then((data: { turn: CohortAvailability | null }) => setTurn(data.turn))
      .catch(() => setTurn(null));
  }, [stored]);

  if (!stored) {
    return (
      <div className="border border-line-strong px-8 py-10 text-center">
        <p className="text-fg-muted">{t("needsAssessment")}</p>
        <a
          href={`/${locale}/assessment`}
          className="mt-6 inline-flex items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal"
        >
          {t("goToAssessment")}
        </a>
      </div>
    );
  }

  async function handleSubmit() {
    if (!stored) return;
    setErrorKey(null);
    setStatus("submitting");

    const payload = {
      firstName: stored.firstName,
      lastName: stored.lastName,
      birthYear: new Date().getFullYear() - stored.age,
      whatsapp: stored.whatsapp,
      sex: stored.sex,
      assessmentAnswers: stored.answers,
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorKey(ERROR_KEY[data.error as string] ?? "errorServer");
        setStatus("error");
        return;
      }
      setApplication(data.application);
      saveMyApplicationId(data.application.id);
      setStatus("success");
    } catch {
      setErrorKey("errorServer");
      setStatus("error");
    }
  }

  if (status === "success" && application) {
    return (
      <EntryPassCard
        application={application}
        price={price}
        currency={currency}
        whatsappNumber={whatsappNumber}
        secondDateISO={turn?.secondDateISO}
        secondTimeSlot={turn?.secondTimeSlot}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 border border-line-strong px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-medium text-fg">
            {stored.firstName} {stored.lastName}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-faint">
            {stored.whatsapp}
          </p>
        </div>
        <a
          href={`/${locale}/assessment`}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint transition-colors hover:text-fg"
        >
          {t("notYou")}
        </a>
      </div>

      {turn && (
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("turnDate")}
          </span>
          <p className="mt-1 text-xs text-fg-faint">{t("turnDateSub")}</p>
          <div className="mt-4 flex flex-col gap-1 border border-line-strong px-4 py-3">
            <span className="text-sm font-medium">
              {formatWeekdayDate(turn.turnDateISO, locale)} · {turn.timeSlot}
            </span>
            {turn.secondDateISO && turn.secondTimeSlot && (
              <span className="text-sm font-medium">
                {formatWeekdayDate(turn.secondDateISO, locale)} · {turn.secondTimeSlot}
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {turn.full
                ? t("turnFull")
                : `${turn.capacity - turn.reserved}/${turn.capacity} ${t("turnSpotsLeft")}`}
            </span>
            <CapacityDots reserved={turn.reserved} capacity={turn.capacity} />
          </div>
        </div>
      )}

      {errorKey && <p className="text-sm text-signal">{t(errorKey)}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "submitting" || turn?.full === true}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal disabled:opacity-40"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
      <p className="text-center text-xs text-fg-faint">{t("noPaymentNote")}</p>
    </div>
  );
}
