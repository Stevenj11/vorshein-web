import { ProgramSlug } from "./programs";

/**
 * Real photography as it's produced, keyed by program. Slugs without an
 * entry keep showing ImagePlaceholder's placeholder state — add the file
 * under public/media/training/ and register it here. Facility and
 * equipment shots are the same physical location/gear across levels, so
 * those two maps intentionally point every slug at the same Foundation
 * files rather than needing a fresh shoot per level.
 */
export const PROGRAM_HERO_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-hero.jpg",
  performance: "/media/training/performance-hero.jpg",
  tactical: "/media/training/tactical-hero.jpg",
};

export const PROGRAM_BREATHING_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-breathing.jpg",
  performance: "/media/training/performance-breathing.jpg",
};

/** Tactical-only apnea DetailSection (separate from PROGRAM_BREATHING_IMAGE,
 * which only renders for the non-tactical breathing branch). */
export const PROGRAM_APNEA_IMAGE: Partial<Record<ProgramSlug, string>> = {
  tactical: "/media/training/tactical-apnea.jpg",
};

/** Tactical-only competition-prep DetailSection. */
export const PROGRAM_COMPETITION_IMAGE: Partial<Record<ProgramSlug, string>> = {
  tactical: "/media/training/tactical-competition.jpg",
};

export const PROGRAM_CERTIFICATION_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-certification.jpg",
  performance: "/media/training/performance-certification.jpg",
  tactical: "/media/training/tactical-certification.jpg",
};

export const PROGRAM_UNDERWATER_IMAGE: Partial<Record<ProgramSlug, string>> = {
  performance: "/media/training/performance-underwater.jpg",
  tactical: "/media/training/tactical-underwater.jpg",
};

export const PROGRAM_FACILITY_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-facility.jpg",
  performance: "/media/training/foundation-facility.jpg",
  tactical: "/media/training/foundation-facility.jpg",
};

export const PROGRAM_EQUIPMENT_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-equipment.jpg",
  performance: "/media/training/foundation-equipment.jpg",
  tactical: "/media/training/foundation-equipment.jpg",
};

export const PROGRAM_WATER_IMAGE: Partial<Record<ProgramSlug, string>> = {
  foundation: "/media/training/foundation-water.jpg",
  performance: "/media/training/performance-water.jpg",
  tactical: "/media/training/tactical-underwater.jpg",
};
