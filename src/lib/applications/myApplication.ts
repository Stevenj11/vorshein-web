/**
 * Remembers the applicant's own Application ID locally so /estado can find
 * it automatically on return visits, without asking them to type their
 * code again on the same device/browser.
 */
const KEY = "vorshein.myApplicationId";

export function saveMyApplicationId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
}

export function loadMyApplicationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}
