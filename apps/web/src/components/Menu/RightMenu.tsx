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

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 flex-shrink-0">
      <h2 className="text-sm font-semibold uppercase text-gray-400">
        {loggedIn ? `Cart (${cart.length})` : "Your Cart"}
      </h2>

      {loggedIn === null ? null : !loggedIn ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to add items to your cart.</p>
          <a href="/login" className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 text-center">Sign In</a>
          <a href="/register" className="text-xs text-center text-indigo-600 hover:underline">Don't have an account? Register</a>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 flex-1">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400">Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded border text-sm">-</button>
                      <span className="text-sm">{item.quantity}</span>
                      <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded border text-sm">+</button>
                    </div>
                    <p className="text-sm font-medium text-indigo-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-3">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700">
                Checkout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}