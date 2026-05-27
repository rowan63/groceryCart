import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function getUserId(request: NextRequest): number | null {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return null;
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
        return payload.userId;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cart = await client.db.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await client.db.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                total,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        return newOrder;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
}