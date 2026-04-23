import { client } from "@repo/db/client";
import { isLoggedIn } from "../utils/auth";
import { login, logout } from "./actions";
import { PostList } from "./components/PostList";
import styles from "./page.module.css";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();
  const posts = await client.db.post.findMany();

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
  } else {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin of Full Stack Blog</h1>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5">Logout</button>
            </form>
          </div>
          <PostList posts={posts} />
        </div>
      </main>
    );
  }
}