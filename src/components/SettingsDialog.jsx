"use client";

import { useEffect } from "react";
import { X, Moon, Sun, Eye, Type, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";

export function SettingsDialog({ open, onOpenChange }) {
  const { theme, setTheme, largeText, setLargeText } = useTheme();

  // Bloqueo de scroll al abrir
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fondo borroso/oscuro */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Contenido del modal */}
      <div 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="settings-title"
        className="relative w-full max-w-lg bg-card border border-border shadow-2xl p-6 sm:p-8 rounded-3xl m-4 md:m-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Cerrar ajustes"
        >
          <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </button>

        <h2 id="settings-title" className="text-2xl font-bold mb-8">Ajustes y Accesibilidad</h2>

        <div className="space-y-8">
          {/* Apariencia / Temas */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
               Apariencia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "light" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                aria-pressed={theme === "light"}
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 shadow-sm relative">
                  <Sun className="w-5 h-5" />
                  {theme === "light" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Claro</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "dark" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                aria-pressed={theme === "dark"}
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-slate-900 flex items-center justify-center text-slate-100 border border-slate-800 shadow-sm relative">
                  <Moon className="w-5 h-5" />
                  {theme === "dark" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Oscuro</span>
              </button>

              <button
                onClick={() => setTheme("high-contrast")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === "high-contrast" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                aria-pressed={theme === "high-contrast"}
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-black flex items-center justify-center text-yellow-500 border-2 border-yellow-500 shadow-sm relative">
                  <Eye className="w-5 h-5" />
                  {theme === "high-contrast" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Alto Contraste</span>
              </button>
            </div>
          </section>

          {/* Tamaño de texto */}
          <section>
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Type className="w-5 h-5 text-primary" aria-hidden="true" />
                 Tamaño de texto
              </h3>
              <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Texto grande</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">Aumenta el tamaño base de las fuentes</p>
                </div>
                
                <button
                  role="switch"
                  aria-checked={largeText}
                  onClick={() => setLargeText(!largeText)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card ${
                    largeText ? 'bg-primary' : 'bg-switch-background'
                  }`}
                >
                  <span className="sr-only">Habilitar texto grande</span>
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      largeText ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
          </section>

          <Button 
            className="w-full h-12 rounded-xl mt-4" 
            onClick={() => onOpenChange(false)}
          >
            Guardar y Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
