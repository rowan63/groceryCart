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
        className="w-full flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {title}
        <span className="text-[8px]">{open ? "▲" : "▼"}</span>
      </button>
      {open && children}
    </div>
  );
}

export function LeftMenu() {
  return (
    <div className="w-55 min-h-screen bg-white dark:bg-gray-800 p-4 flex flex-col gap-6 border-r border-gray-100 dark:border-gray-700">
      <nav>
        <ul className="flex flex-col gap-6">
          <Section title="Shop by Category">
            <CategoryList />
          </Section>
          <Section title="Previous Purchases">
            <HistoryList selectedYear="" selectedMonth="" />
          </Section>
        </ul>
      </nav>
    </div>
  );
}