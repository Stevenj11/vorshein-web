/** Spanish display labels for Command Center enums — the admin tool is
 * Spanish-only (the person running it doesn't read English), so these
 * translate the underlying English status values used elsewhere in the
 * codebase (CSV exports, API payloads) without changing those values. */

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  RESERVED: "Reservada",
  CONFIRMED: "Confirmada",
  CHECKED_IN: "Check-in Hecho",
  SIGNED: "Firmada",
  PAID: "Pagada",
  ASSESSED: "Evaluada",
  MANUAL_REVIEW: "Revisión Manual",
  ADMITTED: "Admitida",
  NOT_YET_ELIGIBLE: "Aún No Elegible",
  NO_SHOW: "No Se Presentó",
  WAITLIST: "Lista de Espera",
};

export const MEMBER_STATUS_LABEL: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  refund_due: "Reembolso Pendiente",
  refunded: "Reembolsado",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  qr: "QR",
  cash: "Efectivo",
};

export const ATTENDANCE_MARK_LABEL: Record<string, string> = {
  present: "Presente",
  late: "Tarde",
  absent: "Ausente",
};

export const GENERATION_STATUS_LABEL: Record<string, string> = {
  COMING_SOON: "Próximamente",
  APPLICATIONS_OPEN: "Postulaciones Abiertas",
  APPLICATIONS_CLOSED: "Postulaciones Cerradas",
  ENTRY_ASSESSMENT: "Evaluación de Ingreso",
  CLASSIFICATION: "Clasificación",
  TRAINING_ACTIVE: "Entrenamiento Activo",
  CLEARANCE: "Clearance",
  GEN_COMPLETE: "Generación Completa",
};
