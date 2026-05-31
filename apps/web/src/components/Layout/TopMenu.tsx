"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
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

export function TopMenu({
  query,
  category,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
}: {
  query?: string;
  category?: string;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}) {
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
    window.dispatchEvent(new Event("auth-updated"));
    router.push("/");
  }

  return (
    <div id="top-menu" className="bg-[#1D9E75] sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onToggleLeft} className="text-white/80 hover:text-white border border-white/30 rounded-lg p-1.5 hover:bg-white/10 transition-colors" aria-label="Toggle left menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <a href="/" className="text-xl font-bold text-white tracking-tight">FreshCart</a>
          <input
            placeholder="Search"
            defaultValue={query}
            onChange={handleSearch}
            className="hidden sm:block border border-white/30 rounded-full px-5 py-2 w-64 lg:w-96 bg-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30"
          />
          {query !== undefined && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="hidden sm:block border border-white/30 rounded-full px-3 py-2 text-sm bg-white/20 text-white focus:outline-none focus:bg-white/30"
            >
              <option value="" className="text-gray-900">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c} className="text-gray-900">{CATEGORY_NAMES[c] ?? c}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          {loggedIn && (
            <button onClick={handleLogout} className="hidden sm:block text-sm text-white border border-white/40 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
              Logout
            </button>
          )}
          <button onClick={onToggleRight} className="text-white/80 hover:text-white border border-white/30 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors">
            Cart
          </button>
        </div>
      </div>
      {/* Mobile search row */}
      <div className="sm:hidden px-4 pb-3">
        <input
          placeholder="Search"
          defaultValue={query}
          onChange={handleSearch}
          className="w-full border border-white/30 rounded-full px-5 py-2 bg-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30"
        />
        {query !== undefined && (
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-2 w-full border border-white/30 rounded-full px-3 py-2 text-sm bg-white/20 text-white focus:outline-none focus:bg-white/30"
          >
            <option value="" className="text-gray-900">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c} className="text-gray-900">{CATEGORY_NAMES[c] ?? c}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}