"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const { isLoaded, userId } = useAuth();
  const [theme, setThemeState] = useState("light");
  const [largeText, setLargeTextState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isFetching = useRef(true);

  // Carga inicial (desde localStorage por mientras se comprueba Clerk)
  useEffect(() => {
    const savedTheme = localStorage.getItem("multimeet-theme") || "light";
    const savedLargeText = localStorage.getItem("multimeet-large-text") === "true";
    setThemeState(savedTheme);
    setLargeTextState(savedLargeText);
    setMounted(true);
    // Marcamos que la carga de localStorage ha terminado
    setTimeout(() => { isFetching.current = false; }, 100);
  }, []);

  // Sincronización con la base de datos cuando el usuario inicia sesión
  useEffect(() => {
    if (!isLoaded || !mounted) return;

    if (userId) {
      // Usuario logueado: Obtener preferencias del perfil
      const fetchPreferences = async () => {
        isFetching.current = true;
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            if (data.preferences) {
              setThemeState(data.preferences.theme || "light");
              setLargeTextState(data.preferences.largeText || false);
            }
          }
        } catch (err) {
          console.error("Error cargando preferencias de usuario:", err);
        } finally {
          // Pequeño delay para que los efectos secundarios no se disparen antes de cambiar el ref
          setTimeout(() => { isFetching.current = false; }, 100);
        }
      };
      fetchPreferences();
    } else {
      // Usuario deslogueado: Volver al tema claro por defecto (según la petición)
      isFetching.current = true;
      setThemeState("light");
      setLargeTextState(false);
      setTimeout(() => { isFetching.current = false; }, 100);
    }
  }, [isLoaded, userId, mounted]);

  // Aplicar clases al document y guardar en localStorage (y DB si logueado)
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    
    // Aplicar tema
    root.classList.remove("dark", "high-contrast");
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "high-contrast") root.classList.add("high-contrast");
    localStorage.setItem("multimeet-theme", theme);

    // Guardar en DB si hay usuario y ha sido un cambio manual (no fetch/load)
    if (userId && !isFetching.current) {
      updatePreferences({ theme });
    }
  }, [theme, mounted, userId]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    
    // Aplicar texto grande
    if (largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
    localStorage.setItem("multimeet-large-text", String(largeText));

    // Guardar en DB si hay usuario y ha sido un cambio manual (no fetch/load)
    if (userId && !isFetching.current) {
      updatePreferences({ largeText });
    }
  }, [largeText, mounted, userId]);

  const updatePreferences = async (prefs) => {
    try {
      await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
    } catch (err) {
      console.error("Error guardando preferencias:", err);
    }
  };

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
