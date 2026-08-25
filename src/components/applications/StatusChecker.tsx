"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApplicationStatus } from "@/lib/applications/types";
import { STATUS_DISPLAY, StatusColor } from "@/lib/applications/statusDisplay";
import { formatWeekdayDate } from "@/lib/enrollment";

type LookupResult = {
  id: string;
  firstName: string;
  lastName: string;
  preliminaryLevel: string;
  status: ApplicationStatus;
  turnDateISO: string;
  turnTimeSlot: string;
  whatsappNumber: string;
};

const DOT_CLASS: Record<StatusColor, string> = {
  green: "bg-emerald-400",
  red: "bg-red-500",
  yellow: "bg-amber-400",
  gray: "bg-fg-faint",
};

export function StatusChecker() {
  const t = useTranslations("statusCheck");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("id") ?? "");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const lookup = useCallback(async (id: string) => {
    if (!id) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(id)}`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      setResult(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, []);

  // Auto-search when arriving via a link that already carries the ID
  // (e.g. "Check my status later" on the Entry Pass), so nobody has to
  // retype what they already gave us minutes earlier.
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    // One-shot mount lookup triggered by a URL param, not a derived-state sync loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (idFromUrl) lookup(idFromUrl.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    lookup(query.trim().toUpperCase());
  }

  const display = result ? STATUS_DISPLAY[result.status] : null;

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 border border-line-strong bg-transparent px-4 py-3 text-center font-mono uppercase text-fg outline-none focus:border-signal"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 bg-fg px-5 py-3 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors hover:bg-signal disabled:opacity-40"
        >
          {status === "loading" ? t("checking") : t("cta")}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-4 text-center text-sm text-signal">{t("notFound")}</p>
      )}

      {result && display && (
        <div className="mt-6 border border-line-strong bg-panel p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASS[display.color]}`} />
            <span className="font-mono text-sm uppercase tracking-[0.15em] text-fg">
              {t(display.labelKey)}
            </span>
          </div>
          <p className="mt-3 text-sm text-fg-muted">{t(display.detailKey)}</p>

          <div className="mt-6 divide-y divide-line border-t border-line text-left">
            <div className="flex items-center justify-between py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("name")}
              </span>
              <span className="text-sm text-fg">{result.firstName} {result.lastName}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("level")}
              </span>
              <span className="text-sm text-fg">{result.preliminaryLevel}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("turn")}
              </span>
              <span className="text-sm text-fg">
                {formatWeekdayDate(result.turnDateISO, locale)} · {result.turnTimeSlot}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-6">
              <p className="text-xs text-fg-faint">
                {t(display.color !== "green" ? "waitingNote" : "admittedContactNote")}
              </p>
              <a
                href={`https://wa.me/${result.whatsappNumber}?text=${encodeURIComponent(`Hola, quiero consultar el estado de mi postulación ${result.id}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-signal hover:text-signal"
              >
                {t("contactCta")}
              </a>
          </div>
        </div>
      )}
    </div>
  );
}
