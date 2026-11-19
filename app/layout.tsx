import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShirtNerdXL",
  description: "Bold, humorous, geeky graphic tees up to 5XL.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
