import { ProgramSlug } from "./programs";

/**
 * Real, current enrollment data for the active cohort. This is the one
 * place to edit when the schedule, price, or dates change for the next
 * intake — every page that shows enrollment info reads from here.
 */
export const ENROLLMENT = {
  currency: "Bs.",
  price: 250,
  classCount: 8,
  hoursPerClass: 2,
  deadlineISO: "2026-09-15",
  startISO: "2026-09-19",
} as const;

export const SCHEDULE_TIME: Record<ProgramSlug, string> = {
  foundation: "2:00 pm – 4:00 pm",
  performance: "2:00 pm – 4:00 pm",
  tactical: "4:00 pm – 6:00 pm",
};

export function formatEnrollmentDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-BO" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}
