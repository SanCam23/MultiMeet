import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { UserSync } from "@/components/layout/UserSync";

export const metadata = {
  title: "MultiMeet - Conecta con tu comunidad",
  description:
    "Descubre y crea meetups, eventos y experiencias en tu ciudad. Conecta con gente que comparte tus intereses.",
  keywords: ["meetups", "eventos", "comunidad", "networking", "MultiMeet"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ClerkProvider 
          localization={esES}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ThemeProvider>
            <UserSync />
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
