"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  "meat-seafood": "Poultry, Meat & Seafood",
  "fruit-veg": "Fruit & Veg",
  "dairy-fridge": "Dairy, Eggs & Fridge",
  "bakery": "Bakery",
  "snacks": "Snacks & Confectionery",
};

export function TopMenu({ query, category }: { query?: string; category?: string }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category ?? "");

  useEffect(() => {
    fetch("/api/auth/user")
      .then(r => r.json())
      .then(data => setLoggedIn(!!data.userId))
      .catch(() => setLoggedIn(false));

    fetch("/api/subcategories")
      .then(r => r.json())
      .then(data => setCategories(Object.keys(data)));
  }, []);

  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    const cat = selectedCategory ? `&category=${selectedCategory}` : "";
    router.push(`/search?q=${search}${cat}`);
  });

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCategory(e.target.value);
    router.push(`/search?q=${query ?? ""}&category=${e.target.value}`);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <input
          placeholder="Search"
          defaultValue={query}
          onChange={handleSearch}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {query !== undefined && (
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{CATEGORY_NAMES[c] ?? c}</option>
            ))}
          </select>
        )}
      </div>
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