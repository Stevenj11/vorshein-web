import { promises as fs } from "fs";
import path from "path";
import { Generation, GEN_001_DEFAULT } from "./generation-defaults";

export type { Generation, GenerationStatus, LevelCapacity } from "./generation-defaults";
export { GEN_001_DEFAULT } from "./generation-defaults";

const FILE = path.join(process.cwd(), "data", "generations.json");

async function readAll(): Promise<Generation[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Generation[];
  } catch {
    return [GEN_001_DEFAULT];
  }
}

async function writeAll(generations: Generation[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(generations, null, 2), "utf-8");
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
