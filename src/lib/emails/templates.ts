import { Application } from "../applications/types";
import { GEN_001_DEFAULT } from "../generation";
import { sendEmail } from "./send";

const ADMIN_COPY = "vorsheinoficial@gmail.com";

/** Section 76 — sent immediately on application submission. */
export async function sendApplicationReceivedEmail(app: Application): Promise<void> {
  const text = [
    "APPLICATION RECEIVED",
    "",
    `Application ID: ${app.id}`,
    `Preliminary level: ${app.preliminaryLevel}`,
    `Fecha: ${app.turnDateISO}`,
    `Turno: ${app.turnTimeSlot}`,
    "",
    "Tu Entry Pass ya está generado. El pago se realiza presencialmente el día de tu evaluación.",
    `Qué llevar: traje de baño, gorro, toalla, y confirmar tu cupo por WhatsApp dentro de las próximas 12 horas.`,
  ].join("\n");

  await sendEmail({ to: app.email, subject: `VORSHEIN — Application Received (${app.id})`, text });
  await sendEmail({ to: ADMIN_COPY, subject: `Nueva postulación — ${app.id}`, text });
}

/** Section 77 — sent when admin marks CONFIRMED (WhatsApp released). */
export async function sendEntryConfirmedEmail(app: Application): Promise<void> {
  const text = [
    "ENTRY CONFIRMED",
    "",
    `Application ID: ${app.id}`,
    `Fecha: ${app.turnDateISO}`,
    `Check-in: 30 minutos antes de tu turno (${app.turnTimeSlot})`,
    `Ubicación: ${GEN_001_DEFAULT.location}`,
    "Qué llevar: traje de baño, gorro, toalla, documento de identidad.",
  ].join("\n");
  await sendEmail({ to: app.email, subject: `VORSHEIN — Entry Confirmed (${app.id})`, text });
}

/** Section 78/79 — sent on admission. Handles the "lower than preliminary" wording explicitly. */
export async function sendAdmissionEmail(
  app: Application,
  memberId: string,
  officialLevel: "foundation" | "performance" | "tactical",
): Promise<void> {
  const wasLower =
    (app.preliminaryLevel === "TACTICAL" && officialLevel !== "tactical") ||
    (app.preliminaryLevel === "PERFORMANCE" && officialLevel === "foundation");

  const lines = ["YOU'RE IN.", "", `VRSN ID: ${memberId}`, `Nivel oficial: ${officialLevel.toUpperCase()}`, `Generation: ${GEN_001_DEFAULT.name}`];

  if (wasLower) {
    lines.push(
      "",
      "Tu evaluación presencial determinó que este es actualmente el nivel adecuado para continuar tu progresión.",
    );
  }

  lines.push("", `Inicio de entrenamiento: ${GEN_001_DEFAULT.dates.trainingBeginsISO}`);

  await sendEmail({ to: app.email, subject: `VORSHEIN — You're In (${memberId})`, text: lines.join("\n") });
}

/** Section 80 — sent when the applicant doesn't reach Foundation's minimum requirement. */
export async function sendNotYetEligibleEmail(app: Application): Promise<void> {
  const text = [
    "NOT YET ELIGIBLE",
    "",
    `Application ID: ${app.id}`,
    "Tu evaluación presencial determinó que todavía necesitas desarrollar las bases mínimas antes de comenzar el ciclo de entrenamiento.",
    `Refund due: Bs ${GEN_001_DEFAULT.trainingFee} (el monto de Bs ${GEN_001_DEFAULT.assessmentFee} corresponde a la evaluación ya realizada).`,
  ].join("\n");
  await sendEmail({ to: app.email, subject: `VORSHEIN — Application Update (${app.id})`, text });
}
