import { buildWhatsAppLink } from "../whatsapp";
import { formatWeekdayDate } from "../enrollment";
import { Application } from "./types";

/** Spec section 25 — prefilled WhatsApp confirmation message. */
export function buildConfirmMessage(app: Application, locale: string): string {
  const isEs = locale !== "en";
  const lines = [
    isEs ? "Quiero confirmar mi cupo en VORSHEIN GEN 001." : "I want to confirm my spot in VORSHEIN GEN 001.",
    `${isEs ? "Application ID" : "Application ID"}: ${app.id}`,
    `${isEs ? "Nombre" : "Name"}: ${app.firstName} ${app.lastName}`,
    `${isEs ? "Nivel preliminar" : "Preliminary level"}: ${app.preliminaryLevel}`,
    `${isEs ? "Turno" : "Turn"}: ${formatWeekdayDate(app.turnDateISO, locale)} · ${app.turnTimeSlot}`,
  ];
  return lines.join("\n");
}

export function buildConfirmLink(app: Application, locale: string, targetNumber: string): string {
  return buildWhatsAppLink(buildConfirmMessage(app, locale), targetNumber);
}
