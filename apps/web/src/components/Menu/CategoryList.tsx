"use client";

import { useState } from "react";
import { SummaryItem } from "./SummaryItem";

const categories = [
  { name: "Poultry, Meat & Seafood", slug: "meat-seafood", subcategories: [] as string[] },
  { name: "Fruit & Veg", slug: "fruit-veg", subcategories: [] as string[] },
  { name: "Dairy, Eggs & Fridge", slug: "dairy-fridge", subcategories: [] as string[] },
  { name: "Bakery", slug: "bakery", subcategories: [] as string[] },
  { name: "Snacks & Confectionery", slug: "snacks", subcategories: [] as string[] },
];

export function CategoryList() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-1">
      {categories.map((c) => (
        <div key={c.slug}>
          <div onClick={() => setOpenSlug(openSlug === c.slug ? null : c.slug)}>
            <SummaryItem
              name={c.name}
              link={`/products?category=${c.slug}`}
              count={0}
              isSelected={false}
              title={c.name}
            />
          </div>
          {openSlug === c.slug && c.subcategories.length > 0 && (
            <ul className="ml-3 border-l border-gray-200 dark:border-gray-600 pl-3">
              {c.subcategories.map((sub) => (
                <SummaryItem
                  key={sub}
                  name={sub}
                  link={`/products?category=${c.slug}&sub=${sub.toLowerCase().replace(/ /g, "-")}`}
                  count={0}
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