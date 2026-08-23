// wa.me format: digits only, country code first, no "+" or spaces.
export const WHATSAPP_NUMBER = "59175277804";

export function buildReservationMessage(params: {
  name: string;
  phone?: string;
  email?: string;
  levelDisplay?: string;
  recommendedPath?: string;
  notes?: string;
  locale: string;
}): string {
  const { name, phone, email, levelDisplay, recommendedPath, notes, locale } =
    params;
  const isEs = locale !== "en";

  const lines = [
    isEs
      ? "Hola, quiero reservar mi cupo en VORSHEIN."
      : "Hi, I'd like to reserve my spot at VORSHEIN.",
    `${isEs ? "Nombre" : "Name"}: ${name}`,
  ];
  if (phone) lines.push(`${isEs ? "Teléfono" : "Phone"}: ${phone}`);
  if (levelDisplay) lines.push(`${isEs ? "Nivel" : "Level"}: ${levelDisplay}`);
  if (recommendedPath)
    lines.push(`${isEs ? "Programa" : "Program"}: ${recommendedPath}`);
  if (email) lines.push(`Email: ${email}`);
  if (notes) lines.push(`${isEs ? "Notas" : "Notes"}: ${notes}`);

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
