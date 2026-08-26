/**
 * Client-safe formatting helpers for Application IDs — no server-only
 * imports, so components that render in the browser can use these too.
 */

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
