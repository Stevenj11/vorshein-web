"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Application } from "@/lib/applications/types";
import { applicantFacingCode } from "@/lib/applications/format";
import { buildConfirmLink } from "@/lib/applications/whatsapp";
import { formatWeekdayDate } from "@/lib/enrollment";

function CopyCodeButton({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be unavailable (older browsers, non-HTTPS) — the
      // code is already shown big on screen, so failing silently is fine.
    }
  }

  return (
    <button
      onClick={copy}
      className="mt-3 inline-flex items-center gap-2 border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-muted transition-colors hover:border-signal hover:text-signal"
    >
      {copied ? "✓" : "⧉"} {label}
    </button>
  );
}

function useCountdown(deadlineISO: string) {
  const [remaining, setRemaining] = useState(() => Date.parse(deadlineISO) - Date.now());
  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Date.parse(deadlineISO) - Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, [deadlineISO]);
  return remaining;
}

const STATUS_KEY: Record<string, string> = {
  RESERVED: "statusReserved",
  CONFIRMED: "statusConfirmed",
  WAITLIST: "statusWaitlist",
};

export function EntryPassCard({
  application,
  price,
  currency,
  whatsappNumber,
}: {
  application: Application;
  price: number;
  currency: string;
  whatsappNumber: string;
}) {
  const t = useTranslations("apply.entryPass");
  const locale = useLocale();
  const remainingMs = useCountdown(application.whatsappConfirmDeadlineISO);
  const expired = remainingMs <= 0;
  const hours = Math.max(0, Math.floor(remainingMs / 3_600_000));
  const minutes = Math.max(0, Math.floor((remainingMs % 3_600_000) / 60_000));

  const waLink = buildConfirmLink(application, locale, whatsappNumber);
  const statusLabel = t(STATUS_KEY[application.status] ?? "statusReserved");

  const rows: [string, string][] = [
    [t("name"), `${application.firstName} ${application.lastName}`],
    [t("division"), `DIVISION ${application.division}`],
    [t("preliminaryLevel"), application.preliminaryLevel],
    [t("date"), formatWeekdayDate(application.turnDateISO, locale)],
    [t("turn"), application.turnTimeSlot],
    [t("checkIn"), t("checkInDetail")],
    [t("price"), `${currency} ${price}`],
    [t("payment"), t("paymentDetail")],
    [t("status"), statusLabel],
  ];

  return (
    <div className="mx-auto w-full max-w-lg border border-line-strong bg-panel">
      <div className="border-b border-line px-6 py-5 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {t("label")}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{t("heading")}</h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
          {t("subLabel")}
        </p>
        <p className="mt-3 text-sm text-fg-muted">{t("tagline")}</p>

        <div className="mt-5 flex flex-col items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
            {t("applicationId")}
          </span>
          <span className="mt-1 font-mono text-4xl font-bold tracking-[0.15em] text-signal">
            {applicantFacingCode(application.id)}
          </span>
          <CopyCodeButton code={applicantFacingCode(application.id)} label={t("copyCode")} />
        </div>
      </div>

      <div className="divide-y divide-line">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-faint">
              {label}
            </span>
            <span className="text-sm font-medium text-fg sm:text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-6 py-6 text-center">
        {!expired ? (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
              {t("confirmWithin")}
            </p>
            <p className="mt-2 font-mono text-3xl tabular-nums text-signal">
              {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m
            </p>
          </>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            {t("deadlinePassed")}
          </p>
        )}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal"
        >
          {t("confirmCta")}
        </a>
        <p className="mt-4 text-xs text-fg-muted">{t("pendingNote")}</p>
        <p className="mt-2 text-xs text-fg-faint">{t("requirementsNote")}</p>
        <a
          href={`/${locale}/estado?id=${encodeURIComponent(application.id)}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-line-strong px-7 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-signal hover:text-signal"
        >
          {t("checkStatusLater")} →
        </a>
      </div>
    </div>
  );
}
