"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { ConciergeAction } from "@/app/api/concierge/route";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

type Message = {
  role: "user" | "ai";
  text: string;
  action?: ConciergeAction;
};

const ACTION_HREF: Record<NonNullable<ConciergeAction>, string> = {
  start_assessment: "/assessment",
  check_eligibility: "/events",
};

export function Concierge() {
  const t = useTranslations("concierge");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: t("greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const actionLabel = (action: NonNullable<ConciergeAction>) =>
    action === "check_eligibility"
      ? t("actionCheckEligibility")
      : t("actionStartAssessment");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, locale }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply, action: data.action },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: t("errorReply") }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex h-[70svh] w-[calc(100vw-2rem)] max-w-[340px] flex-col border border-line-strong bg-panel shadow-2xl sm:h-[480px]">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <Logo size={18} />
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em]">
                {t("title")}
              </p>
              <p className="text-[11px] text-fg-faint">{t("subtitle")}</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : ""}>
                <p
                  className={`inline-block max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-fg text-void"
                      : "border border-line text-fg-muted"
                  }`}
                >
                  {msg.text}
                </p>
                {msg.action && (
                  <div className="mt-2">
                    <Link
                      href={ACTION_HREF[msg.action]}
                      className="inline-flex items-center gap-2 border border-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal transition-colors hover:bg-signal-dim"
                    >
                      {actionLabel(msg.action)}
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-xs text-fg-faint">{t("typing")}</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-line px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
            />
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal disabled:opacity-40"
              disabled={loading || !input.trim()}
            >
              {t("send")}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("closeLabel") : t("openLabel")}
        className="flex h-12 w-12 items-center justify-center border border-line-strong bg-void text-fg shadow-xl transition-colors hover:border-signal hover:text-signal sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3.5"
      >
        <Logo size={16} />
        <span className="hidden font-mono text-xs uppercase tracking-[0.2em] sm:inline">
          {open ? t("closeLabel") : t("openLabel")}
        </span>
      </button>
    </div>
  );
}
