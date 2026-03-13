"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const role =
      sessionStorage.getItem("hs_role") ?? localStorage.getItem("hs_role");
    if (role !== "employee") {
      router.replace("/");
    } else {
      setReady(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />

      <div className="flex-1 w-full min-w-0 flex flex-col">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-[#1a1a2e] flex items-center justify-between px-4 shadow-lg shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <MenuIcon />
          </button>
          <p className="text-white text-sm font-semibold tracking-[0.15em] uppercase">
            Employee &amp; Ops
          </p>
          <div className="w-8" />
        </div>

        <div className="lg:hidden h-14 shrink-0" />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
