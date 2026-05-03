"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, Search, PlusCircle } from "lucide-react";
import Image from "next/image";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { useTheme } from "@/context/ThemeContext";
import { Show, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export function TopAppBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user } = useUser();
  const isHighContrast = theme === "high-contrast";

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="w-full mx-auto max-w-[1440px]">
        <div className="px-4 md:px-6 lg:px-12 py-3 md:py-5 flex items-center gap-2 md:gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 basis-0 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="Ir al inicio de MultiMeet"
            >
              <img
                src="/logo.png"
                alt="MultiMeet Logo"
                className="w-14 h-14 object-contain bg-transparent"
              />
              <h1 className="font-bold text-[28px] md:text-[32px] lg:text-[36px] text-logo-title whitespace-nowrap" style={{ fontFamily: "var(--font-neue-power)" }}>
                MultiMeet.
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-3 lg:gap-8 shrink-0"
            aria-label="Navegación principal"
          >
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                pathname === "/"
                  ? "text-primary bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title="Inicio"
            >
              <Home className="w-6 h-6" aria-hidden="true" />
              <span className="font-medium hidden lg:inline">Inicio</span>
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                pathname === "/categories"
                  ? "text-primary bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title="Buscar"
            >
              <Search className="w-6 h-6" aria-hidden="true" />
              <span className="font-medium hidden lg:inline">Buscar</span>
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              title="Crear"
            >
              <PlusCircle className="w-6 h-6" aria-hidden="true" />
              <span className="font-medium hidden lg:inline">Crear</span>
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 basis-0 justify-end">
            <Show when="signed-in">
              <NotificationsPopover />
            </Show>
            <div className="hidden md:flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className={`px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring font-medium ${isHighContrast ? "text-yellow-300" : "text-muted-foreground hover:text-foreground"}`}>
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className={`px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring font-medium`}>
                    Registrarse
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Ir a mi perfil"
                >
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Avatar" className="w-9 h-9 object-cover" />
                  ) : (
                    <div className="w-9 h-9 bg-muted flex items-center justify-center text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </Link>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
