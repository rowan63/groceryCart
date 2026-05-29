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
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h1>
          <form action={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <button type="submit" className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Sign In</button>
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/users" className="text-sm text-gray-500 hover:text-gray-900 mb-1 block">← Back to users</a>
            <h1 className="text-2xl font-bold text-gray-900">{user.name || user.email}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5">Logout</button>
          </form>
        </div>
        <div className="flex flex-col gap-6">
          {user.orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            user.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}</p>
                </div>
                <div className="divide-y">
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
      </div>
    </main>
  );
}