import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Payment } from "./types";

const FILE = path.join(process.cwd(), "data", "payments.json");

async function readAll(): Promise<Payment[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Payment[];
  } catch {
    return [];
  }
}

async function writeAll(payments: Payment[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(payments, null, 2), "utf-8");
}

export async function listPayments(): Promise<Payment[]> {
  return readAll();
}

export async function recordPayment(
  input: Omit<Payment, "id">,
): Promise<Payment> {
  const all = await readAll();
  const payment: Payment = { ...input, id: randomUUID() };
  all.push(payment);
  await writeAll(all);
  return payment;
}

export async function updatePayment(
  id: string,
  patch: Partial<Payment>,
): Promise<Payment | null> {
  const all = await readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function paymentForApplication(
  applicationId: string,
): Promise<Payment | null> {
  const all = await readAll();
  return all.find((p) => p.applicationId === applicationId) ?? null;
}
