import { buildWhatsAppLink } from "../whatsapp";
import { formatWeekdayDate } from "../enrollment";
import { applicantFacingCode } from "./format";
import { Application } from "./types";

/** Spec section 25 — prefilled WhatsApp confirmation message. */
export function buildConfirmMessage(
  app: Application,
  locale: string,
  secondDateISO?: string | null,
  secondTimeSlot?: string | null,
): string {
  const isEs = locale !== "en";
  const lines = [
    isEs ? "Quiero confirmar mi cupo en VORSHEIN GEN 001." : "I want to confirm my spot in VORSHEIN GEN 001.",
    `${isEs ? "Código" : "Code"}: ${applicantFacingCode(app.id)}`,
    `${isEs ? "Nombre" : "Name"}: ${app.firstName} ${app.lastName}`,
    `${isEs ? "Nivel preliminar" : "Preliminary level"}: ${app.preliminaryLevel}`,
    `${isEs ? "Clase" : "Class"}: ${formatWeekdayDate(app.turnDateISO, locale)} · ${app.turnTimeSlot}`,
  ];
  if (secondDateISO && secondTimeSlot) {
    lines.push(
      `${isEs ? "También asiste" : "Also attend"}: ${formatWeekdayDate(secondDateISO, locale)} · ${secondTimeSlot}`,
    );
  }
  return lines.join("\n");
}

export function buildConfirmLink(
  app: Application,
  locale: string,
  targetNumber: string,
  secondDateISO?: string | null,
  secondTimeSlot?: string | null,
): string {
  return buildWhatsAppLink(buildConfirmMessage(app, locale, secondDateISO, secondTimeSlot), targetNumber);
}
