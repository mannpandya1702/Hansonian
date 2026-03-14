'use client'

import Link from "next/link"
import { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

/* ============================= */
/* DATA */
/* ============================= */

const financialData = [
  { month: "Jan", revenue: 450000, labor: 360000, pending: 42000 },
  { month: "Feb", revenue: 520000, labor: 390000, pending: 38000 },
  { month: "Mar", revenue: 610000, labor: 470000, pending: 45000 },
  { month: "Apr", revenue: 700000, labor: 560000, pending: 41000 },
]

const totalRevenue = financialData.reduce((s, i) => s + i.revenue, 0)
const totalLabor = financialData.reduce((s, i) => s + i.labor, 0)
const totalPending = financialData.reduce((s, i) => s + i.pending, 0)
const netMargin = ((totalRevenue - totalLabor) / totalRevenue) * 100

const dexChartData = [
  { category: "Completed", sessions: 282 },
  { category: "Missing", sessions: 18 },
]

const alertsData = [
  {
    id: 1,
    title: "Missed Medication Support – Zone 4",
    severity: "high",
    zone: "Zone 4",
    description: "Medication support not delivered in 3 consecutive sessions. Incident report filed.",
    trend: "3 consecutive missed sessions",
  },
  {
    id: 2,
    title: "Overtime Threshold Exceeded – Zone 2",
    severity: "medium",
    zone: "Zone 2",
    description: "4 staff members have exceeded contracted hours this month. Review rostering.",
    trend: "+18% hours above contracted",
  },
  {
    id: 3,
    title: "DEX Documentation Gap – Zone 1",
    severity: "low",
    zone: "Zone 1",
    description: "8 sessions missing mandatory SCORE documentation before DEX submission deadline.",
    trend: "8 sessions at risk",
  },
]

const zoneRiskData = [
  { name: "Zone 1", value: 1 },
  { name: "Zone 2", value: 2 },
  { name: "Zone 4", value: 4 },
]

// ── Predictive Revenue Forecast (G4 agent outputs) ──────────────────────────
// TODO: Replace with live G4 agent query via data-connector /analytics/forecast
const forecastData = [
  { month: "Jan", actual: 450000, forecast: null },
  { month: "Feb", actual: 520000, forecast: null },
  { month: "Mar", actual: 610000, forecast: null },
  { month: "Apr", actual: 700000, forecast: null },
  { month: "May", actual: null,   forecast: 748000 },
  { month: "Jun", actual: null,   forecast: 802000 },
  { month: "Jul", actual: null,   forecast: 861000 },
]

// ── G5 Risk Intelligence ─────────────────────────────────────────────────────
// TODO: Replace with live G5 risk alert feed via data-connector /analytics/risks
const g5Risks = [
  {
    id: 1,
    title: "SCHADS Overtime Exposure",
    description: "4 staff exceeded 38h contracted hours this fortnight. Liability estimate: $12,400.",
    level: "high",
    zone: "Zone 2",
    impact: "$12,400",
  },
  {
    id: 2,
    title: "DEX Submission Gap Risk",
    description: "8 sessions missing SCORE — if unresolved, DEX compliance drops from 94% to 91%.",
    level: "high",
    zone: "Zone 1",
    impact: "3% compliance drop",
  },
  {
    id: 3,
    title: "Budget Burn Rate Acceleration",
    description: "Participant C is tracking 18% over monthly budget. Plan review recommended.",
    level: "medium",
    zone: "Zone 3",
    impact: "+$3,200/month",
  },
  {
    id: 4,
    title: "Credential Expiry Cluster",
    description: "3 staff have First Aid certificates expiring within 14 days. Service delivery at risk.",
    level: "medium",
    zone: "Zone 2",
    impact: "3 staff affected",
  },
  {
    id: 5,
    title: "Low Session Satisfaction Trend",
    description: "Average session rating in Zone 4 dropped to 3.2/5 over last 30 days.",
    level: "low",
    zone: "Zone 4",
    impact: "3.2 avg rating",
  },
  {
    id: 6,
    title: "Missed Shift Pattern",
    description: "Shift missed rate in Zone 2 is 4.2% — above the 3% operational threshold.",
    level: "low",
    zone: "Zone 2",
    impact: "4.2% missed rate",
  },
]

/* ============================= */
/* DASHBOARD */
/* ============================= */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a2e] overflow-x-hidden pb-10">

      {/* Page header */}
      <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e] leading-tight"
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}
            >
              CEO Command Center
            </h1>
            <p className="text-sm text-[#4a4a6a] mt-1">
              Financial pulse, DEX compliance &amp; strategic alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#4ade80]/15 text-[#16a34a] px-3 py-1.5 rounded-full border border-[#4ade80]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Live
            </span>
            <span className="text-xs text-[#4a4a6a]">Updated 5 mins ago</span>
          </div>
        </div>
      </div>

      <main className="px-4 sm:px-6 md:px-10 space-y-8">

        {/* FINANCIAL PULSE */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8 space-y-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">Financial Pulse</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <ExecMetric label="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
            <ExecMetric label="Labor" value={`$${totalLabor.toLocaleString()}`} danger />
            <ExecMetric label="Pending" value={`$${totalPending.toLocaleString()}`} success />
            <ExecMetric label="Net Margin" value={`${netMargin.toFixed(1)}%`} />
          </div>
          <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid stroke="#f0ede6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4ade80" />
                <Bar dataKey="labor" fill="#ef4444" />
                <Bar dataKey="pending" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* DEX COMPLIANCE */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">DEX Compliance – Q2 2026</h2>
              <p className="text-xs sm:text-sm text-gray-500">12 Days Remaining</p>
            </div>
            <Link
              href="/admin/non-compliant"
              className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto text-center whitespace-nowrap"
            >
              View Non-Compliant
            </Link>
          </div>
          <div className="w-full h-60 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dexChartData}>
                <CartesianGrid stroke="#f0ede6" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#1a1a2e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* STRATEGIC ALERTS */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-6">Strategic Alerts</h2>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 space-y-4">
              {alertsData.map(alert => (
                <AlertExpandable key={alert.id} alert={alert} />
              ))}
            </div>
            <div className="xl:col-span-4 bg-[#faf9f7] rounded-xl border border-[#e8e4dd] p-4 sm:p-6">
              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={zoneRiskData} dataKey="value" nameKey="name" outerRadius="75%" label>
                      {zoneRiskData.map((_, i) => (
                        <Cell key={i} fill={["#4ade80", "#facc15", "#ef4444"][i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* AI INSIGHTS */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">AI Insights</h2>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Predictive & Risk Intelligence</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <InsightCard
              title="Revenue Forecast"
              description="Projected 8% revenue growth next quarter based on current service delivery hours vs plan hours trend."
              impact="Positive"
            />
            <InsightCard
              title="DEX Submission Risk"
              description="8 sessions missing SCORE documentation. If unresolved before deadline, DEX compliance rate drops to 91%."
              impact="Warning"
            />
            <InsightCard
              title="Shift Attendance Rate"
              description="Missed shift rate in Zone 2 is 4.2% this month — above the 3% threshold. Review rostering and staff availability."
              impact="Action Required"
            />
          </div>
        </section>

        {/* PREDICTIVE REVENUE FORECAST — M4-S13 (G4 agent) */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Predictive Revenue Forecast</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                G4 agent projection — 3-month forward view based on delivery trend
                {/* TODO: wire to data-connector /analytics/forecast once G4 is live */}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200">
                G4 Agent
              </span>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "May Forecast",   value: "$748k",  trend: "+7%",  up: true },
              { label: "Jun Forecast",   value: "$802k",  trend: "+7%",  up: true },
              { label: "Jul Forecast",   value: "$861k",  trend: "+7%",  up: true },
              { label: "Q3 Total Est.",  value: "$2.41M", trend: "+8%",  up: true },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-lg font-bold text-[#1a1a2e]">{kpi.value}</p>
                <p className={`text-xs font-medium mt-0.5 ${kpi.up ? "text-emerald-600" : "text-red-600"}`}>
                  {kpi.trend} vs last quarter
                </p>
              </div>
            ))}
          </div>

          {/* Forecast chart */}
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0ede6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number | undefined) => v != null ? `$${v.toLocaleString()}` : ""} />
                <Legend />
                <ReferenceLine x="Apr" stroke="#e8e4dd" strokeDasharray="4 4" label={{ value: "Now", position: "top", fontSize: 10 }} />
                <Area type="monotone" dataKey="actual"   stroke="#4ade80" strokeWidth={2} fill="url(#actualGrad)"   name="Actual Revenue"   connectNulls={false} />
                <Area type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={2} fill="url(#forecastGrad)" name="G4 Forecast" strokeDasharray="6 3" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* G5 RISK INTELLIGENCE — M4-S13 (G5 agent) */}
        <section className="bg-white rounded-2xl border border-[#e8e4dd] p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">G5 Risk Intelligence</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Live risk alerts ranked by operational impact
                {/* TODO: wire to data-connector /analytics/risks once G5 is live */}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700 px-3 py-1.5 rounded-full border border-red-200 w-fit">
              G5 Agent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {g5Risks.map((risk) => (
              <G5RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

/* ============================= */
/* COMPONENTS */
/* ============================= */

function ExecMetric({ label, value, danger, success }: { label: string; value: string; danger?: boolean; success?: boolean }) {
  const border = danger ? "border-red-500" : success ? "border-[#4ade80]" : "border-[#1a1a2e]"
  return (
    <div className={`bg-[#faf9f7] border-2 ${border} p-5 rounded-xl`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg md:text-2xl font-bold font-[var(--font-mono)] break-words">{value}</p>
    </div>
  )
}

function AlertExpandable({ alert }: { alert: { id: number; title: string; severity: string; zone: string; description: string; trend: string } }) {
  const [open, setOpen] = useState(false)
  const severityBorder = alert.severity === "high" ? "border-red-500" : alert.severity === "medium" ? "border-yellow-500" : "border-green-500"
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className={`p-4 cursor-pointer border-l-4 ${severityBorder}`} onClick={() => setOpen(!open)}>
        <div className="flex justify-between items-center gap-4">
          <p className="font-medium break-words">{alert.title}</p>
          <span className="flex-shrink-0">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="p-4 bg-[#faf9f7] border-t text-sm text-gray-600 space-y-2">
          <p><strong>Zone:</strong> {alert.zone}</p>
          <p>{alert.description}</p>
          <p className="font-medium">{alert.trend}</p>
        </div>
      )}
    </div>
  )
}

function InsightCard({ title, description, impact }: { title: string; description: string; impact: string }) {
  const impactStyles = impact === "Positive" ? "bg-[#4ade80]/20 text-[#15803d]" : impact === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
  return (
    <div className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-5 space-y-3 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <h3 className="font-semibold break-words">{title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${impactStyles}`}>{impact}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function G5RiskCard({ risk }: { risk: { id: number; title: string; description: string; level: string; zone: string; impact: string } }) {
  const levelStyle =
    risk.level === "high"
      ? { bar: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200", border: "border-l-red-500" }
      : risk.level === "medium"
      ? { bar: "bg-amber-400", badge: "bg-amber-100 text-amber-700 border-amber-200", border: "border-l-amber-400" }
      : { bar: "bg-yellow-300", badge: "bg-yellow-50 text-yellow-700 border-yellow-200", border: "border-l-yellow-400" }
  return (
    <div className={`bg-[#faf9f7] border border-[#e8e4dd] border-l-4 ${levelStyle.border} rounded-xl p-4 space-y-2 hover:shadow-md transition`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#1a1a2e] leading-tight break-words">{risk.title}</h3>
        <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${levelStyle.badge}`}>
          {risk.level}
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{risk.description}</p>
      <div className="flex items-center justify-between pt-1 text-xs text-[#4a4a6a]">
        <span>{risk.zone}</span>
        <span className="font-semibold text-[#1a1a2e]">{risk.impact}</span>
      </div>
    </div>
  )
}
