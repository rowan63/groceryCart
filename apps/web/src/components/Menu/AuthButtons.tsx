"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthButtons() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("loggedIn") === "true";
  });

  useEffect(() => {
    fetch("/api/auth/user")
      .then(r => r.json())
      .then(data => {
        const isLoggedIn = !!data.userId;
        setLoggedIn(isLoggedIn);
        localStorage.setItem("loggedIn", String(isLoggedIn));
      })
      .catch(() => {
        setLoggedIn(false);
        localStorage.setItem("loggedIn", "false");
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    localStorage.setItem("loggedIn", "false");
    router.push("/");
  }

  if (loggedIn === null) return null;

  return loggedIn ? (
    <button onClick={handleLogout} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5">Logout</button>
  ) : (
    <>
      <a href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900">Login</a>
      <a href="/register" className="text-sm bg-indigo-600 text-white rounded-md px-3 py-1.5 hover:bg-indigo-700">Register</a>
    </>
  );
}