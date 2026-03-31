import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { auth, currentUser } from "@clerk/nextjs/server";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ClientLayout } from "@/components/layout/ClientLayout";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export const metadata = {
  title: "MultiMeet - Conecta con tu comunidad",
  description:
    "Descubre y crea meetups, eventos y experiencias en tu ciudad. Conecta con gente que comparte tus intereses.",
  keywords: ["meetups", "eventos", "comunidad", "networking", "MultiMeet"],
};

export default async function RootLayout({ children }) {
  // Sincronización automática Global (Upsert)
  try {
    const { userId } = await auth();
    if (userId) {
      await connectToDatabase();
      let dbUser = await User.findOne({ clerkId: userId });
      
      if (!dbUser) {
        const clerkUser = await currentUser();
        if (clerkUser) {
          await User.create({
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Usuario sin nombre",
            avatar: clerkUser.imageUrl || "",
          });
          console.log("Usuario sincronizado exitosamente en MongoDB desde el Layout global!");
        }
      }
    }
  } catch (error) {
    console.error("Error sincronizando Clerk con MongoDB en layout:", error);
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ClerkProvider localization={esES}>
          <ThemeProvider>
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
