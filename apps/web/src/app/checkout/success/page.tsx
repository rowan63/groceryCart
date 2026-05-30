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
            <div className="py-4">
                <p className="text-xs text-gray-400">Order not found.</p>
            </div>
        </AppLayout>
    );

    return (
        <AppLayout>
            <div className="py-4 space-y-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase confirmation</h1>
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3 bg-white dark:bg-gray-800">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between py-2 text-xs text-gray-600 dark:text-gray-300">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-50 dark:border-gray-700 text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span className="text-[#1D9E75]">${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <a href="/" className="inline-block bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors">
                    Continue shopping
                </a>
            </div>
        </AppLayout>
    );
}