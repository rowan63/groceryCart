import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await client.db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_token", token, { httpOnly: true, path: "/" });

  return response;
}