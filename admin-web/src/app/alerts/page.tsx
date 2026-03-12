'use client'

import { useState } from "react"

// ── US.A3: Strategic Alerts ─────────────────────────────────
// Objective metrics only: incidents, missed sessions,
// credential expiries, DEX deadlines. No subjective wellness.
type Severity = "critical" | "high" | "medium" | "low"

interface Alert {
  id: number
  title: string
  severity: Severity
  zone: string
  category: "incident" | "compliance" | "staffing" | "credential"
  description: string
  trend: string
  timestamp: string
  status: "open" | "acknowledged" | "resolved"
  clientsAffected: number
}

const ALERTS_DATA: Alert[] = [
  {
    id: 1,
    title: "Missed Medication Support — Zone 4",
    severity: "critical",
    zone: "Zone 4",
    category: "incident",
    description: "Medication support not delivered in 3 consecutive sessions for Participant P-019 (Sarah K.). NDIS incident report lodged. Immediate coordinator follow-up required.",
    trend: "3 consecutive missed sessions",
    timestamp: "2026-02-27 09:14",
    status: "open",
    clientsAffected: 1,
  },
  {
    id: 2,
    title: "Overtime Threshold Exceeded — Zone 2",
    severity: "high",
    zone: "Zone 2",
    category: "staffing",
    description: "4 support workers have exceeded SCHADS contracted hours this month. Review rostering to prevent service disruption and award breach.",
    trend: "+18% hours above contracted",
    timestamp: "2026-02-26 14:30",
    status: "acknowledged",
    clientsAffected: 8,
  },
  {
    id: 3,
    title: "DEX Submission Deadline — Zone 1",
    severity: "high",
    zone: "Zone 1",
    category: "compliance",
    description: "8 sessions are missing mandatory SCORE documentation. DEX submission deadline is in 12 days — immediate field follow-up required to avoid non-compliance.",
    trend: "8 sessions at risk",
    timestamp: "2026-02-25 08:45",
    status: "open",
    clientsAffected: 8,
  },
  {
    id: 4,
    title: "Credential Expiry — Zone 3",
    severity: "medium",
    zone: "Zone 3",
    category: "credential",
    description: "2 staff members in Zone 3 have credentials expiring within 30 days (NDIS Screening, First Aid). Service delivery will be suspended if not renewed.",
    trend: "2 credentials expiring in <30 days",
    timestamp: "2026-02-25 11:00",
    status: "open",
    clientsAffected: 4,
  },
  {
    id: 5,
    title: "Caregiver Incident Report — Zone 2",
    severity: "medium",
    zone: "Zone 2",
    category: "incident",
    description: "A caregiver submitted an incident report via the mobile app citing a hazard at a participant's home (wet floor, fall risk). Admin follow-up pending.",
    trend: "Safety escalation",
    timestamp: "2026-02-24 16:20",
    status: "acknowledged",
    clientsAffected: 1,
  },
  {
    id: 6,
    title: "Low Session Rating — Zone 1",
    severity: "low",
    zone: "Zone 1",
    category: "incident",
    description: "Participant P-003 rated their last 2 sessions at 1 star. Per the Feedback Escalation Policy, this has been automatically flagged for coordinator review.",
    trend: "2x consecutive 1-star ratings",
    timestamp: "2026-02-23 10:15",
    status: "resolved",
    clientsAffected: 1,
  },
]

const SEVERITY_META: Record<Severity, { label: string; cls: string; border: string; dot: string }> = {
  critical: { label: "Critical", cls: "bg-red-50 text-red-700 border border-red-200",    border: "border-l-red-600",    dot: "bg-red-500" },
  high:     { label: "High",     cls: "bg-orange-50 text-orange-700 border border-orange-200", border: "border-l-orange-500", dot: "bg-orange-500" },
  medium:   { label: "Medium",   cls: "bg-yellow-50 text-yellow-700 border border-yellow-200", border: "border-l-yellow-500", dot: "bg-yellow-500" },
  low:      { label: "Low",      cls: "bg-[#4ade80]/10 text-[#16a34a] border border-[#4ade80]/30", border: "border-l-[#4ade80]", dot: "bg-[#4ade80]" },
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  open:         { label: "Open",         cls: "bg-red-50 text-red-600 border border-red-100" },
  acknowledged: { label: "Acknowledged", cls: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
  resolved:     { label: "Resolved",     cls: "bg-[#4ade80]/10 text-[#16a34a] border border-[#4ade80]/30" },
}

const CATEGORY_LABELS: Record<string, string> = {
  incident:   "Incident",
  compliance: "Compliance",
  staffing:   "Staffing",
  credential: "Credential",
}

export default function StrategicAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS_DATA)
  const [severityFilter, setSeverityFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = alerts.filter((a) => {
    const matchSev = severityFilter === "All" || a.severity === severityFilter.toLowerCase()
    const matchStat = statusFilter === "All" || a.status === statusFilter.toLowerCase()
    return matchSev && matchStat
  })

  const acknowledge = (id: number) =>
    setAlerts((prev) => prev.map((a) => (a.id === id && a.status === "open" ? { ...a, status: "acknowledged" } : a)))

  const resolve = (id: number) =>
    setAlerts((prev) => prev.map((a) => (a.id === id && a.status !== "resolved" ? { ...a, status: "resolved" } : a)))

  const openCount   = alerts.filter((a) => a.status === "open").length
  const critCount   = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length
  const highCount   = alerts.filter((a) => a.severity === "high" && a.status !== "resolved").length
  const resolvedPct = Math.round((alerts.filter((a) => a.status === "resolved").length / alerts.length) * 100)

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a2e] pb-12">

      {/* Page header */}
      <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]"
          style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}
        >
          Strategic Alerts
        </h1>
        <p className="text-sm text-[#4a4a6a] mt-1">
          Incidents, missed sessions, credential expiries &amp; DEX submission deadlines
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-10 space-y-6">

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Open Alerts",    value: openCount.toString(),   variant: openCount > 0 ? "danger" : "success" },
            { label: "Critical",       value: critCount.toString(),    variant: critCount > 0 ? "danger" : "success" },
            { label: "High Priority",  value: highCount.toString(),    variant: highCount > 0 ? "warning" : "success" },
            { label: "Resolved Rate",  value: `${resolvedPct}%`,       variant: resolvedPct >= 50 ? "success" : "warning" },
          ].map(({ label, value, variant }) => {
            const valueCls   = { danger: "text-[#dc2626]", warning: "text-[#b45309]", success: "text-[#16a34a]", neutral: "text-[#1a1a2e]" }[variant as string] ?? "text-[#1a1a2e]"
            const borderCls  = { danger: "border-[#ef4444]/40", warning: "border-[#eab308]/40", success: "border-[#4ade80]/40", neutral: "border-[#1a1a2e]/15" }[variant as string] ?? "border-[#1a1a2e]/15"
            return (
              <div key={label} className={`bg-white border-2 ${borderCls} p-4 rounded-xl`}>
                <p className="text-xs text-[#4a4a6a]">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${valueCls}`} style={{ fontFamily: "var(--font-mono, monospace)" }}>{value}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Critical", "High", "Medium", "Low"].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === s
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white border border-[#e8e4dd] text-[#4a4a6a] hover:border-[#1a1a2e]/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Open", "Acknowledged", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white border border-[#e8e4dd] text-[#4a4a6a] hover:border-[#1a1a2e]/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white border border-[#e8e4dd] rounded-2xl p-8 text-center">
              <p className="text-[#4a4a6a] text-sm">No alerts match the current filters.</p>
            </div>
          )}
          {filtered.map((alert) => {
            const sevMeta  = SEVERITY_META[alert.severity]
            const statMeta = STATUS_META[alert.status]
            const isOpen   = expanded === alert.id

            return (
              <div
                key={alert.id}
                className={`bg-white border border-[#e8e4dd] rounded-xl overflow-hidden border-l-4 ${sevMeta.border}`}
              >
                {/* Header row */}
                <button
                  className="w-full px-4 sm:px-6 py-4 flex items-start sm:items-center justify-between gap-4 hover:bg-[#faf9f7] transition-colors text-left"
                  onClick={() => setExpanded(isOpen ? null : alert.id)}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full mt-1.5 sm:mt-0 shrink-0 ${sevMeta.dot}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1a1a2e] truncate">{alert.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${sevMeta.cls}`}>
                          {sevMeta.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${statMeta.cls}`}>
                          {statMeta.label}
                        </span>
                        <span className="text-[10px] text-[#b0a9a0]">{alert.zone}</span>
                        <span className="text-[10px] text-[#b0a9a0]">·</span>
                        <span className="text-[10px] text-[#b0a9a0]">{CATEGORY_LABELS[alert.category]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-[#b0a9a0] hidden sm:block">{alert.timestamp}</span>
                    <span className="text-[#4a4a6a] text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 border-t border-[#e8e4dd] bg-[#faf9f7]">
                    <div className="pt-4 space-y-3">
                      <p className="text-sm text-[#4a4a6a] leading-relaxed">{alert.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span><span className="font-semibold text-[#1a1a2e]">Clients Affected:</span> {alert.clientsAffected}</span>
                        <span><span className="font-semibold text-[#1a1a2e]">Trend:</span> {alert.trend}</span>
                        <span><span className="font-semibold text-[#1a1a2e]">Logged:</span> {alert.timestamp}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {alert.status === "open" && (
                          <button
                            onClick={() => acknowledge(alert.id)}
                            className="px-4 py-2 text-xs font-semibold border border-[#1a1a2e]/20 rounded-lg text-[#1a1a2e] hover:bg-[#1a1a2e]/5 transition-all"
                          >
                            Acknowledge
                          </button>
                        )}
                        {alert.status !== "resolved" && (
                          <button
                            onClick={() => resolve(alert.id)}
                            className="px-4 py-2 text-xs font-semibold bg-[#1a1a2e] text-white rounded-lg hover:bg-[#252540] transition-all"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {alert.status === "resolved" && (
                          <span className="text-xs text-[#16a34a] font-semibold">✓ Resolved</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
