import { readJsonArray, writeJsonArray } from "@/lib/jsonStore";
import { Application, ApplicationStatus } from "./types";

async function readAll(): Promise<Application[]> {
  return readJsonArray<Application>("applications");
}

async function writeAll(applications: Application[]): Promise<void> {
  await writeJsonArray("applications", applications);
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

/** Finds an existing application for this WhatsApp number in this generation,
 * so the same person can't accidentally submit twice. */
export async function findByWhatsapp(
  whatsapp: string,
  generationId: string,
): Promise<Application | null> {
  const all = await readAll();
  return (
    all.find((a) => a.whatsapp === whatsapp && a.generationId === generationId) ?? null
  );
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
