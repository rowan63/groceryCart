"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    product: { name: string };
};

type Order = {
    id: number;
    createdAt: string;
    total: number;
    items: OrderItem[];
};

export function OrderList({ year, month }: { year: string; month: string }) {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch("/api/auth/user")
            .then((r) => r.json())
            .then((data) => {
                if (!data.userId) { router.push("/login"); return; }
                fetch("/api/orders")
                    .then((r) => r.json())
                    .then((all: Order[]) => {
                        const filtered = all.filter((o) => {
                            const d = new Date(o.createdAt);
                            return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(month);
                        });
                        setOrders(filtered);
                    });
            });
    }, [year, month, router]);

    return (
        <div className="py-4 space-y-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase history</h1>
            {orders.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500">No orders for this month.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
                            </div>
                            <button onClick={() => router.push(`/checkout/success?orderId=${order.id}`)}
                                className="text-xs text-[#1D9E75] hover:underline transition-colors">
                                View details
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between py-2 text-xs text-gray-600 dark:text-gray-300">
                                    <span>{item.product.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-sm font-semibold pt-1 text-gray-900 dark:text-white border-t border-gray-50 dark:border-gray-700">
                            <span>Total</span>
                            <span className="text-[#1D9E75]">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}