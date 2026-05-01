import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { postId } = await request.json();
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    const exists = await client.db.like.findUnique({
        where: { postId_userIP: { postId, userIP: ip } }
    });

    if (exists) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    await client.db.like.create({ data: { postId, userIP: ip } });
    await client.db.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
    const { postId } = await request.json();
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    await client.db.like.delete({
        where: { postId_userIP: { postId, userIP: ip } }
    });
    await client.db.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
    const postId = parseInt(request.nextUrl.searchParams.get("postId") ?? "0");
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    const existing = await client.db.like.findUnique({
        where: { postId_userIP: { postId, userIP: ip } }
    });

    return NextResponse.json({ liked: !!existing });
}