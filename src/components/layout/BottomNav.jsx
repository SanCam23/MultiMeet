"use client";
 
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { Show, SignInButton, useUser } from "@clerk/nextjs";
 
export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
 
  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Search, label: "Buscar", path: "/categories" },
    { icon: PlusCircle, label: "Crear", path: "/upload" },
    { icon: User, label: "Perfil", path: "/dashboard" },
  ];
 
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg"
      aria-label="Navegación móvil"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-8 pt-2 pb-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
 

          return (
            <React.Fragment key={item.path}>
              {item.label === "Perfil" ? (
                <>
                  <Show when="signed-in">
                    <Link
                      href={item.path}
                      className="flex flex-col items-center focus:outline-none rounded-lg"
                      aria-label={item.label}
                    >
                      {user?.imageUrl ? (
                        <div className={`w-9 h-9 rounded-full overflow-hidden border-2 shadow-sm ${isActive ? "border-primary" : "border-border"}`}>
                          <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${isActive ? "border-primary bg-primary/10" : "border-border bg-muted"}`}>
                          <Icon
                            className={`w-5 h-5 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </Link>
                  </Show>
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button
                        className="flex flex-col items-center gap-1 focus:outline-none rounded-lg p-1"
                        aria-label="Iniciar Sesión"
                      >
                        <User
                          className={`w-6 h-6 text-muted-foreground`}
                          aria-hidden="true"
                        />
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          Entrar
                        </span>
                      </button>
                    </SignInButton>
                  </Show>
                </>
              ) : (
                <Link
                  href={item.path}
                  className="flex flex-col items-center gap-1 focus:outline-none rounded-lg p-1"
                  aria-label={item.label}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[10px] ${
                      isActive ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
