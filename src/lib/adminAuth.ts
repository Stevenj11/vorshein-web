import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Lightweight, stateless admin session for the Command Center — a signed,
 * self-verifying cookie (expiry + HMAC over that expiry, keyed by
 * ADMIN_PASSWORD) rather than a server-side session store. This works
 * correctly on serverless (no in-memory state to lose between invocations)
 * without needing a database. Good enough for a single-admin GEN 001 launch;
 * swap for real auth (multiple admins, roles, audit log) before scaling
 * beyond that.
 */
const COOKIE_NAME = "vorshein_admin";
const SESSION_HOURS = 12;

function secret(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  return pw;
}

function sign(expiry: number): string {
  return createHmac("sha256", secret()).update(String(expiry)).digest("hex");
}

function makeToken(): string {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return `${expiry}.${sign(expiry)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, sig] = token.split(".");
  const expiry = Number(expiryStr);
  if (!expiry || !sig || Date.now() > expiry) return false;
  const expected = sign(expiry);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkAdminPassword(password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
