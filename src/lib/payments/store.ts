import { randomUUID } from "crypto";
import { readJsonArray, writeJsonArray } from "@/lib/jsonStore";
import { Payment } from "./types";

async function readAll(): Promise<Payment[]> {
  return readJsonArray<Payment>("payments");
}

async function writeAll(payments: Payment[]): Promise<void> {
  await writeJsonArray("payments", payments);
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
