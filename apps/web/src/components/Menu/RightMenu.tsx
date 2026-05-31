"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
};

export function RightMenu() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch("/api/auth/user")
      .then(r => r.json())
      .then(data => {
        setLoggedIn(!!data.userId);
        if (data.userId) fetchCart();
      })
      .catch(() => setLoggedIn(false));
  }, []);

  useEffect(() => {
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, []);

  useEffect(() => {
    window.addEventListener("auth-updated", checkAuth);
    return () => window.removeEventListener("auth-updated", checkAuth);
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.items ?? []);
  }

  async function handleRemove(cartItemId: number) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId }),
    });
    fetchCart();
  }

  async function handleQuantity(cartItemId: number, quantity: number) {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    fetchCart();
  }

  async function checkAuth() {
    const res = await fetch("/api/auth/user");
    const data = await res.json();
    setLoggedIn(!!data.userId);
    if (data.userId) fetchCart();
    else setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="w-full sm:w-56 h-full bg-white dark:bg-gray-800 p-4 flex flex-col gap-4 flex-shrink-0 overflow-y-auto">
      <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 pt-2">
        {loggedIn ? `Cart (${cart.length})` : "Your Cart"}
      </h2>

      {loggedIn === null ? null : !loggedIn ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">Sign in to add items to your cart.</p>
          <a href="/login" className="bg-[#1D9E75] text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-[#0F6E56] text-center transition-colors">Sign in</a>
          <a href="/register" className="text-xs text-center text-[#1D9E75] hover:underline">Don't have an account? Register</a>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {cart.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.product.name}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">✕</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-600 text-xs text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors">-</button>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-5 text-center">{item.quantity}</span>
                      <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-600 text-xs text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors">+</button>
                    </div>
                    <p className="text-xs font-semibold text-[#1D9E75]">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 pb-4">
              <div className="flex justify-between mb-3">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full bg-[#1D9E75] text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-[#0F6E56] transition-colors">
                Checkout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}