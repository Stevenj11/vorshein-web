import { Application } from "../applications/types";
import { getActiveGeneration } from "../generation";
import { formatWeekdayDate } from "../enrollment";
import { sendEmail } from "./send";

const ADMIN_COPY = "vorsheinoficial@gmail.com";

/** Section 76 — sent immediately on application submission. */
export async function sendApplicationReceivedEmail(app: Application): Promise<void> {
  const text = [
    "APPLICATION RECEIVED",
    "",
    `Application ID: ${app.id}`,
    `Preliminary level: ${app.preliminaryLevel}`,
    `Fecha: ${formatWeekdayDate(app.turnDateISO, "es")}`,
    `Turno: ${app.turnTimeSlot}`,
    "",
    "Tu Pase de Evaluación (Entry Pass) ya está generado. El pago se realiza presencialmente el día de tu evaluación.",
    `Qué llevar: traje de baño, gorro, toalla, y confirmar tu cupo por WhatsApp dentro de las próximas 12 horas.`,
  ].join("\n");

  if (app.email) {
    await sendEmail({ to: app.email, subject: `VORSHEIN — Application Received (${app.id})`, text });
  }
  await sendEmail({ to: ADMIN_COPY, subject: `Nueva postulación — ${app.id}`, text });
}

/** Section 77 — sent when admin marks CONFIRMED (WhatsApp released). */
export async function sendEntryConfirmedEmail(app: Application): Promise<void> {
  const generation = await getActiveGeneration();
  const text = [
    "ENTRY CONFIRMED",
    "",
    `Application ID: ${app.id}`,
    `Fecha: ${formatWeekdayDate(app.turnDateISO, "es")}`,
    `Check-in: 30 minutos antes de tu turno (${app.turnTimeSlot})`,
    `Ubicación: ${generation.location}`,
    "Qué llevar: traje de baño, gorro, toalla, documento de identidad.",
  ].join("\n");
  if (app.email) {
    await sendEmail({ to: app.email, subject: `VORSHEIN — Entry Confirmed (${app.id})`, text });
  }
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

  const generation = await getActiveGeneration();
  const lines = ["YOU'RE IN.", "", `VRSN ID: ${memberId}`, `Nivel oficial: ${officialLevel.toUpperCase()}`, `Generation: ${generation.name}`];

  if (wasLower) {
    lines.push(
      "",
      "Tu evaluación presencial determinó que este es actualmente el nivel adecuado para continuar tu progresión.",
    );
  }

  lines.push("", `Inicio de entrenamiento: ${formatWeekdayDate(generation.dates.trainingBeginsISO, "es")}`);

  if (app.email) {
    await sendEmail({ to: app.email, subject: `VORSHEIN — You're In (${memberId})`, text: lines.join("\n") });
  }
}

/** Section 80 — sent when the applicant doesn't reach Foundation's minimum requirement. */
export async function sendNotYetEligibleEmail(app: Application): Promise<void> {
  const generation = await getActiveGeneration();
  const text = [
    "NOT YET ELIGIBLE",
    "",
    `Application ID: ${app.id}`,
    "Tu evaluación presencial determinó que todavía necesitas desarrollar las bases mínimas antes de comenzar el ciclo de entrenamiento.",
    `Refund due: Bs ${generation.trainingFee} (el monto de Bs ${generation.assessmentFee} corresponde a la evaluación ya realizada).`,
  ].join("\n");
  if (app.email) {
    await sendEmail({ to: app.email, subject: `VORSHEIN — Application Update (${app.id})`, text });
  }
}
