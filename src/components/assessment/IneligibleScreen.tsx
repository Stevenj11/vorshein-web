"use client";

import { useLocale, useTranslations } from "next-intl";
import { GEN_001_DEFAULT } from "@/lib/generation-defaults";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Variant = "ineligible-age" | "ineligible-sex" | "ineligible-floating";

export function IneligibleScreen({
  variant,
  onRetake,
}: {
  variant: Variant;
  onRetake: () => void;
}) {
  const t = useTranslations("assessment.ineligible");
  const locale = useLocale();

  const isFloating = variant === "ineligible-floating";
  const heading = isFloating ? t("floatingHeading") : t("cohortHeading");
  const body = isFloating ? t("floatingBody") : t("cohortBody");

  const waLink = buildWhatsAppLink(
    locale === "es"
      ? "Hola, quiero dejar mi interés para futuras convocatorias de VORSHEIN."
      : "Hi, I'd like to register my interest for future VORSHEIN cohorts.",
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
        {isFloating ? t("floatingLabel") : t("cohortLabel")}
      </span>
      <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{heading}</h2>
      <p className="mt-4 text-fg-muted">{body}</p>

      {!isFloating && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-fg-faint">
          {GEN_001_DEFAULT.location.split(",")[0]} · {GEN_001_DEFAULT.name} ·{" "}
          {t("cohortRange", {
            min: GEN_001_DEFAULT.eligibility.minAge,
            max: GEN_001_DEFAULT.eligibility.maxAge,
          })}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-line-strong px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-fg transition-colors hover:border-signal hover:text-signal"
        >
          {t("futureOpenings")}
        </a>
        <button
          onClick={onRetake}
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
        >
          {t("retake")}
        </button>
      </div>
    </div>
  );
}
