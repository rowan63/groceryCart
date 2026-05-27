import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";

export default async function Page({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
    const { orderId } = await searchParams;

    const order = orderId ? await client.db.order.findUnique({
        where: { id: parseInt(orderId) },
        include: { items: { include: { product: true } } },
    }) : null;

    if (!order) return (
        <AppLayout>
            <div className="p-6">
                <p className="text-gray-500">Order not found.</p>
            </div>
        </AppLayout>
    );

    return (
        <AppLayout>
            <div className="p-6 space-y-6 mx-auto">
                <h1 className="text-2xl font-bold">Purchase Confirmation</h1>
                <div className="border rounded-lg p-4 space-y-3 dark:border-gray-700">
                    <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
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
                <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                    Continue shopping
                </a>
            </div>
        </AppLayout>
    );
}