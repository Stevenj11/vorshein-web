import { getTranslations } from "next-intl/server";
import {
  ENROLLMENT,
  formatEnrollmentDate,
  SCHEDULE_TIME,
} from "@/lib/enrollment";
import { ProgramSlug } from "@/lib/programs";

export async function EnrollmentBanner({
  locale,
  slug,
  level,
  programName,
}: {
  locale: string;
  slug?: ProgramSlug;
  level?: string;
  programName?: string;
}) {
  const t = await getTranslations({ locale, namespace: "enrollment" });

  const deadline = formatEnrollmentDate(ENROLLMENT.deadlineISO, locale);
  const start = formatEnrollmentDate(ENROLLMENT.startISO, locale);
  const time = slug ? SCHEDULE_TIME[slug] : null;

  // A plain <a> (not next-intl's Link) — its locale-prefixing drops query
  // strings on string hrefs, so we prefix the locale ourselves here.
  const reserveHref = level
    ? `/${locale}/reserve?level=${encodeURIComponent(level)}&path=${encodeURIComponent(programName ?? "")}`
    : `/${locale}/reserve`;

  return (
    <div className="border border-signal/40 bg-signal-dim">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-signal" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {t("statusOpen")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {t("daysLabel")}
            </span>
            <p className="mt-1 text-sm font-medium text-fg">{t("days")}</p>
          </div>
          {time && (
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("timeLabel")}
              </span>
              <p className="mt-1 text-sm font-medium text-fg">{time}</p>
            </div>
          )}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {t("priceLabel")}
            </span>
            <p className="mt-1 text-sm font-medium text-fg">
              {t("priceValue", {
                currency: ENROLLMENT.currency,
                price: ENROLLMENT.price,
              })}
            </p>
            <p className="text-xs text-fg-faint">
              {t("priceDetail", {
                count: ENROLLMENT.classCount,
                hours: ENROLLMENT.hoursPerClass,
              })}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {t("deadlineLabel")}
            </span>
            <p className="mt-1 text-sm font-medium text-fg">{deadline}</p>
            <p className="text-xs text-fg-faint">
              {t("startLabel")}: {start}
            </p>
          </div>
        </div>

        <a
          href={reserveHref}
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal"
        >
          {t("cta")}
        </a>
      </div>
    </div>
  );
}
