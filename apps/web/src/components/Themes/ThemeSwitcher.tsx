"use client";

import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState("light"); // <- TODO: Get the theme from the context

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current) setTheme(current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <Button onClick={toggleTheme}>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</Button>
  );
};

export default ThemeSwitch;
