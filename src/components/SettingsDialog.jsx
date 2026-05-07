"use client";

import { useEffect, useState } from "react";
import { X, Moon, Sun, Contrast, Type, LogOut, Settings, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useClerk, UserProfile } from "@clerk/nextjs";

export function SettingsDialog({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("general");
  const { theme, setTheme, largeText, setLargeText } = useTheme();
  const { signOut } = useClerk();
  const isHighContrast = theme === "high-contrast";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="relative w-full max-w-[950px] md:max-w-[1000px] h-full max-h-[90vh] sm:max-h-[85vh] bg-card border border-border shadow-2xl rounded-3xl p-0 gap-0 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 pt-4 pb-0 border-b border-border shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="settings-title" className="text-2xl font-bold">Ajustes</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar ajustes"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("general")}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === "general" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>General</span>
              </div>
              {activeTab === "general" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("cuenta")}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === "cuenta" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Gestión de Cuenta</span>
              </div>
              {activeTab === "cuenta" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {activeTab === "general" ? (
            <div className="px-6 py-5">
              {/* Theme Section */}
          <div className="mb-5">
            <h3 className="font-semibold text-lg mb-1">Apariencia</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Elige cómo se ve MultiMeet
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Light Mode */}
              <button
                onClick={() => setTheme("light")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    theme === "light"
                      ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                      : `bg-muted ${isHighContrast ? "text-white" : "text-muted-foreground"}`
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Claro</span>
                {theme === "light" && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setTheme("dark")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                      : `bg-muted ${isHighContrast ? "text-white" : "text-muted-foreground"}`
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Oscuro</span>
                {theme === "dark" && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>

              {/* High Contrast Mode */}
              <button
                onClick={() => setTheme("high-contrast")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "high-contrast"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    theme === "high-contrast"
                      ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                      : `bg-muted ${isHighContrast ? "text-black" : "text-muted-foreground"}`
                  }`}
                >
                  <Contrast className={`w-5 h-5 ${isHighContrast ? "text-black" : ""}`} />
                </div>
                <span className="font-medium text-sm text-center">Alto Contraste</span>
                {theme === "high-contrast" && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-5" />

          {/* Text Size Section */}
          <div>
            <h3 className="font-semibold text-lg mb-1">Tamaño de texto</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Ajusta el tamaño de texto en toda la app
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Normal */}
              <button
                onClick={() => setLargeText(false)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  !largeText
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    !largeText
                      ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                      : `bg-muted ${isHighContrast ? "text-white" : "text-muted-foreground"}`
                  }`}
                >
                  <Type className={`w-5 h-5 ${isHighContrast && !largeText ? "text-black" : ""}`} />
                </div>
                <div className="text-center">
                  <span className="font-medium text-sm block">Normal</span>
                  <span className="text-xs text-muted-foreground">Base 16px</span>
                </div>
                {!largeText && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>

              {/* Large */}
              <button
                onClick={() => setLargeText(true)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  largeText
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    largeText
                      ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                      : `bg-muted ${isHighContrast ? "text-white" : "text-muted-foreground"}`
                  }`}
                >
                  <Type className={`w-6 h-6 ${isHighContrast ? (largeText ? "text-black" : "text-white") : ""}`} />
                </div>
                <div className="text-center">
                  <span className="font-medium text-sm block">Grande</span>
                  <span className="text-xs text-muted-foreground">Base 20px</span>
                </div>
                {largeText && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mt-8 mb-5" />

          {/* Account Section: Sign Out */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg mb-1">Cuenta</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gestiona tu sesión activa
            </p>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-border mt-8 mb-5" />

          {/* Dangerous Section: Delete Account */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-destructive mb-1">Zona peligrosa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Esta acción es irreversible y borrará todos tus datos.
            </p>
            <button
              onClick={async () => {
                if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                  try {
                    const res = await fetch("/api/user/profile", { method: "DELETE" });
                    if (res.ok) {
                      // Usamos window.location para forzar un reinicio completo
                      window.location.href = "/";
                    } else {
                      alert("Error al eliminar la cuenta");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error al eliminar la cuenta");
                  }
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-destructive"
            >
              Eliminar mi cuenta definitivamente
            </button>
          </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-2 sm:px-4">
              <UserProfile 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full max-w-full",
                    cardBox: "w-full shadow-none border-none bg-transparent rounded-none m-0 max-w-full",
                    navbar: "hidden md:flex", // Hide Clerk's own sidebar on mobile to save space
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
