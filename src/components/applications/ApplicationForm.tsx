"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Application } from "@/lib/applications/types";
import { formatWeekdayDate } from "@/lib/enrollment";
import { useAssessmentResult } from "@/lib/assessment/storage";
import { EntryPassCard } from "./EntryPassCard";

type Status = "idle" | "submitting" | "success" | "error";
type TurnAvailability = {
  turnDateISO: string;
  timeSlot: string;
  reserved: number;
  capacity: number;
  full: boolean;
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = CURRENT_YEAR - 30;
const MAX_BIRTH_YEAR = CURRENT_YEAR - 18;

const ERROR_KEY: Record<string, string> = {
  missing_name: "errorName",
  invalid_birth_year: "errorBirthYear",
  invalid_whatsapp: "errorWhatsapp",
  missing_assessment: "errorNeedsAssessment",
  not_eligible: "errorNotEligible",
  duplicate_application: "errorDuplicate",
  server_error: "errorServer",
};

export function ApplicationForm({
  entryDates,
  price,
  currency,
}: {
  entryDates: string[];
  price: number;
  currency: string;
}) {
  const t = useTranslations("apply.form");
  const locale = useLocale();
  const stored = useAssessmentResult();
  const [status, setStatus] = useState<Status>("idle");
  const [application, setApplication] = useState<Application | null>(null);
  const [turnDate, setTurnDate] = useState(entryDates[0]);
  const [turns, setTurns] = useState<TurnAvailability[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (!stored) return;
    const level = stored.preliminaryLevel.toLowerCase();
    fetch(`/api/applications/turns?level=${level}`)
      .then((res) => res.json())
      .then((data: { turns: TurnAvailability[] }) => {
        setTurns(data.turns);
        const firstOpen = data.turns.find((turn) => !turn.full);
        if (firstOpen) setTurnDate(firstOpen.turnDateISO);
      })
      .catch(() => setTurns(null));
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorKey(null);

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const birthYear = Number(form.get("birthYear"));
    const whatsapp = String(form.get("whatsapp") ?? "").trim();

    if (!firstName || !lastName) {
      setErrorKey("errorName");
      return;
    }
    if (!birthYear || birthYear < MIN_BIRTH_YEAR - 5 || birthYear > MAX_BIRTH_YEAR + 5) {
      setErrorKey("errorBirthYear");
      return;
    }
    if (birthYear < MIN_BIRTH_YEAR || birthYear > MAX_BIRTH_YEAR) {
      setErrorKey("errorAgeRange");
      return;
    }
    if (!whatsapp || whatsapp.replace(/\D/g, "").length < 7) {
      setErrorKey("errorWhatsapp");
      return;
    }

    const payload = {
      firstName,
      lastName,
      birthYear,
      whatsapp,
      turnDateISO: turnDate,
      sex: stored?.sex,
      assessmentAnswers: stored?.answers,
    };

    setStatus("submitting");
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
      setStatus("success");
    } catch {
      setErrorKey("errorServer");
      setStatus("error");
    }
  }

  if (status === "success" && application) {
    return <EntryPassCard application={application} price={price} currency={currency} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("firstName")}
          </span>
          <input
            name="firstName"
            autoComplete="given-name"
            className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("lastName")}
          </span>
          <input
            name="lastName"
            autoComplete="family-name"
            className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("birthYear")}
          </span>
          <input
            name="birthYear"
            type="number"
            inputMode="numeric"
            placeholder="2000"
            min={MIN_BIRTH_YEAR - 5}
            max={MAX_BIRTH_YEAR + 5}
            className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("whatsapp")}
          </span>
          <input
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+591 7xxxxxxx"
            className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
          />
        </label>
      </div>

      {entryDates.length > 1 && (
        <div className="border-t border-line pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("turnDate")}
          </span>
          <p className="mt-1 text-xs text-fg-faint">{t("turnDateSub")}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entryDates.map((date) => {
              const info = turns?.find((turn) => turn.turnDateISO === date);
              const full = info?.full ?? false;
              const active = turnDate === date;
              return (
                <button
                  key={date}
                  type="button"
                  disabled={full}
                  onClick={() => setTurnDate(date)}
                  className={`flex flex-col items-start gap-1 border px-4 py-3 text-left transition-colors ${
                    full
                      ? "cursor-not-allowed border-line text-fg-faint opacity-50"
                      : active
                        ? "border-signal text-signal"
                        : "border-line-strong text-fg hover:border-fg-muted"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {formatWeekdayDate(date, locale)}
                  </span>
                  {info && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                      {info.timeSlot} · {full ? t("turnFull") : `${info.capacity - info.reserved}/${info.capacity} ${t("turnSpotsLeft")}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {errorKey && <p className="text-sm text-signal">{t(errorKey)}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal disabled:opacity-40"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
      <p className="text-center text-xs text-fg-faint">{t("noPaymentNote")}</p>
    </form>
  );
}
