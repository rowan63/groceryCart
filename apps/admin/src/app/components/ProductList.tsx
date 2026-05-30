"use client";

import type { Product } from "@prisma/client";
import { useState } from "react";
import { toggleActive } from "../actions";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "meat-seafood", label: "Poultry, Meat & Seafood" },
  { value: "fruit-veg", label: "Fruit & Veg" },
  { value: "dairy-fridge", label: "Dairy, Eggs & Fridge" },
  { value: "bakery", label: "Bakery" },
  { value: "snacks", label: "Snacks & Confectionery" },
];

export function ProductList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [productList, setProductList] = useState(products);

  const filtered = productList.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  async function handleToggle(id: number, active: boolean) {
    await toggleActive(id, active);
    setProductList((prev) => prev.map((p) => p.id === id ? { ...p, active: !active } : p));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 items-end justify-between">
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="search" className="text-xs font-medium text-gray-400 uppercase tracking-widest">Filter by name</label>
            <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-xs font-medium text-gray-400 uppercase tracking-widest">Filter by category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <a href="/products/create" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">Add product</a>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((product) => (
          <article key={product.id} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#1D9E75]">{product.category}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-400">{product.subcategory}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-400">{product.description}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-[#1D9E75]">${product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400">{product.stock} in stock</span>
                <button onClick={() => handleToggle(product.id, product.active)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors ${product.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                  {product.active ? "Active" : "Inactive"}
                </button>
                <a href={`/product/${product.id}`} className="text-xs text-[#1D9E75] border border-[#1D9E75]/30 rounded-lg px-4 py-1.5 hover:bg-[#1D9E75]/5 transition-colors ml-auto">Edit</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}