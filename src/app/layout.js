import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { UserSync } from "@/components/layout/UserSync";

const neuePower = localFont({
  src: "./fonts/NeuePower-Ultra.woff2",
  variable: "--font-neue-power",
  weight: "900",
  display: "swap",
});

export const metadata = {
  title: "MultiMeet - Conecta con tu comunidad",
  description:
    "Descubre y crea meetups, eventos y experiencias en tu ciudad. Conecta con gente que comparte tus intereses.",
  keywords: ["meetups", "eventos", "comunidad", "networking", "MultiMeet"],
  icons: {
    icon: "/logo.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={neuePower.variable}>
      <body className="antialiased">
        <ClerkProvider localization={esES}>
          <ThemeProvider>
            <UserSync>
              <ClientLayout>{children}</ClientLayout>
            </UserSync>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
