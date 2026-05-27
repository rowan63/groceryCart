"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
    id: number;
    quantity: number;
    product: { id: number; name: string; price: number };
};

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetch("/api/auth/user")
            .then((r) => r.json())
            .then((data) => {
                if (!data.userId) { router.push("/login"); return; }
                fetch("/api/cart")
                    .then((r) => r.json())
                    .then((data) => setCart(data.items ?? []));
            });
    }, [router]);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    function validate() {
        const errors: Record<string, string> = {};
        if (!form.name.trim()) errors.name = "Name is required";
        if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Enter a valid 16-digit card number";
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errors.expiry = "Use MM/YY format";
        if (!/^\d{3,4}$/.test(form.cvv)) errors.cvv = "Enter a valid CVV";
        return errors;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
        setSubmitting(true);
        const res = await fetch("/api/orders", { method: "POST" });
        if (!res.ok) { const data = await res.json(); setError(data.error ?? "Something went wrong"); setSubmitting(false); return; }
        const data = await res.json();
        router.push(`/checkout/success?orderId=${data.orderId}`);
    }

    if (cart.length === 0) return (
        <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <a href="/" className="text-indigo-600 hover:underline">Continue shopping</a>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold">Checkout</h1>

            <section>
                <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
                <div className="border rounded-lg divide-y dark:border-gray-700">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between px-4 py-3 text-sm">
                            <span>{item.product.name} <span className="text-gray-500">× {item.quantity}</span></span>
                            <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between px-4 py-3 font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name on card</label>
                        <input name="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jane Smith"
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`} />
                        {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Card number</label>
                        <input name="cardNumber" value={form.cardNumber} onChange={(e) => setForm((f) => ({ ...f, cardNumber: e.target.value }))} placeholder="1234 5678 9012 3456"
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 ${fieldErrors.cardNumber ? "border-red-500" : "border-gray-300"}`} />
                        {fieldErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry</label>
                            <input name="expiry" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} placeholder="MM/YY"
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 ${fieldErrors.expiry ? "border-red-500" : "border-gray-300"}`} />
                            {fieldErrors.expiry && <p className="text-red-500 text-xs mt-1">{fieldErrors.expiry}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">CVV</label>
                            <input name="cvv" value={form.cvv} onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value }))} placeholder="123"
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 ${fieldErrors.cvv ? "border-red-500" : "border-gray-300"}`} />
                            {fieldErrors.cvv && <p className="text-red-500 text-xs mt-1">{fieldErrors.cvv}</p>}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
                        {submitting ? "Placing order..." : `Pay $${total.toFixed(2)}`}
                    </button>
                </form>
            </section>
        </div>
    );
}