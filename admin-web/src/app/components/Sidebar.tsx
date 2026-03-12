"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─────────────────────────────────────────────
// SVG Icons (inline — no external deps needed)
// ─────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: HomeIcon, description: "Financial pulse overview" },
  { label: "DEX Compliance", path: "/dex", icon: ShieldIcon, description: "Reporting tracker" },
  { label: "Strategic Alerts", path: "/alerts", icon: BellIcon, description: "Risk & incident feed" },
  { label: "Non-Compliant", path: "/non-compliant", icon: AlertIcon, description: "Session issues" },
];

export function AdminSidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem("hs_role");
    sessionStorage.removeItem("hs_name");
    sessionStorage.removeItem("hs_email");
    window.location.href = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:3000";
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-white">
      {/* Logo + close button */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-white">HANSONIUM</p>
          <div className="mt-1 h-[2px] w-7 bg-[#4ade80] rounded-full" />
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors lg:hidden">
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-6 mb-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#4ade80]/15 text-[#4ade80] px-2.5 py-1 rounded-full border border-[#4ade80]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          CEO / Admin
        </span>
      </div>

      {/* Nav section */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ label, path, icon: Icon, description }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/6 hover:text-white"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-[#4ade80]" : "text-white/40 group-hover:text-white/70"}`}>
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{label}</p>
                <p className="text-[10px] text-white/35 truncate">{description}</p>
              </div>
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#4ade80] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 pb-6 pt-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#4ade80]/20 border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80] text-xs font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin User</p>
            <p className="text-[10px] text-white/40 truncate">CEO Portal</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-white/50 hover:text-white hover:bg-white/6 rounded-xl transition-all text-sm"
        >
          <LogoutIcon />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Responsive Sidebar Wrapper ──────────────────────────────
export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1a1a2e] flex items-center justify-between px-4 shadow-lg">
        <button onClick={() => setOpen(true)} className="text-white/70 hover:text-white transition-colors">
          <MenuIcon />
        </button>
        <p className="text-white text-sm font-semibold tracking-[0.15em] uppercase">HANSONIUM</p>
        <div className="w-8" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebarContent onClose={() => setOpen(false)} />
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 shrink-0">
        <AdminSidebarContent />
      </aside>
    </>
  );
}
