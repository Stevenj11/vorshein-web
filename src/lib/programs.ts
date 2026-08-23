import { Level } from "./assessment/scoring";

export type ProgramSlug = "foundation" | "performance" | "tactical";

export type Program = {
  slug: ProgramSlug;
  level: "01" | "02" | "03";
  /** Manual module numbers (see lib/manual.ts) most relevant to this program. */
  relatedModules: string[];
};

/**
 * Structure only — name/subtitle/description/focus list live in
 * messages/{locale}.json under programs.{slug} so this never needs to
 * change per locale.
 */
export const PROGRAMS: Program[] = [
  {
    slug: "foundation",
    level: "01",
    relatedModules: ["01", "02", "03", "04", "07"],
  },
  {
    slug: "performance",
    level: "02",
    relatedModules: ["01", "02", "05", "06", "07", "08"],
  },
  {
    slug: "tactical",
    level: "03",
    relatedModules: ["03", "06", "08", "09", "10"],
  },
];

export const LEVEL_TO_PROGRAM_SLUG: Record<Level, ProgramSlug> = {
  BASIC: "foundation",
  INTERMEDIATE: "performance",
  ADVANCED: "tactical",
};

export const PROGRAM_SLUG_TO_LEVEL: Record<ProgramSlug, Level> = {
  foundation: "BASIC",
  performance: "INTERMEDIATE",
  tactical: "ADVANCED",
};

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
