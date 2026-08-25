"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Application } from "@/lib/applications/types";
import { buildConfirmLink } from "@/lib/applications/whatsapp";

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

export function EntryPassCard({ application }: { application: Application }) {
  const t = useTranslations("apply.entryPass");
  const locale = useLocale();
  const remainingMs = useCountdown(application.whatsappConfirmDeadlineISO);
  const expired = remainingMs <= 0;
  const hours = Math.max(0, Math.floor(remainingMs / 3_600_000));
  const minutes = Math.max(0, Math.floor((remainingMs % 3_600_000) / 60_000));

  const waLink = buildConfirmLink(application, locale);

  const rows: [string, string][] = [
    [t("applicationId"), application.id],
    [t("name"), `${application.firstName} ${application.lastName}`],
    [t("division"), `DIVISION ${application.division}`],
    [t("preliminaryLevel"), application.preliminaryLevel],
    [t("date"), application.turnDateISO],
    [t("turn"), application.turnTimeSlot],
    [t("checkIn"), t("checkInDetail")],
    [t("price"), "Bs 250"],
    [t("payment"), t("paymentDetail")],
    [t("status"), application.status],
  ];

  return (
    <div className="mx-auto w-full max-w-lg border border-line-strong bg-panel">
      <div className="border-b border-line px-6 py-5 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {t("label")}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{t("heading")}</h2>
      </div>

      <div className="divide-y divide-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-6 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-faint">
              {label}
            </span>
            <span className="text-sm font-medium text-fg">{value}</span>
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
      </div>
    </div>
  );
}
