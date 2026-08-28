import { ProgramSlug } from "./programs";

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

/**
 * A weekly time slot ("horario"). Two adjacent levels share the same turno
 * and the same capacity pool — e.g. Foundation + Performance both train
 * Saturday 14:30–16:00, and admitting into either one counts against the
 * same 8–22 headcount. Entry evaluation for new applicants only ever
 * happens on a Saturday turno (matching their preliminary level); Sunday
 * turnos are training-only, for members already admitted.
 */
export type Turno = {
  id: string;
  day: "saturday" | "sunday";
  startTime: string; // 24h, e.g. "14:30"
  endTime: string; // 24h, e.g. "16:00"
  levels: ProgramSlug[];
  minCapacity: number;
  maxCapacity: number;
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
    entryDatesISO: string[]; // index 0 = Saturday, index 1 = Sunday
    trainingBeginsISO: string;
    clearanceWeekendISO: string[]; // e.g. ["2026-10-10", "2026-10-11"]
  };
  whatsappNumber: string; // digits only, wa.me format
  turnos: Turno[];
  isActive: boolean;
};

export function turnoTimeRange(turno: Turno): string {
  return `${turno.startTime}–${turno.endTime}`;
}

export function turnosForLevel(turnos: Turno[], level: ProgramSlug): Turno[] {
  return turnos.filter((t) => t.levels.includes(level));
}

/** Upper-bound member capacity for a level: the sum of maxCapacity across
 * every turno that serves it. Each turno's capacity is shared with one
 * other level, so this is a ceiling, not a guarantee — useful for the
 * Command Center's rough "how full is this level" gauge. */
export function maxCapacityForLevel(turnos: Turno[], level: ProgramSlug): number {
  return turnosForLevel(turnos, level).reduce((sum, t) => sum + t.maxCapacity, 0);
}

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
  eligibility: { minAge: 18, maxAge: 35, sex: "any" },
  status: "APPLICATIONS_OPEN",
  price: 250,
  assessmentFee: 30,
  trainingFee: 220,
  currency: "Bs",
  // 7 training classes (1.5h) + 1 entry evaluation (1h) = 11.5h total.
  cycle: { weeks: 4, sessions: 8, hours: 11.5 },
  dates: {
    applicationsOpenISO: "2026-08-31",
    applicationsCloseISO: "2026-09-10",
    entryDatesISO: ["2026-09-12", "2026-09-13"],
    trainingBeginsISO: "2026-09-19",
    clearanceWeekendISO: ["2026-10-10", "2026-10-11"],
  },
  whatsappNumber: "59175277804",
  turnos: [
    {
      id: "sat-1",
      day: "saturday",
      startTime: "14:30",
      endTime: "16:00",
      levels: ["foundation", "performance"],
      minCapacity: 8,
      maxCapacity: 22,
    },
    {
      id: "sat-2",
      day: "saturday",
      startTime: "16:30",
      endTime: "18:00",
      levels: ["performance", "tactical"],
      minCapacity: 8,
      maxCapacity: 22,
    },
    {
      id: "sun-1",
      day: "sunday",
      startTime: "07:30",
      endTime: "09:00",
      levels: ["foundation", "performance"],
      minCapacity: 8,
      maxCapacity: 22,
    },
    {
      id: "sun-2",
      day: "sunday",
      startTime: "09:30",
      endTime: "11:00",
      levels: ["performance", "tactical"],
      minCapacity: 8,
      maxCapacity: 22,
    },
  ],
  isActive: true,
};
