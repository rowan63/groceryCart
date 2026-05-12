import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  const existing = await client.db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await client.db.user.create({
    data: { email, password: hashed, name }
  });

  return NextResponse.json({ success: true, userId: user.id });
}