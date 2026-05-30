"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 w-full max-w-sm">
        <a href="/" className="block text-base font-semibold text-[#1D9E75] mb-6">FreshCart</a>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Create account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] dark:bg-gray-700 dark:text-white" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">Create account</button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">Already have an account? <a href="/login" className="text-[#1D9E75] hover:underline">Sign in</a></p>
      </div>
    </main>
  );
}