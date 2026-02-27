import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import AppShell from "./appshell";

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
  title: "Hansonium — Employee & Operations Hub",
  description: "Agentic rostering, compliance vault, DEX audit lab and staff directory.",
  keywords: ["NDIS", "employee portal", "compliance", "DEX audit", "rostering"],
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
      className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable} h-full`}
    >
      <body className="antialiased bg-[#faf9f7] text-[#1a1a2e] h-full overflow-x-hidden">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}