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
            <label htmlFor="search" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Name:</label>
            <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Category:</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <a href="/products/create" className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Add Product</a>
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
                <button onClick={() => handleToggle(product.id, product.active)}
                  className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {product.active ? "Active" : "Inactive"}
                </button>
                <a href={`/product/${product.id}`} className="text-xs text-indigo-600 border border-indigo-300 rounded-md px-3 py-1 hover:bg-indigo-50">Edit</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}