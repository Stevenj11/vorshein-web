import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "bookings.json");

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  level: string | null;
  recommendedPath: string | null;
  locale: string;
  createdAt: string;
};

/**
 * Local, file-backed booking store — enough to demo the flow end to end in
 * dev and to inspect submissions at data/bookings.json (gitignored). This is
 * NOT durable on a serverless/production deploy (ephemeral filesystem): swap
 * this module for a real database, CRM, or email notification before launch.
 * Nothing outside this file needs to change — the API route only calls
 * `appendBooking`.
 */
async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export async function appendBooking(booking: Booking): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const all = await readAll();
  all.push(booking);
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf-8");
}
