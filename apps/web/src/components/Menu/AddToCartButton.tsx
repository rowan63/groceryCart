"use client";

import { useRouter } from "next/navigation";

export function AddToCartButton({ productId }: { productId: number }) {
  const router = useRouter();

  async function addToCart(e: React.MouseEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/user");
    const data = await res.json();

    if (!data.userId) {
      router.push("/login");
    } else {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      window.location.reload();
    }
  }

  return (
    <button
      onClick={addToCart}
      className="mt-auto bg-[#1D9E75] text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#0F6E56] transition-colors w-full"
    >
      Add to cart
    </button>
  );
}