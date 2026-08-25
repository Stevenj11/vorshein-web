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
