import { readJsonArray, writeJsonArray } from "@/lib/jsonStore";
import { Application } from "../applications/types";
import { Member } from "./types";

async function readAll(): Promise<Member[]> {
  return readJsonArray<Member>("members");
}

async function writeAll(members: Member[]): Promise<void> {
  await writeJsonArray("members", members);
}

export async function listMembers(): Promise<Member[]> {
  return readAll();
}

export async function getMember(id: string): Promise<Member | null> {
  const all = await readAll();
  return all.find((m) => m.id === id) ?? null;
}

/** Based on the highest existing numeric suffix ever issued, not array
 * length — see the identical fix in applications/store.ts for why length
 * is unsafe once anything can shrink the array. */
export async function nextMemberId(): Promise<string> {
  const all = await readAll();
  const maxN = all.reduce((max, m) => {
    const match = /^VRSN-(\d+)$/.exec(m.id);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `VRSN-${String(maxN + 1).padStart(4, "0")}`;
}

/** Application VRSN-A#### becomes Member VRSN-#### on admission — the ID is permanent from here on. */
export async function promoteApplicationToMember(
  application: Application,
  officialLevel: "foundation" | "performance" | "tactical",
): Promise<Member> {
  const all = await readAll();
  const id = await nextMemberId();
  const member: Member = {
    id,
    applicationId: application.id,
    generationId: application.generationId,
    division: application.division,
    entryLevel: officialLevel,
    currentLevel: officialLevel,
    status: "active",
    admittedAt: new Date().toISOString(),
    firstName: application.firstName,
    lastName: application.lastName,
    photoUrl: null,
    clearances: { foundation: null, performance: null, tactical: null },
    rosterConsent: false,
    rosterDisplay: null,
  };
  all.push(member);
  await writeAll(all);
  return member;
}

export async function updateMember(
  id: string,
  patch: Partial<Member>,
): Promise<Member | null> {
  const all = await readAll();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function deleteMember(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((m) => m.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}

export async function occupancy(
  generationId: string,
): Promise<{ foundation: number; performance: number; tactical: number }> {
  const all = await readAll();
  const active = all.filter(
    (m) => m.generationId === generationId && m.status !== "inactive",
  );
  return {
    foundation: active.filter((m) => m.currentLevel === "foundation").length,
    performance: active.filter((m) => m.currentLevel === "performance").length,
    tactical: active.filter((m) => m.currentLevel === "tactical").length,
  };
}
