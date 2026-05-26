"use client";

import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavRoutes = ["/login", "/signup"];
  const showNav = !hideNavRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNav && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:p-3 focus:rounded-xl focus:z-[100] focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Saltar al contenido principal
        </a>
      )}
      {showNav && <TopAppBar />}
      <main id="main-content" tabIndex="-1" className={`flex-1 outline-none ${showNav ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
