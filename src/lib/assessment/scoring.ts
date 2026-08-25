import { PreliminaryLevel } from "./gates";

/**
 * Internal/official vocabulary used across programs, reservations, and
 * competition eligibility — distinct from PreliminaryLevel (gates.ts),
 * which is only ever the assessment's preliminary online output. The
 * official Level is set presencially (Entry Assessment), never by the web.
 */
export type Level = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export function preliminaryToLevel(level: PreliminaryLevel): Level | null {
  if (level === "FOUNDATION") return "BASIC";
  if (level === "PERFORMANCE") return "INTERMEDIATE";
  if (level === "TACTICAL") return "ADVANCED";
  return null;
}
