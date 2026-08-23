"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { buildReservationMessage, buildWhatsAppLink } from "@/lib/whatsapp";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({
  level,
  levelDisplay,
  recommendedPath,
}: {
  level?: string;
  levelDisplay?: string;
  recommendedPath?: string;
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const notes = String(form.get("notes") ?? "").trim();

    if (!name) {
      setFieldError(t("nameRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(t("emailRequired"));
      return;
    }

    // Built and opened synchronously, inside the click gesture, so browsers
    // don't treat it as a blocked popup — the reservation continues (and
    // payment gets coordinated) directly in that WhatsApp chat.
    const waLink = buildWhatsAppLink(
      buildReservationMessage({
        name,
        phone: phone || undefined,
        email,
        levelDisplay,
        recommendedPath,
        notes: notes || undefined,
        locale,
      }),
    );
    setWhatsappLink(waLink);
    window.open(waLink, "_blank");

    setStatus("submitting");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          notes,
          level,
          recommendedPath,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-signal/40 bg-signal-dim px-8 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
          {t("successTitle")}
        </p>
        <p className="mt-3 text-fg-muted">{t("successBody")}</p>
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal"
          >
            {t("whatsappCta")}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {(level || recommendedPath) && (
        <div className="flex flex-wrap gap-px overflow-hidden border border-line bg-line">
          {level && (
            <div className="bg-panel px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                {t("levelLabel")}
              </span>
              <p className="text-sm font-medium text-fg">
                {levelDisplay ?? level}
              </p>
            </div>
          )}
          {recommendedPath && (
            <div className="bg-panel px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                {t("pathLabel")}
              </span>
              <p className="text-sm font-medium text-fg">{recommendedPath}</p>
            </div>
          )}
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("nameLabel")}
        </span>
        <input
          name="name"
          type="text"
          className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("emailLabel")}
        </span>
        <input
          name="email"
          type="email"
          className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("phoneLabel")}
        </span>
        <input
          name="phone"
          type="tel"
          className="border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-signal"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
          {t("notesLabel")}
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder={t("notesPlaceholder")}
          className="resize-none border border-line-strong bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal"
        />
      </label>

      {fieldError && <p className="text-sm text-signal">{fieldError}</p>}
      {status === "error" && (
        <p className="text-sm text-signal">{t("errorBody")}</p>
      )}

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
