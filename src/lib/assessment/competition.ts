import { Level } from "./scoring";

export type CompetitionStatus = {
  eligible: boolean;
  requiredLevel: Level;
};

/**
 * Minimum level required to request competition participation.
 * Change this single value to retune eligibility for all events —
 * or replace this file's logic with a database lookup per event later.
 */
const MINIMUM_LEVEL: Level = "ADVANCED";

const LEVEL_RANK: Record<Level, number> = {
  BASIC: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export function getCompetitionStatus(level: Level | null): CompetitionStatus {
  const eligible = level !== null && LEVEL_RANK[level] >= LEVEL_RANK[MINIMUM_LEVEL];

  return {
    eligible,
    requiredLevel: MINIMUM_LEVEL,
  };
}
