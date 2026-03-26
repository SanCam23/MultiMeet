"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [largeText, setLargeTextState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("multimeet-theme") || "light";
    const savedLargeText = localStorage.getItem("multimeet-large-text") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(savedTheme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLargeTextState(savedLargeText);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("dark", "high-contrast");
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "high-contrast") root.classList.add("high-contrast");
    localStorage.setItem("multimeet-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
    localStorage.setItem("multimeet-large-text", String(largeText));
  }, [largeText, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "high-contrast";
      return "light";
    });
  };

  const setTheme = (newTheme) => setThemeState(newTheme);
  const setLargeText = (value) => setLargeTextState(value);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, largeText, setLargeText }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
