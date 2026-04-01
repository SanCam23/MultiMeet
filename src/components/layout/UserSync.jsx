"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Componente cliente que se encarga de sincronizar al usuario con MongoDB
 * llamando a la API de perfil. Esto evita usar auth() en el servidor
 * dentro del RootLayout, lo cual rompe la generación estática (SSG).
 */
export function UserSync() {
  const { userId, isLoaded } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && userId && !hasSynced.current) {
      // Disparamos la sincronización llamando a la API de perfil
      // que ya tiene implementada la lógica de UPSERT (crear si no existe)
      fetch("/api/user/profile")
        .then((res) => {
          if (res.ok) {
            hasSynced.current = true;
            console.log("✅ Usuario sincronizado con MongoDB");
          }
        })
        .catch((err) => {
          console.error("❌ Error en la sincronización automática:", err);
        });
    }
  }, [isLoaded, userId]);

  return null;
}
