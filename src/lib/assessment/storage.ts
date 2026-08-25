import { useSyncExternalStore } from "react";
import { ClassificationInput, PreliminaryLevel } from "./gates";

const KEY = "vorshein.assessment.result";

export type StoredAssessmentResult = {
  preliminaryLevel: PreliminaryLevel;
  needsManualReview: boolean;
  age: number;
  sex: "male" | "female";
  /** Raw indicator answers, kept so the Application step can send them to
   * the server for re-validation (spec: backend must validate, not just
   * trust the frontend's computed level). */
  answers: ClassificationInput;
  /** Collected up front (before the gate/quiz questions) so Apply never
   * has to ask for them again — the applicant only picks a turn there. */
  firstName: string;
  lastName: string;
  whatsapp: string;
};

export function saveAssessmentResult(result: StoredAssessmentResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(result));
}

export function loadAssessmentResult(): StoredAssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAssessmentResult;
  } catch {
    return null;
  }
}

export function clearAssessmentResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return null;
}

// getSnapshot must return a referentially stable value when the underlying
// data hasn't changed, or useSyncExternalStore re-renders forever. Cache the
// last parsed result against the raw string it came from.
let cachedRaw: string | null | undefined;
let cachedResult: StoredAssessmentResult | null = null;

function getClientSnapshot(): StoredAssessmentResult | null {
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedResult;
  cachedRaw = raw;
  cachedResult = raw
    ? ((): StoredAssessmentResult | null => {
        try {
          return JSON.parse(raw) as StoredAssessmentResult;
        } catch {
          return null;
        }
      })()
    : null;
  return cachedResult;
}

/**
 * Reads the stored assessment result reactively. Uses useSyncExternalStore
 * (not useState+useEffect) so the server snapshot (null) and the client
 * snapshot (localStorage) never fight each other during hydration.
 */
export function useAssessmentResult(): StoredAssessmentResult | null {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
