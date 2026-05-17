"use client";

import { useRouter } from "next/navigation";
import { AuthButtons } from "../Menu/AuthButtons";
import { useEffect, useState } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/user")
      .then(r => r.json())
      .then(data => setLoggedIn(!!data.userId))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    router.push("/");
  }

  // TODO: create and hook the search input to the handleSearch function
  //       make sure you are able to explain what the handleSearch is doing and what debounce does
  //       debounce - helper that makes sure it doesnt search after every letter

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
      <input
        placeholder="Search"
        defaultValue={query}
        onChange={handleSearch}
        className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <div className="flex items-center gap-3">
        {loggedIn && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 border border-gray-300 rounded-md px-3 py-1.5"
          >
            Logout
          </button>
        )}
        <ThemeSwitch />
      </div>
    </div>
  );
}