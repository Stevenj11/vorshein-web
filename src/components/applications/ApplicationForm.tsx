"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Application } from "@/lib/applications/types";
import { useAssessmentResult } from "@/lib/assessment/storage";
import { EntryPassCard } from "./EntryPassCard";

type Status = "idle" | "submitting" | "success" | "error";

export function ApplicationForm({ entryDates }: { entryDates: string[] }) {
  const t = useTranslations("apply.form");
  const locale = useLocale();
  const stored = useAssessmentResult();
  const [status, setStatus] = useState<Status>("idle");
  const [application, setApplication] = useState<Application | null>(null);
  const [turnDate, setTurnDate] = useState(entryDates[0]);
  const [fieldError, setFieldError] = useState<string | null>(null);

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
    setFieldError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      birthDateISO: String(form.get("birthDate") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      emergencyContactName: String(form.get("emergencyName") ?? "").trim(),
      emergencyContactRelation: String(form.get("emergencyRelation") ?? "").trim(),
      emergencyContactPhone: String(form.get("emergencyPhone") ?? "").trim(),
      healthNote: String(form.get("healthNote") ?? "").trim() || null,
      turnDateISO: turnDate,
      locale,
      sex: stored?.sex,
      assessmentAnswers: stored?.answers,
    };

    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.birthDateISO ||
      !payload.whatsapp ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
      !payload.emergencyContactName ||
      !payload.emergencyContactPhone
    ) {
      setFieldError(t("requiredError"));
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setApplication(data.application);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && application) {
    return <EntryPassCard application={application} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("firstName")}
          </span>
          <input name="firstName" className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("lastName")}
          </span>
          <input name="lastName" className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal" />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("birthDate")}
        </span>
        <input name="birthDate" type="date" className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal" />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("whatsapp")}
          </span>
          <input name="whatsapp" type="tel" className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("email")}
          </span>
          <input name="email" type="email" className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal" />
        </label>
      </div>

      <div className="mt-2 border-t border-line pt-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("emergencyContact")}
        </span>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <input name="emergencyName" placeholder={t("emergencyName") as string} className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal" />
          <input name="emergencyRelation" placeholder={t("emergencyRelation") as string} className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal" />
          <input name="emergencyPhone" type="tel" placeholder={t("emergencyPhone") as string} className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal" />
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("healthNote")}
        </span>
        <textarea name="healthNote" rows={3} placeholder={t("healthNotePlaceholder") as string} className="resize-none border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal" />
        <span className="text-xs text-fg-faint">{t("healthNotePrivate")}</span>
      </label>

      {entryDates.length > 1 && (
        <div className="border-t border-line pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            {t("turnDate")}
          </span>
          <div className="mt-4 flex flex-col gap-3">
            {entryDates.map((date) => (
              <label key={date} className="flex items-center gap-3 border border-line-strong px-4 py-3">
                <input
                  type="radio"
                  name="turnDate"
                  checked={turnDate === date}
                  onChange={() => setTurnDate(date)}
                  className="accent-signal"
                />
                <span className="text-sm text-fg">{date}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {fieldError && <p className="text-sm text-signal">{fieldError}</p>}
      {status === "error" && <p className="text-sm text-signal">{t("errorBody")}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal disabled:opacity-40"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
