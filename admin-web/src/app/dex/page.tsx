'use client'

import { useState } from "react"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

// ── US.A2: DEX Compliance Tracker ──────────────────────────
const dexPeriods = [
  { period: "Q1 2026", due: "2026-04-30", sessions: 300, completed: 298, missing: 2, status: "submitted" as const },
  { period: "Q2 2026", due: "2026-07-31", sessions: 300, completed: 282, missing: 18, status: "in_progress" as const },
  { period: "Q3 2026", due: "2026-10-31", sessions: 0,   completed: 0,   missing: 0,  status: "upcoming" as const },
]

const missingScoreData = [
  { zone: "Zone 1", missing: 3, participant: "P-001 — John S." },
  { zone: "Zone 2", missing: 6, participant: "P-007 — Mary T." },
  { zone: "Zone 3", missing: 2, participant: "P-012 — David L." },
  { zone: "Zone 4", missing: 7, participant: "P-019 — Sarah K." },
]

const scoreTypes = [
  { label: "Circumstances", code: "CIRC", description: "Client's living situation and support environment", completed: 276, total: 300 },
  { label: "Goals",         code: "GOAL", description: "Progress toward individual care goals",             completed: 284, total: 300 },
  { label: "Satisfaction",  code: "SATI", description: "Client and family satisfaction rating (1–5)",       completed: 282, total: 300 },
]

const PERIOD_STATUS: Record<string, { label: string; cls: string }> = {
  submitted:   { label: "Submitted",   cls: "bg-[#4ade80]/15 text-[#16a34a] border border-[#4ade80]/30" },
  in_progress: { label: "In Progress", cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  upcoming:    { label: "Upcoming",    cls: "bg-[#f0ede6] text-[#4a4a6a] border border-[#e8e4dd]" },
}

export default function DEXCompliancePage() {
  const [now] = useState(() => Date.now())
  const [selectedPeriod, setSelectedPeriod] = useState("Q2 2026")
  const activePeriod = dexPeriods.find((p) => p.period === selectedPeriod) ?? dexPeriods[1]
  const complianceRate = activePeriod.sessions > 0
    ? Math.round((activePeriod.completed / activePeriod.sessions) * 100)
    : 0

  const daysUntilDue = Math.ceil(
    (new Date(activePeriod.due).getTime() - now) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a2e] pb-12">

      {/* Page header */}
      <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]"
          style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}
        >
          DEX Compliance Tracker
        </h1>
        <p className="text-sm text-[#4a4a6a] mt-1">
          Monitor DEX reporting periods, SCORE data completeness, and submission status
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-10 space-y-8">

        {/* Reporting period selector */}
        <section className="bg-white border border-[#e8e4dd] rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">Reporting Periods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dexPeriods.map((p) => {
              const meta = PERIOD_STATUS[p.status]
              const rate = p.sessions > 0 ? Math.round((p.completed / p.sessions) * 100) : 0
              return (
                <button
                  key={p.period}
                  onClick={() => setSelectedPeriod(p.period)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPeriod === p.period
                      ? "border-[#1a1a2e] bg-[#1a1a2e]/5"
                      : "border-[#e8e4dd] bg-[#faf9f7] hover:border-[#1a1a2e]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-[#1a1a2e]">{p.period}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a4a6a]">Due: {p.due}</p>
                  {p.sessions > 0 && (
                    <>
                      <div className="mt-2 h-1.5 bg-[#e8e4dd] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4ade80] rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#4a4a6a] mt-1">{rate}% complete · {p.missing} missing</p>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Active period detail */}
        {activePeriod.sessions > 0 && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Total Sessions", value: activePeriod.sessions.toString(), variant: "neutral" as const },
                { label: "Completed", value: activePeriod.completed.toString(), variant: "success" as const },
                { label: "Missing SCORE", value: activePeriod.missing.toString(), variant: activePeriod.missing > 10 ? "danger" as const : "warning" as const },
                { label: "Days Until Due", value: daysUntilDue > 0 ? `${daysUntilDue}d` : "Overdue", variant: daysUntilDue <= 14 ? "warning" as const : "neutral" as const },
              ].map(({ label, value, variant }) => {
                const valueCls = { neutral: "text-[#1a1a2e]", success: "text-[#16a34a]", danger: "text-[#dc2626]", warning: "text-[#b45309]" }[variant]
                const borderCls = { neutral: "border-[#1a1a2e]/15", success: "border-[#4ade80]/40", danger: "border-[#ef4444]/40", warning: "border-[#eab308]/40" }[variant]
                return (
                  <div key={label} className={`bg-white border-2 ${borderCls} p-4 rounded-xl`}>
                    <p className="text-xs text-[#4a4a6a]">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${valueCls}`} style={{ fontFamily: "var(--font-mono, monospace)" }}>{value}</p>
                  </div>
                )
              })}
            </div>

            {/* Overall progress bar */}
            <section className="bg-white border border-[#e8e4dd] rounded-2xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-[#1a1a2e]">Overall Compliance Rate</h2>
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-mono, monospace)" }}>{complianceRate}%</span>
              </div>
              <div className="h-3 bg-[#e8e4dd] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${complianceRate}%`,
                    background: complianceRate >= 95 ? "#4ade80" : complianceRate >= 80 ? "#eab308" : "#ef4444",
                  }}
                />
              </div>
              <p className="text-xs text-[#4a4a6a] mt-2">
                {activePeriod.missing} sessions still require SCORE data capture before {activePeriod.due}
              </p>
            </section>

            {/* SCORE breakdown */}
            <section className="bg-white border border-[#e8e4dd] rounded-2xl p-4 sm:p-6">
              <h2 className="text-base font-semibold text-[#1a1a2e] mb-5">SCORE Data Completeness</h2>
              <div className="space-y-5">
                {scoreTypes.map((st) => {
                  const pct = Math.round((st.completed / st.total) * 100)
                  return (
                    <div key={st.code}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-semibold text-[#1a1a2e]">{st.label}</span>
                          <span className="ml-2 text-[10px] font-mono bg-[#f0ede6] text-[#4a4a6a] px-1.5 py-0.5 rounded">{st.code}</span>
                          <p className="text-xs text-[#4a4a6a] mt-0.5">{st.description}</p>
                        </div>
                        <span className="text-sm font-bold text-[#1a1a2e] shrink-0 ml-4" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                          {st.completed}/{st.total}
                        </span>
                      </div>
                      <div className="h-2 bg-[#e8e4dd] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4ade80] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#4a4a6a] mt-1">{pct}% — {st.total - st.completed} sessions missing this SCORE type</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Missing SCORE by Zone */}
            <section className="bg-white border border-[#e8e4dd] rounded-2xl p-4 sm:p-6">
              <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">Missing SCORE Data by Zone</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={missingScoreData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid stroke="#e8e4dd" vertical={false} />
                      <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "#4a4a6a" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#4a4a6a" }} />
                      <Tooltip />
                      <Bar dataKey="missing" name="Missing Sessions" radius={[4, 4, 0, 0]}>
                        {missingScoreData.map((_, i) => (
                          <Cell key={i} fill={_.missing >= 6 ? "#ef4444" : _.missing >= 3 ? "#eab308" : "#4ade80"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e8e4dd] text-xs text-[#4a4a6a] uppercase tracking-wider">
                        <th className="pb-2 text-left font-semibold">Zone</th>
                        <th className="pb-2 text-left font-semibold">Missing</th>
                        <th className="pb-2 text-left font-semibold">Key Participant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e4dd]">
                      {missingScoreData.map((row) => (
                        <tr key={row.zone} className="hover:bg-[#faf9f7] transition-colors">
                          <td className="py-2.5 font-medium text-[#1a1a2e]">{row.zone}</td>
                          <td className="py-2.5">
                            <span className={`font-bold ${row.missing >= 6 ? "text-[#dc2626]" : row.missing >= 3 ? "text-[#b45309]" : "text-[#16a34a]"}`}>
                              {row.missing}
                            </span>
                          </td>
                          <td className="py-2.5 text-[#4a4a6a] text-xs">{row.participant}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {activePeriod.status === "upcoming" && (
          <div className="bg-white border border-[#e8e4dd] rounded-2xl p-8 text-center">
            <p className="text-[#4a4a6a] text-sm">This reporting period has not started yet.</p>
            <p className="text-xs text-[#b0a9a0] mt-1">Sessions will be tracked from the period start date.</p>
          </div>
        )}

      </div>
    </div>
  )
}
