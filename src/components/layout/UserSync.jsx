"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { OnboardingPasarela } from "../onboarding/OnboardingPasarela";

/**
 * Componente cliente que se encarga de sincronizar al usuario con MongoDB
 * llamando a la API de perfil. Esto evita usar auth() en el servidor
 * dentro del RootLayout, lo cual rompe la generación estática (SSG).
 */
export function UserSync({ children }) {
  const { userId, isLoaded } = useAuth();
  const hasSynced = useRef(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (userId && !hasSynced.current) {
      // Disparamos la sincronización llamando a la API de perfil
      // que ya tiene implementada la lógica de UPSERT (crear si no existe)
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          hasSynced.current = true;
          console.log("✅ Usuario sincronizado con MongoDB");

          // Si el usuario es nuevo o no ha completado el onboarding, lo mostramos
          if (!data.onboardingCompleted) {
            setShowOnboarding(true);
          }
        })
        .catch((err) => {
          console.error("❌ Error en la sincronización automática:", err);
        })
        .finally(() => {
          setIsChecking(false);
        });
    }
  }, [isLoaded, userId]);

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingPasarela onComplete={() => setShowOnboarding(false)} />;
  }

  return children;
}
