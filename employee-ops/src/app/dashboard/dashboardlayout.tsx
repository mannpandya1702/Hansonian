"use client";

// AppShell in layout.tsx handles the sidebar + mobile top bar.
// This component simply passes children through.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}