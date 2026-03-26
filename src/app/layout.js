import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ClientLayout } from "@/components/layout/ClientLayout";

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
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
