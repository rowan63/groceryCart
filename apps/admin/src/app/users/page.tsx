import { client } from "@repo/db/client";
import { isLoggedIn } from "../../utils/auth";
import { login, logout } from "../actions";

export default async function UsersPage() {
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

  const users = await client.db.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1D9E75] px-6 h-16 flex items-center justify-between mb-8">
        <a href="/" className="text-xl font-bold text-white">FreshCart Admin</a>
        <div className="flex items-center gap-2">
          <a href="/" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Products</a>
          <form action={logout}>
            <button type="submit" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Logout</button>
          </form>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">Users</h1>
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <a key={user.id} href={`/users/${user.id}`} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <span className="text-xs text-gray-400">{user._count.orders} orders</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}