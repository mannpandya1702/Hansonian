"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const NAV_ITEMS = [
  { name: "Dashboard",         path: "/employee/dashboard",  icon: HomeIcon,      description: "Workforce overview" },
  { name: "Agentic Rostering", path: "/employee/rostering",  icon: CalendarIcon,  description: "Auto-fill roster" },
  { name: "Compliance Vault",  path: "/employee/compliance", icon: ShieldIcon,    description: "Credential expiry" },
  { name: "Session Review",     path: "/employee/dex-audit",  icon: ClipboardIcon, description: "Approve sessions" },
  { name: "Staff Directory",   path: "/employee/staff",      icon: UsersIcon,     description: "Employee registry" },
];

export default function Sidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("hs_role");
    localStorage.removeItem("hs_email");
    router.push("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-64 z-50
          bg-[#1a1a2e] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-white">HANSONIUM</p>
            <div className="mt-1 h-[2px] w-7 bg-[#4ade80] rounded-full" />
          </div>
          <button onClick={closeSidebar} className="text-white/50 hover:text-white transition-colors lg:hidden">
            <CloseIcon />
          </button>
        </div>

        <div className="px-6 mb-5 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/80 px-2.5 py-1 rounded-full border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            Employee &amp; Ops
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ name, path, icon: Icon, description }) => {
            const isActive = pathname === path || pathname.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/6 hover:text-white"
                }`}
              >
                <span className={`shrink-0 ${isActive ? "text-[#4ade80]" : "text-white/40 group-hover:text-white/70"}`}>
                  <Icon />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-[10px] text-white/30 truncate">{description}</p>
                </div>
                {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-[#4ade80] shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-4 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              E
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Employee User</p>
              <p className="text-[10px] text-white/40 truncate">Ops Portal</p>
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
      </aside>
    </>
  );
}
