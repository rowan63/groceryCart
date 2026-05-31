"use client";

import { useState, useEffect } from "react";
import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { RightMenu } from "../Menu/RightMenu";
import { TopMenu } from "./TopMenu";

export function AppLayout({
  children,
  query,
  category,
}: PropsWithChildren<{ query?: string; category?: string }>) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLeftOpen(localStorage.getItem("leftOpen") === "true");
    setRightOpen(localStorage.getItem("rightOpen") === "true");
    setMounted(true);
  }, []);

  function toggleLeft() {
    const next = !leftOpen;
    setLeftOpen(next);
    localStorage.setItem("leftOpen", String(next));
  }

  function toggleRight() {
    const next = !rightOpen;
    setRightOpen(next);
    localStorage.setItem("rightOpen", String(next));
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <TopMenu
        query={query}
        category={category}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        onToggleLeft={toggleLeft}
        onToggleRight={toggleRight}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className={`h-full overflow-y-auto flex-shrink-0 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${mounted && leftOpen ? "fixed inset-0 z-20 w-full sm:relative sm:w-56 sm:inset-auto" : "w-0 overflow-hidden"}`}>
          <LeftMenu />
        </div>
        <div className="flex-1 overflow-y-auto min-w-0">
          <Content>
            {children}
          </Content>
        </div>
        <div className={`h-full flex-shrink-0 border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${mounted && rightOpen ? "fixed inset-0 z-20 w-full sm:relative sm:w-56 sm:inset-auto" : "w-0 overflow-hidden"}`}>
          <RightMenu />
        </div>
      </div>
    </div>
  );
}