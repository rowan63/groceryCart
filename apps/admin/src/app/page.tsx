import { client } from "@repo/db/client";
import { isLoggedIn } from "../utils/auth";
import { login, logout } from "./actions";
import { ProductList } from "./components/ProductList";

export default async function Home() {
  const loggedIn = await isLoggedIn();
  const products = await client.db.product.findMany();

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
  } else {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-[#1D9E75] px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-white">FreshCart Admin</div>
          <div className="flex items-center gap-2">
            <a href="/users" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Users</a>
            <form action={logout}>
              <button type="submit" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Logout</button>
            </form>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <ProductList products={products} />
        </div>
      </main>
    );
  }
}