"use client";

import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-xs font-semibold uppercase text-gray-400 mb-2 hover:text-gray-600 dark:hover:text-gray-300"
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && children}
    </div>
  );
}

export function LeftMenu() {
  return (
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-8">
      <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">Grocery Cart</a>
      <nav>
        <ul className="flex flex-col gap-6">
          <Section title="Shop by Category">
            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Categories</p>
            <CategoryList />
          </Section>
          <Section title="Previous Purchases">
            <HistoryList selectedYear="" selectedMonth="" orders={[]} />
          </Section>
        </ul>
      </nav>
    </div>
  );
}
