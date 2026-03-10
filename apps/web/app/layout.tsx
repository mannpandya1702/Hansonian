import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hansonium | Secure Portal Login",
  description:
    "Secure multi-role access to the Hansonium NDIS Care Management Platform. Login as CEO/Admin, Employee, or Family Member.",
  keywords: ["NDIS", "Hansonium", "care management", "portal login"],
  authors: [{ name: "Hansonium" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
