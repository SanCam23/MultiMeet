"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, Search, PlusCircle } from "lucide-react";
import Image from "next/image";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { useTheme } from "@/context/ThemeContext";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export function TopAppBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="w-full mx-auto max-w-[1440px]">
        <div className="px-6 md:px-8 lg:px-12 py-5 flex items-center gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="Ir al inicio de MultiMeet"
            >
              <Image
                src="/logo.png"
                alt="MultiMeet Logo"
                width={60}
                height={60}
                className="w-15 h-15 object-contain"
                priority
              />
              <h1 className="font-semibold font-['Poppins'] font-bold text-[26px] md:text-[28px] lg:text-[36px] text-logo-title whitespace-nowrap">
                MultiMeet.
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0"
            aria-label="Navegación principal"
          >
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                pathname === "/"
                  ? "text-primary bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                pathname === "/categories"
                  ? "text-primary bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Buscar</span>
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <PlusCircle className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Crear</span>
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <NotificationsPopover />
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
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Mi Panel de Control"
                      labelIcon={<User className="w-4 h-4" />}
                      href="/dashboard"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
