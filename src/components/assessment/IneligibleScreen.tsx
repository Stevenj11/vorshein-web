"use client";

import { useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Variant = "ineligible-age" | "ineligible-sex" | "ineligible-floating";
type Eligibility = { minAge: number; maxAge: number; sex: "male" | "female" | "any" };

export function IneligibleScreen({
  variant,
  onRetake,
  eligibility,
  generationName,
  generationLocation,
}: {
  variant: Variant;
  onRetake: () => void;
  eligibility: Eligibility;
  generationName: string;
  generationLocation: string;
}) {
  const t = useTranslations("assessment.ineligible");

  const isFloating = variant === "ineligible-floating";
  const heading = isFloating ? t("floatingHeading") : t("cohortHeading");
  const body = isFloating ? t("floatingBody") : t("cohortBody");

  const waLink = buildWhatsAppLink(t("futureOpeningsMessage"));

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
        {isFloating ? t("floatingLabel") : t("cohortLabel")}
      </span>
      <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{heading}</h2>
      <p className="mt-4 text-fg-muted">{body}</p>

      {!isFloating && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-fg-faint">
          {generationLocation.split(",")[0]} · {generationName} ·{" "}
          {t("cohortRange", {
            min: eligibility.minAge,
            max: eligibility.maxAge,
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
