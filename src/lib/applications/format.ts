/**
 * Client-safe formatting helpers for Application IDs — no server-only
 * imports, so components that render in the browser can use these too.
 */

/**
 * The short code shown to applicants — just the 4 digits, no "VRSN-A"
 * prefix. The full ID stays canonical everywhere internally (Command
 * Center, storage, search); this is display-only, and the public status
 * lookup already accepts this short form.
 */
export function applicantFacingCode(id: string): string {
  return id.replace(/^VRSN-A/, "");
}
