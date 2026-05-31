"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth < 640) {
      setLeftOpen(false);
      setRightOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("open-cart", () => setRightOpen(true));
    return () => window.removeEventListener("open-cart", () => setRightOpen(true));
  }, []);

  function toggleLeft() {
    setLeftOpen(next => !next);
  }

  function toggleRight() {
    setRightOpen(next => !next);
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
        <div className={`h-full overflow-y-auto flex-shrink-0 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200
          ${leftOpen ? "fixed top-16 inset-x-0 bottom-0 z-20 w-full sm:relative sm:w-56 sm:top-auto sm:inset-auto" : "w-0 overflow-hidden"}`}>
          <LeftMenu />
        </div>
        <div className="flex-1 overflow-y-auto min-w-0">
          <Content>
            {children}
          </Content>
        </div>
        <div className={`h-full flex-shrink-0 border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200
          ${rightOpen ? "fixed top-16 inset-x-0 bottom-0 z-20 w-full sm:relative sm:w-56 sm:top-auto sm:inset-auto" : "w-0 overflow-hidden"}`}>
          <RightMenu />
        </div>
      </div>
    </div>
  );
}