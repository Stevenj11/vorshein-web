/**
 * Client-safe formatting helpers for Application IDs — no server-only
 * imports, so components that render in the browser can use these too.
 */

/**
 * Accepts whatever an applicant is likely to type from memory — "4",
 * "0004", "A0004", "VS0004", "VRSN-A0004" — and resolves it to the
 * canonical ID. Application IDs are always VRSN-A#### with no other
 * letters, so reducing to the digits and re-padding is always
 * unambiguous.
 */
export function normalizeApplicationId(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return input.toUpperCase();
  return `VRSN-A${String(parseInt(digits, 10)).padStart(4, "0")}`;
}

/**
 * The short code shown to applicants — "VS0007" instead of "VRSN-A0007".
 * Bare digits alone tested as too generic/context-less, so this keeps a
 * short brand prefix. The full ID stays canonical everywhere internally
 * (Command Center, storage, search); this is display-only — the public
 * status lookup strips all non-digits, so "VS0007", "0007", or "7" all
 * still resolve correctly.
 */
export function applicantFacingCode(id: string): string {
  return id.replace(/^VRSN-A/, "VS");
}
