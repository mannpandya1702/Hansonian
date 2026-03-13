"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("hs_role");
    localStorage.removeItem("hs_email");
    router.push("/");
  };

  return (
    <header className="bg-[#1a1a2e] text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-6">
          <h1 className="text-lg sm:text-xl font-bold tracking-wide">
            Hansonium Agentic OS
          </h1>
          <nav className="flex gap-2">
            <Link
              href="/admin"
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                pathname === "/admin"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/non-compliant"
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                pathname === "/admin/non-compliant"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Non-Compliant
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#4ade80] text-[#1a1a2e] px-3 py-1 rounded-full font-semibold text-xs">
            CEO
          </span>
          <span className="text-white/50 text-xs">Updated 5 mins ago</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("hs_role");
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a2e] overflow-x-hidden">
      <AdminNav />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 space-y-10">
        {children}
      </main>
    </div>
  );
}
