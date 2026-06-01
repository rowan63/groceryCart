"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button aria-label="Toggle theme" onClick={toggleTheme} className="text-white border border-white/30 rounded-lg p-1.5 hover:bg-white/10 transition-colors bg-transparent text-base leading-none">
      {theme === "light" ? "☾" : "○"}
    </Button>
  );
};

export default ThemeSwitch;
