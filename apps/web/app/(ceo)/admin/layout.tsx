"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role =
      sessionStorage.getItem("hs_role") ?? localStorage.getItem("hs_role");
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex h-full min-h-screen bg-[#faf9f7] text-[#1a1a2e] overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden h-14 shrink-0" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
