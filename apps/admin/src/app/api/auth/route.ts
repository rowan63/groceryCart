import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function POST(request: NextRequest) {
    const { password } = await request.json();
    
    if (password !== "123") {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ authenticated: true }, env.JWT_SECRET || "secret");
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        path: "/",
    });

    return NextResponse.json({ success: true });
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return NextResponse.json({ success: true });
}