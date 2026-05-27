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
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Purchase History</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">No orders for this month.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
                            </div>
                            <button onClick={() => router.push(`/checkout/success?orderId=${order.id}`)}
                                className="text-sm text-indigo-600 hover:underline">
                                View details
                            </button>
                        </div>
                        <div className="divide-y dark:divide-gray-700">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between py-2 text-sm">
                                    <span>{item.product.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold pt-2">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}