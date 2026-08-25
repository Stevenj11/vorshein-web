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

/** Based on the highest existing numeric suffix ever issued, never on
 * array length — length-based IDs collide as soon as any application is
 * deleted (the array shrinks, so a future "length + 1" reuses an ID
 * that's still attached to a different, older application). */
export async function nextApplicationId(): Promise<string> {
  const all = await readAll();
  const maxN = all.reduce((max, a) => {
    const match = /^VRSN-A(\d+)$/.exec(a.id);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `VRSN-A${String(maxN + 1).padStart(4, "0")}`;
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

/** One-time repair for the ID-collision bug (nextApplicationId used to
 * derive IDs from array length, which broke once deletion existed): walks
 * applications in stored order, leaves the first occurrence of any ID
 * alone, and reassigns every later occurrence a fresh, never-used ID. */
export async function repairDuplicateApplicationIds(): Promise<
  { oldId: string; newId: string; firstName: string; lastName: string }[]
> {
  const all = await readAll();
  const seen = new Set<string>();
  const changes: { oldId: string; newId: string; firstName: string; lastName: string }[] = [];
  let maxN = all.reduce((max, a) => {
    const match = /^VRSN-A(\d+)$/.exec(a.id);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

  for (const app of all) {
    if (seen.has(app.id)) {
      const oldId = app.id;
      maxN += 1;
      app.id = `VRSN-A${String(maxN).padStart(4, "0")}`;
      changes.push({ oldId, newId: app.id, firstName: app.firstName, lastName: app.lastName });
    }
    seen.add(app.id);
  }

  if (changes.length > 0) await writeAll(all);
  return changes;
}

/** An application with a memberId but a status other than ADMITTED can
 * only mean an in-place status edit (e.g. one accidentally aimed at the
 * wrong row during the ID-collision incident) clobbered it after
 * promotion already ran — promotion is the only thing that ever sets
 * memberId. Restores status without re-promoting (that would mint a
 * second, orphaned Member for the same person). */
export async function repairOrphanedAdmittedStatus(): Promise<
  { id: string; firstName: string; lastName: string }[]
> {
  const all = await readAll();
  const fixed: { id: string; firstName: string; lastName: string }[] = [];
  for (const app of all) {
    if (app.memberId && app.status !== "ADMITTED") {
      app.status = "ADMITTED";
      fixed.push({ id: app.id, firstName: app.firstName, lastName: app.lastName });
    }
  }
  if (fixed.length > 0) await writeAll(all);
  return fixed;
}

export async function deleteApplication(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
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
