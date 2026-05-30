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
    <ul className="flex flex-col gap-0.5">
      {categories.map((c) => (
        <div key={c.slug}>
          <div className="flex items-center justify-between pr-1">
            <a
              href={`/category/${c.slug}`}
              className="flex-1 py-1.5 px-2 rounded-md text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {c.name}
            </a>
            {(subcategories[c.slug] ?? []).length > 0 && (
              <button
                onClick={() => setOpenSlug(openSlug === c.slug ? null : c.slug)}
                className="px-1.5 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 text-[8px] transition-colors"
              >
                {openSlug === c.slug ? "▲" : "▼"}
              </button>
            )}
          </div>
          {openSlug === c.slug && (
            <ul className="ml-3 border-l border-gray-100 dark:border-gray-600 pl-3 mt-0.5">
              {(subcategories[c.slug] ?? []).map((sub) => (
                <SummaryItem
                  key={sub}
                  name={sub}
                  link={`/category/${c.slug}?sub=${encodeURIComponent(sub.toLowerCase().replace(/ /g, "-"))}`}
                  isSelected={false}
                  title={sub}
                />
              ))}
            </ul>
          )}
        </div>
      ))}
    </ul>
  );
}