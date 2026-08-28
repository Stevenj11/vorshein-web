import { getTranslations } from "next-intl/server";
import { getActiveGeneration, turnoTimeRange, turnosForLevel } from "@/lib/generation";
import { formatEnrollmentDate, weekdayName } from "@/lib/enrollment";
import { ProgramSlug } from "@/lib/programs";

export async function EnrollmentBanner({
  locale,
  slug,
}: {
  locale: string;
  slug?: ProgramSlug;
}) {
  const t = await getTranslations({ locale, namespace: "enrollment" });
  const generation = await getActiveGeneration();

  const levelTurnos = slug ? turnosForLevel(generation.turnos, slug) : [];
  const capacity = levelTurnos[0]
    ? { min: levelTurnos[0].minCapacity, max: levelTurnos[0].maxCapacity }
    : null;
  const scheduleTime = levelTurnos
    .map((turno) => `${weekdayName(turno.day, locale)} ${turnoTimeRange(turno)}`)
    .join(" · ");
  const deadline = formatEnrollmentDate(generation.dates.applicationsCloseISO, locale);
  const start = formatEnrollmentDate(generation.dates.trainingBeginsISO, locale);

  return (
    <div className="border border-signal/40 bg-signal-dim">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-signal" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {t("statusOpen")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {t("daysLabel")}
            </span>
            <p className="mt-1 text-sm font-medium text-fg">{t("days")}</p>
          </div>
          {capacity && (
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("timeLabel")}
              </span>
              <p className="mt-1 text-sm font-medium text-fg">{scheduleTime}</p>
            </div>
          )}
          {capacity && (
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                {t("capacityLabel")}
              </span>
              <p className="mt-1 text-sm font-medium text-fg">
                {t("capacityValue", { min: capacity.min, max: capacity.max })}
              </p>
            </div>
          )}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
              {t("priceLabel")}
            </span>
            <p className="mt-1 text-sm font-medium text-fg">
              {t("priceValue", { currency: generation.currency, price: generation.price })}
            </p>
            <p className="text-xs text-fg-faint">
              {t("priceDetail", {
                trainingSessions: generation.cycle.sessions - 1,
                trainingHours: 1.5,
                evalHours: 1,
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
          href={`/${locale}/assessment`}
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-fg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-void transition-colors duration-200 hover:bg-signal"
        >
          {t("cta")}
        </a>
      </div>
    </div>
  );
}
