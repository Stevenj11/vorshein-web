import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, createAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "invalid password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
