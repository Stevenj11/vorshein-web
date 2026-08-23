import { useSyncExternalStore } from "react";
import { AssessmentResult } from "./scoring";

const KEY = "vorshein.assessment.result";

export function saveAssessmentResult(result: AssessmentResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(result));
}

export function loadAssessmentResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AssessmentResult;
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
let cachedResult: AssessmentResult | null = null;

function getClientSnapshot(): AssessmentResult | null {
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedResult;
  cachedRaw = raw;
  cachedResult = raw
    ? ((): AssessmentResult | null => {
        try {
          return JSON.parse(raw) as AssessmentResult;
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
export function useAssessmentResult(): AssessmentResult | null {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
