"use client";

import type { Product } from "@prisma/client";
import { useState } from "react";

export function PostList({ posts }: { posts: Product[] }) {
  const [search, setSearch] = useState("");
  const [productList] = useState(posts);

  const filtered = productList.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="search" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Name:</label>
          <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {filtered.map((product) => (
          <article key={product.id} className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-blue-600">{product.category}</span>
                <span className="text-xs text-gray-500">{product.subcategory}</span>
              </div>
              <p className="text-base font-semibold text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500">{product.description}</p>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-sm font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400">{product.stock} in stock</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {product.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}