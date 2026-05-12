"use client";

import { useEffect, useState } from "react";
import { SummaryItem } from "./SummaryItem";

const categories = [
  { name: "Poultry, Meat & Seafood", slug: "meat-seafood" },
  { name: "Fruit & Veg", slug: "fruit-veg" },
  { name: "Dairy, Eggs & Fridge", slug: "dairy-fridge" },
  { name: "Bakery", slug: "bakery" },
  { name: "Snacks & Confectionery", slug: "snacks" },
];

export function CategoryList() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch("/api/subcategories")
      .then((r) => r.json())
      .then(setSubcategories);
  }, []);

  return (
    <ul className="flex flex-col gap-1">
      {categories.map((c) => (
        <div key={c.slug}>
          <div className="flex items-center justify-between pr-1">
            <a href={`/category/${c.slug}`} className="flex-1 py-1 px-2 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {c.name}
            </a>
            {(subcategories[c.slug] ?? []).length > 0 && (
              <button onClick={() => setOpenSlug(openSlug === c.slug ? null : c.slug)} className="px-2 text-gray-400 hover:text-gray-600 text-xs">
                {openSlug === c.slug ? "▲" : "▼"}
              </button>
            )}
          </div>
          {openSlug === c.slug && (
            <ul className="ml-3 border-l border-gray-200 dark:border-gray-600 pl-3">
              {(subcategories[c.slug] ?? []).map((sub) => (
                <SummaryItem key={sub} name={sub} link={`/category/${c.slug}?sub=${encodeURIComponent(sub.toLowerCase().replace(/ /g, "-"))}`} isSelected={false} title={sub} />
              ))}
            </ul>
          )}
        </div>
      ))}
    </ul>
  );
}