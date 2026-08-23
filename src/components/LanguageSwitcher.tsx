"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em]">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`transition-colors ${
              locale === loc ? "text-signal" : "text-fg-faint hover:text-fg"
            }`}
          >
            {loc}
          </button>
          {i < routing.locales.length - 1 && (
            <span className="text-fg-faint">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
