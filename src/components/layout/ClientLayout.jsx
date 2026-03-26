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
      {showNav && <TopAppBar />}
      <main className={`flex-1 ${showNav ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
