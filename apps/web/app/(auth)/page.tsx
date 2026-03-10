"use client";

import { useState } from "react";

// ============================================================
// HANSONIUM — UNIFIED LOGIN GATEWAY
// Role-based portal access: Admin | Employee | Family
// Production-ready: update PORTAL_URLS env vars for deployment
// ============================================================

const PORTAL_URLS = {
  admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://hansonianadminfinal.vercel.app/",
  employee: process.env.NEXT_PUBLIC_EMPLOYEE_URL ?? "https://hansonianemployeefinal.vercel.app/",
  family: process.env.NEXT_PUBLIC_FAMILY_URL ?? "https://hansonian-family-final.vercel.app/",
};

// Demo credentials — replace with Firebase Auth in production
const DEMO_USERS: Record<string, { password: string; role: "admin" | "employee" | "family"; name: string }> = {
  "admin@hansonium.com.au": { password: "admin123", role: "admin", name: "CEO / Admin" },
  "employee@hansonium.com.au": { password: "employee123", role: "employee", name: "Employee" },
  "family@hansonium.com.au": { password: "family123", role: "family", name: "Family Member" },
};

const ROLE_META = {
  admin: {
    label: "CEO / Admin",
    description: "Financial pulse, DEX compliance & strategic alerts",
    badgeCls: "bg-[#4ade80]/15 text-[#16a34a] border border-[#4ade80]/40",
  },
  employee: {
    label: "Employee",
    description: "Rostering, compliance vault & session review",
    badgeCls: "bg-[#1a1a2e]/10 text-[#1a1a2e] border border-[#1a1a2e]/20",
  },
  family: {
    label: "Family / Participant",
    description: "Budget monitor, visit feed & caregiver ratings",
    badgeCls: "bg-[#e8e4dd] text-[#4a4a6a] border border-[#d0ccc4]",
  },
} as const;

// Simple inline SVG icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default function LoginGateway() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated async — replace with Firebase signInWithEmailAndPassword
    await new Promise((r) => setTimeout(r, 500));

    const user = DEMO_USERS[email.toLowerCase().trim()];
    if (!user || user.password !== password) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Store lightweight session — replace with Firebase ID token in production
    sessionStorage.setItem("hs_role", user.role);
    sessionStorage.setItem("hs_name", user.name);
    sessionStorage.setItem("hs_email", email.toLowerCase().trim());

    window.location.href = PORTAL_URLS[user.role];
  };

  const fillDemo = (role: "admin" | "employee" | "family") => {
    const entry = Object.entries(DEMO_USERS).find(([, v]) => v.role === role);
    if (entry) { setEmail(entry[0]); setPassword(entry[1].password); }
    setShowDemo(false);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left hero panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-[#1a1a2e] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
        {/* Decorative grid + circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#4ade80]/6" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#4ade80]/5" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <p className="text-white text-xl font-semibold tracking-[0.2em] uppercase">HANSONIUM</p>
          <div className="mt-2 h-[2px] w-10 bg-[#4ade80] rounded-full" />
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-[2.6rem] font-semibold text-white leading-snug" style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}>
              Intelligent NDIS
              <br />Care Management
            </h1>
            <p className="mt-4 text-white/55 text-base leading-relaxed max-w-sm">
              Australia&apos;s compliance-first platform — real-time oversight, participant transparency, and automated DEX reporting.
            </p>
          </div>

          {/* Portal cards */}
          <div className="space-y-2.5">
            {(["admin", "employee", "family"] as const).map((role) => (
              <button
                key={role}
                onClick={() => fillDemo(role)}
                className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/9 hover:border-white/20 transition-all text-left group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{ROLE_META[role].label}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{ROLE_META[role].description}</p>
                </div>
                <ArrowIcon />
              </button>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/25 text-xs">
          © {new Date().getFullYear()} Hansonium Pty Ltd · NDIS-compliant platform
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#faf9f7] min-h-screen lg:min-h-0 px-5 py-10 sm:px-10">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <p className="text-[#1a1a2e] text-xl font-semibold tracking-[0.2em] uppercase">HANSONIUM</p>
          <div className="mt-1.5 h-[2px] w-8 bg-[#4ade80] rounded-full mx-auto" />
        </div>

        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[2rem] font-semibold text-[#1a1a2e] leading-tight" style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}>
              Welcome back
            </h2>
            <p className="mt-2 text-[#4a4a6a] text-sm">Sign in to access your Hansonium portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@hansonium.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a9a0] hover:text-[#4a4a6a] transition-colors p-1"
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-[#c0392b] bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                <span className="shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1a1a2e] hover:bg-[#252540] disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LockIcon />
                  Sign In Securely
                </>
              )}
            </button>
          </form>

          {/* Demo credentials toggle */}
          <div className="mt-5">
            <button
              onClick={() => setShowDemo((v) => !v)}
              className="w-full text-center text-xs text-[#4a4a6a] hover:text-[#1a1a2e] transition-colors underline underline-offset-2 decoration-[#d0ccc4]"
            >
              {showDemo ? "Hide" : "View"} demo credentials
            </button>

            {showDemo && (
              <div className="mt-3 bg-[#f0ede6] border border-[#e8e4dd] rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-widest mb-3">
                  Click any row to auto-fill
                </p>
                {(["admin", "employee", "family"] as const).map((role) => {
                  const entry = Object.entries(DEMO_USERS).find(([, v]) => v.role === role);
                  if (!entry) return null;
                  return (
                    <button
                      key={role}
                      onClick={() => fillDemo(role)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-[#e8e4dd] rounded-lg hover:border-[#1a1a2e]/30 hover:shadow-sm transition-all group text-left"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#1a1a2e]">{ROLE_META[role].label}</p>
                        <p className="text-[10px] text-[#4a4a6a] mt-0.5" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                          {entry[0]} · {entry[1].password}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${ROLE_META[role].badgeCls}`}>
                        {role}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Request access */}
          <div className="mt-6 pt-5 border-t border-[#e8e4dd] text-center">
            <p className="text-xs text-[#4a4a6a]">
              New to Hansonium?{" "}
              <a href="/register" className="font-semibold text-[#1a1a2e] hover:underline underline-offset-2">
                Request portal access
              </a>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#b0a9a0]">
            <LockIcon />
            <span>TLS 1.3 encrypted · NDIS-compliant data handling · Australia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
