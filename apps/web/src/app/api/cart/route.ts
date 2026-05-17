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

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await client.db.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await request.json();

  let cart = await client.db.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await client.db.cart.create({ data: { userId } });
  }

  const existing = await client.db.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existing) {
    await client.db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await client.db.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cartItemId, quantity } = await request.json();

  if (quantity <= 0) {
    await client.db.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await client.db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cartItemId } = await request.json();

  await client.db.cartItem.delete({ where: { id: cartItemId } });

  return NextResponse.json({ success: true });
}