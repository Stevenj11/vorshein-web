/**
 * All schedule/price/date data now lives on the active Generation
 * (src/lib/generation.ts), editable from the Command Center. This file only
 * keeps the date formatter shared by everything that displays those dates.
 */
export function formatEnrollmentDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-BO" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

/** Weekday + day + month, no year and no ISO — for applicant-facing dates
 * (e.g. "sábado 12 de septiembre"), so people never have to parse a
 * timestamp themselves. */
export function formatWeekdayDate(iso: string, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale === "es" ? "es-BO" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso}T12:00:00`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Weekday name only, decoupled from any specific calendar date — for
 * describing a recurring weekly turno (e.g. "Sábado 14:30–16:00") rather
 * than a one-off dated event. 2026-01-03/04 are a known Saturday/Sunday. */
export function weekdayName(day: "saturday" | "sunday", locale: string): string {
  const ref = day === "saturday" ? "2026-01-03" : "2026-01-04";
  const formatted = new Intl.DateTimeFormat(locale === "es" ? "es-BO" : "en-US", {
    weekday: "long",
  }).format(new Date(`${ref}T12:00:00`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
