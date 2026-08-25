import { promises as fs } from "fs";
import path from "path";

/**
 * Shared JSON-array persistence for every domain store (applications,
 * members, payments, attendance, generation).
 *
 * Root cause of the "no pudimos procesar tu postulación" production error:
 * every store used to write straight to a local file under `data/` via
 * `fs.writeFile`. That works in local dev, but Vercel's serverless
 * functions run on a read-only filesystem outside `/tmp` — the very first
 * write crashed the request with an unhandled EROFS, which Next.js turned
 * into an aborted 500. Local dev (no BLOB_READ_WRITE_TOKEN) keeps using the
 * filesystem; when deployed with Vercel Blob enabled, the same read/write
 * calls go through @vercel/blob instead, so callers never change.
 *
 * Still dev-grade for a first cohort's scale (no transactions/locking) —
 * swap for a real database before this needs to handle real concurrency.
 */

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function readFsFile(key: string): Promise<string | null> {
  const file = path.join(process.cwd(), "data", `${key}.json`);
  try {
    return await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
}

async function writeFsFile(key: string, contents: string): Promise<void> {
  const file = path.join(process.cwd(), "data", `${key}.json`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, contents, "utf-8");
}

async function readBlobFile(key: string): Promise<string | null> {
  const { get } = await import("@vercel/blob");
  const result = await get(`data/${key}.json`, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).text();
}

async function writeBlobFile(key: string, contents: string): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(`data/${key}.json`, contents, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readJsonArray<T>(key: string): Promise<T[]> {
  const raw = useBlob ? await readBlobFile(key) : await readFsFile(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeJsonArray<T>(key: string, data: T[]): Promise<void> {
  const contents = JSON.stringify(data, null, 2);
  if (useBlob) await writeBlobFile(key, contents);
  else await writeFsFile(key, contents);
}

export async function readJsonObject<T>(key: string): Promise<T | null> {
  const raw = useBlob ? await readBlobFile(key) : await readFsFile(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJsonObject<T>(key: string, data: T): Promise<void> {
  const contents = JSON.stringify(data, null, 2);
  if (useBlob) await writeBlobFile(key, contents);
  else await writeFsFile(key, contents);
}
