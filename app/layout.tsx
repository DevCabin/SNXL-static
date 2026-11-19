import type { Metadata } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shirtnerdxl.com"
  ),
  title: {
    default: "ShirtNerdXL — Bold Graphic Tees up to 5XL",
    template: "%s | ShirtNerdXL",
  },
  description:
    "Bold, humorous, geeky graphic T-shirts in sizes up to 5XL. Browse the catalog, pick your size and color, and send a request — no payment collected online.",
  openGraph: {
    siteName: "ShirtNerdXL",
    type: "website",
    title: "ShirtNerdXL — Bold Graphic Tees up to 5XL",
    description:
      "Bold, humorous, geeky graphic T-shirts in sizes up to 5XL. Request-based ordering, no payment collected online.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <AnnouncementBar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
