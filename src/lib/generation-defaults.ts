/**
 * Client-safe types + the GEN 001 default config — no `fs`/`path` imports,
 * so client components can read static values (e.g. the eligibility range
 * for a message) without pulling the server-only file store into the
 * browser bundle. src/lib/generation.ts (server-only) re-exports all of
 * this, plus the persistence functions — import from there in server code.
 */
export type GenerationStatus =
  | "COMING_SOON"
  | "APPLICATIONS_OPEN"
  | "APPLICATIONS_CLOSED"
  | "ENTRY_ASSESSMENT"
  | "CLASSIFICATION"
  | "TRAINING_ACTIVE"
  | "CLEARANCE"
  | "GEN_COMPLETE";

export type LevelCapacity = {
  min: number;
  max: number;
  scheduleTime: string; // e.g. "13:00–15:00"
  entryTurnCapacity: number;
};

export type Generation = {
  id: string; // e.g. "GEN001"
  name: string; // e.g. "GENERATION 001"
  location: string;
  eligibility: { minAge: number; maxAge: number; sex: "male" | "female" | "any" };
  status: GenerationStatus;
  price: number; // Bs, per cycle
  assessmentFee: number; // Bs, portion of price for the Entry Assessment
  trainingFee: number; // Bs, portion of price for the first training cycle
  currency: string;
  cycle: { weeks: number; sessions: number; hours: number };
  dates: {
    applicationsOpenISO: string;
    applicationsCloseISO: string;
    entryDatesISO: string[]; // e.g. ["2026-09-12", "2026-09-13"]
    trainingBeginsISO: string;
    clearanceWeekendISO: string[]; // e.g. ["2026-10-10", "2026-10-11"]
  };
  whatsappNumber: string; // digits only, wa.me format
  capacities: {
    foundation: LevelCapacity;
    performance: LevelCapacity;
    tactical: LevelCapacity;
  };
  isActive: boolean;
};

/**
 * GEN 001 defaults. Everything here is meant to be edited from the Command
 * Center (Generation Manager) rather than hardcoded for future generations —
 * src/lib/generation.ts persists admin edits on top of this default and is
 * what server code actually reads from.
 */
export const GEN_001_DEFAULT: Generation = {
  id: "GEN001",
  name: "GENERATION 001",
  location: "Cochabamba, Bolivia",
  eligibility: { minAge: 18, maxAge: 30, sex: "male" },
  status: "APPLICATIONS_OPEN",
  price: 250,
  assessmentFee: 30,
  trainingFee: 220,
  currency: "Bs",
  cycle: { weeks: 4, sessions: 8, hours: 16 },
  dates: {
    applicationsOpenISO: "2026-08-31",
    applicationsCloseISO: "2026-09-10",
    entryDatesISO: ["2026-09-12", "2026-09-13"],
    trainingBeginsISO: "2026-09-19",
    clearanceWeekendISO: ["2026-10-10", "2026-10-11"],
  },
  whatsappNumber: "59175277804",
  capacities: {
    foundation: {
      min: 6,
      max: 10,
      scheduleTime: "13:00–15:00",
      entryTurnCapacity: 10,
    },
    performance: {
      min: 6,
      max: 18,
      scheduleTime: "15:00–17:00",
      entryTurnCapacity: 15,
    },
    tactical: {
      min: 6,
      max: 20,
      scheduleTime: "17:00–19:00",
      entryTurnCapacity: 15,
    },
  },
  isActive: true,
};
