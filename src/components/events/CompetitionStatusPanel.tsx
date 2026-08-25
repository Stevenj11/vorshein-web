import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

/**
 * Competition eligibility is only ever granted presencially, on TACTICAL
 * CERTIFIED (spec sections 10, 48) — never by the online assessment. With
 * no member portal in GEN 001 (spec section 39), this panel is purely
 * informational rather than "your status."
 */
export async function CompetitionStatusPanel({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "competition" });

  return (
    <div className="border border-line">
      <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center md:p-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            {t("label")}
          </span>
          <p className="mt-2 font-mono text-2xl uppercase tracking-[0.1em] text-fg">
            {t("requirement")}
          </p>
          <p className="mt-2 max-w-md text-sm text-fg-muted">{t("explanation")}</p>
        </div>
        <Button href="/assessment" variant="ghost">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
