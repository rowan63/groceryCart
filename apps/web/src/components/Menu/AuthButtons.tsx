"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthButtons() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/user")
      .then(r => r.json())
      .then(data => {
        const isLoggedIn = !!data.userId;
        setLoggedIn(isLoggedIn);
      })
      .catch(() => {
        setLoggedIn(false);
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
    <button onClick={handleLogout} className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">
      Log out
    </button>
  ) : (
    <>
      <a href="/login" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">
        Log in
      </a>
      <a href="/register" className="text-xs bg-white text-[#0F6E56] font-semibold rounded-lg px-4 py-1.5 hover:bg-white/90 transition-colors">
        Register
      </a>
    </>
  );
}