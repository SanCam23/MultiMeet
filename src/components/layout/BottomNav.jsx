"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Search, label: "Buscar", path: "/categories" },
    { icon: PlusCircle, label: "Crear", path: "/upload", isPrimary: true },
    { icon: User, label: "Perfil", path: "/dashboard" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg"
      aria-label="Navegación móvil"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-8 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
                aria-label={item.label}
              >
                <div className="w-14 h-14 -mt-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs text-primary font-medium mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-1"
              aria-label={item.label}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
