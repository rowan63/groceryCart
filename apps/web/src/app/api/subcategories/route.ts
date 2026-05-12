import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
    const products = await client.db.product.findMany({
        where: { active: true },
        select: { category: true, subcategory: true },
    });

    const result: Record<string, string[]> = {};
    for (const p of products) {
        if (!result[p.category]) result[p.category] = [];
        if (!result[p.category]!.includes(p.subcategory)) {
            result[p.category]!.push(p.subcategory);
        }
    }

    return NextResponse.json(result);
}