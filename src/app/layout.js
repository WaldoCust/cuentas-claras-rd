import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/config/env";

// Perform mandatory configuration check on server boot
validateEnv();
import Sidebar from "@/components/Sidebar";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "CuentasClarasRD | Genera tu 606 sin estrés",
  description: "La forma más fácil de cumplir con la DGII. Sube tus facturas y genera tu reporte 606 automáticamente.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-outfit antialiased premium-gradient-bg min-h-screen text-foreground">
        {children}
      </body>
    </html>
  );
}
