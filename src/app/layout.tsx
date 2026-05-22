import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PWARegister from "@/components/pwa/PWARegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "DocuSafe", template: "%s — DocuSafe" },
  description: "Almacena y organiza tus documentos de forma segura",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-32x32.png",
    apple: [{ url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DocuSafe" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icons/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWARegister />
        {children}
        <footer className="text-center text-xs text-slate-500 py-3 border-t border-slate-200 bg-white/90">
          © {year} Kolectiv. Todos los derechos reservados. DocuSafe es propiedad de Kolectiv.
        </footer>
      </body>
    </html>
  );
}
