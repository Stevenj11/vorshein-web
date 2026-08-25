import { promises as fs } from "fs";
import path from "path";
import { Application, ApplicationStatus } from "./types";

const FILE = path.join(process.cwd(), "data", "applications.json");

/**
 * Local, file-backed store — fine for demoing GEN 001 end to end, but not
 * durable on a serverless deploy (ephemeral filesystem). Swap for a real
 * database before running a live cohort at scale.
 */
async function readAll(): Promise<Application[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

async function writeAll(applications: Application[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(applications, null, 2), "utf-8");
}

export async function listApplications(): Promise<Application[]> {
  return readAll();
}

export async function getApplication(id: string): Promise<Application | null> {
  const all = await readAll();
  return all.find((a) => a.id === id) ?? null;
}

export async function nextApplicationId(): Promise<string> {
  const all = await readAll();
  const n = all.length + 1;
  return `VRSN-A${String(n).padStart(4, "0")}`;
}

export async function createApplication(app: Application): Promise<Application> {
  const all = await readAll();
  all.push(app);
  await writeAll(all);
  return app;
}

export async function updateApplication(
  id: string,
  patch: Partial<Application>,
): Promise<Application | null> {
  const all = await readAll();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function setApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<Application | null> {
  return updateApplication(id, { status });
}

/** Count of RESERVED/CONFIRMED applications sharing a turn — used to derive turn state. */
export async function countForTurn(
  turnDateISO: string,
  turnTimeSlot: string,
): Promise<number> {
  const all = await readAll();
  return all.filter(
    (a) =>
      a.turnDateISO === turnDateISO &&
      a.turnTimeSlot === turnTimeSlot &&
      a.status !== "NO_SHOW" &&
      a.status !== "NOT_YET_ELIGIBLE",
  ).length;
}
