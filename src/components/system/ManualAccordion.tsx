"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ManualIcon } from "@/components/icons/ManualIcon";
import { MODULE_NUMBERS } from "@/lib/manual";

export function ManualAccordion() {
  const t = useTranslations("manual");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {MODULE_NUMBERS.map((n, i) => {
        const open = openIndex === i;
        return (
          <div key={n} className="border-b border-line">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center gap-6 py-6 text-left transition-colors hover:text-signal"
              aria-expanded={open}
            >
              <span className="font-mono text-sm text-fg-faint">{n}</span>
              <ManualIcon
                n={n}
                className={`h-6 w-6 shrink-0 transition-colors ${
                  open ? "text-signal" : "text-fg-muted"
                }`}
              />
              <span className="flex-1 text-xl font-semibold md:text-2xl">
                {t(`${n}.name`)}
              </span>
              <span
                className={`font-mono text-lg transition-transform duration-200 ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`grid overflow-hidden transition-all duration-300 ${
                open ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <p className="max-w-2xl pl-[52px] text-fg-muted">
                  {t(`${n}.description`)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
