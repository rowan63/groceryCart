import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import { login, logout } from "../../actions";
import { notFound } from "next/navigation";

export default async function UserOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl border border-gray-100 w-full max-w-sm">
          <div className="text-base font-bold text-[#1D9E75] mb-6">FreshCart Admin</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-6">Sign in</h1>
          <form action={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-medium text-gray-600">Email</label>
              <input id="email" name="email" type="email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-medium text-gray-600">Password</label>
              <input id="password" name="password" type="password" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
            </div>
            <button type="submit" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">Sign in</button>
          </form>
        </div>
      </main>
    );
  }

  const user = await client.db.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1D9E75] px-6 h-16 flex items-center justify-between mb-8">
        <a href="/" className="text-xl font-bold text-white">FreshCart Admin</a>
        <form action={logout}>
          <button type="submit" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Logout</button>
        </form>
      </div>
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="mb-6">
          <a href="/users" className="text-xs text-[#1D9E75] hover:underline mb-2 block">← Back to users</a>
          <h1 className="text-lg font-semibold text-gray-900">{user.name || user.email}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
        </div>
        <div className="flex flex-col gap-3">
          {user.orders.length === 0 ? (
            <p className="text-xs text-gray-400">No orders yet.</p>
          ) : (
            user.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-xs text-gray-600">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-50">
                  <span>Total</span>
                  <span className="text-[#1D9E75]">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}