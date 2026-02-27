"use client";

import { useState } from "react";

const ROLES = [
  { value: "admin", label: "CEO / Admin", description: "Executive dashboard and compliance oversight" },
  { value: "employee", label: "Employee / Operations", description: "Rostering, compliance vault and DEX audit" },
  { value: "family", label: "Family / Participant", description: "Budget tracking and caregiver transparency" },
] as const;

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!role) { setError("Please select a portal role."); return; }
    setLoading(true);

    // Simulate API call — replace with actual Firebase Cloud Function or API endpoint
    await new Promise((r) => setTimeout(r, 800));

    // In production, POST to /api/register or Firebase function:
    // await fetch('/api/register', { method: 'POST', body: JSON.stringify({ firstName, lastName, email, organisation, role, message }) })

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#4ade80]/20 border-2 border-[#4ade80]/40 flex items-center justify-center text-[#16a34a]">
            <CheckIcon />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1a1a2e]" style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}>
              Request Submitted
            </h2>
            <p className="mt-2 text-[#4a4a6a] text-sm leading-relaxed">
              Thank you, <strong>{firstName}</strong>. Your access request has been sent to the Hansonium admin team. You&apos;ll receive an email at <strong>{email}</strong> once your account is approved.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#252540] transition-all"
          >
            <BackIcon />
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[500px]">

        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-1 text-sm text-[#4a4a6a] hover:text-[#1a1a2e] transition-colors mb-6">
          <BackIcon />
          Back to Login
        </a>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#1a1a2e] text-lg font-semibold tracking-[0.15em] uppercase">HANSONIUM</p>
          <div className="mt-1.5 h-[2px] w-8 bg-[#4ade80] rounded-full" />
          <h1 className="mt-5 text-3xl font-semibold text-[#1a1a2e]" style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}>
            Request Portal Access
          </h1>
          <p className="mt-2 text-[#4a4a6a] text-sm">
            Fill in the form below. The admin team will review your request and provide credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Jane"
                className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Smith"
                className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Work email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jane@organisation.com.au"
              className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
            />
          </div>

          {/* Organisation */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Organisation</label>
            <input
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              required
              placeholder="Hansonian Care Services"
              className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm"
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Portal access requested</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                    role === r.value
                      ? "bg-[#1a1a2e]/5 border-[#1a1a2e]/30"
                      : "bg-white border-[#e8e4dd] hover:border-[#1a1a2e]/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="mt-0.5 accent-[#1a1a2e]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e]">{r.label}</p>
                    <p className="text-xs text-[#4a4a6a] mt-0.5">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Additional context <span className="text-[#b0a9a0] font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Briefly describe your role and why you need access…"
              className="w-full px-4 py-3 border border-[#e8e4dd] rounded-xl bg-white text-[#1a1a2e] placeholder:text-[#b0a9a0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 focus:border-[#1a1a2e]/50 transition-all text-sm resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-[#c0392b] bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1a1a2e] hover:bg-[#252540] disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Access Request"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#b0a9a0]">
          By submitting you agree to Hansonium&apos;s data handling practices in accordance with the Australian Privacy Act 1988.
        </p>
      </div>
    </div>
  );
}
