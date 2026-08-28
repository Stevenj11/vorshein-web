import { readJsonArray, writeJsonArray } from "@/lib/jsonStore";
import { Generation, GEN_001_DEFAULT } from "./generation-defaults";

export type { Generation, GenerationStatus, Turno } from "./generation-defaults";
export {
  GEN_001_DEFAULT,
  turnoTimeRange,
  turnosForLevel,
  maxCapacityForLevel,
} from "./generation-defaults";

/**
 * Generations saved before the Sat/Sun turno-schedule overhaul persisted a
 * `capacities: {foundation, performance, tactical}` shape with no `turnos`
 * array — every page reads getActiveGeneration(), so an unmigrated record
 * would 500 the entire site until an admin happened to re-save the form.
 * Backfills the new schedule/eligibility fields from the default (the exact
 * values this change was meant to roll out) while preserving whatever the
 * admin actually customized — price, dates, name, location, status. Never
 * writes the fix back; it's cheap enough to redo on every read, and a real
 * admin save through the new form already produces the new shape.
 */
function migrateGeneration(g: Generation): Generation {
  if (g.turnos) return g;
  return {
    ...g,
    eligibility: GEN_001_DEFAULT.eligibility,
    cycle: { ...g.cycle, hours: GEN_001_DEFAULT.cycle.hours },
    turnos: GEN_001_DEFAULT.turnos,
  };
}

async function readAll(): Promise<Generation[]> {
  const all = await readJsonArray<Generation>("generations");
  const migrated = all.map(migrateGeneration);
  return migrated.length > 0 ? migrated : [GEN_001_DEFAULT];
}

async function writeAll(generations: Generation[]): Promise<void> {
  await writeJsonArray("generations", generations);
}

export async function listGenerations(): Promise<Generation[]> {
  return readAll();
}

export async function getActiveGeneration(): Promise<Generation> {
  const all = await readAll();
  return all.find((g) => g.isActive) ?? all[0] ?? GEN_001_DEFAULT;
}

export async function updateGeneration(
  id: string,
  patch: Partial<Generation>,
): Promise<Generation> {
  const all = await readAll();
  const idx = all.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error(`Generation ${id} not found`);
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function createGeneration(gen: Generation): Promise<Generation> {
  const all = await readAll();
  if (gen.isActive) {
    for (const g of all) g.isActive = false;
  }
  all.push(gen);
  await writeAll(all);
  return gen;
}
