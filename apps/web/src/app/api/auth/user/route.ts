import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({});
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
    return NextResponse.json({ userId: payload.userId, email: payload.email, role: payload.role });
  } catch {
    return NextResponse.json({});
  }
}