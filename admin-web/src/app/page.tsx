'use client'

import Link from "next/link"
import { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    description:
      "Medication support not delivered in 3 consecutive sessions. Incident report filed.",
    trend: "3 consecutive missed sessions",
  },
  {
    id: 2,
    title: "Overtime Threshold Exceeded – Zone 2",
    severity: "medium",
    zone: "Zone 2",
    description:
      "4 staff members have exceeded contracted hours this month. Review rostering.",
    trend: "+18% hours above contracted",
  },
  {
    id: 3,
    title: "DEX Documentation Gap – Zone 1",
    severity: "low",
    zone: "Zone 1",
    description:
      "8 sessions missing mandatory SCORE documentation before DEX submission deadline.",
    trend: "8 sessions at risk",
  },
]

const zoneRiskData = [
  { name: "Zone 1", value: 1 },
  { name: "Zone 2", value: 2 },
  { name: "Zone 4", value: 4 },
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

          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Financial Pulse
          </h2>

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
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                DEX Compliance – Q2 2026
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                12 Days Remaining
              </p>
            </div>

            <Link
              href="/non-compliant"
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
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-6">
            Strategic Alerts
          </h2>

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
                    <Pie
                      data={zoneRiskData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="75%"
                      label
                    >
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
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">
              AI Insights
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              Predictive & Risk Intelligence
            </span>
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

      </main>
    </div>
  )
}

/* ============================= */
/* COMPONENTS */
/* ============================= */

function ExecMetric({ label, value, danger, success }: any) {
  const border = danger
    ? "border-red-500"
    : success
    ? "border-[#4ade80]"
    : "border-[#1a1a2e]"

  return (
    <div className={`bg-[#faf9f7] border-2 ${border} p-5 rounded-xl`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg md:text-2xl font-bold font-[var(--font-mono)] break-words">
        {value}
      </p>
    </div>
  )
}

function AlertExpandable({ alert }: any) {
  const [open, setOpen] = useState(false)

  const severityBorder =
    alert.severity === "high"
      ? "border-red-500"
      : alert.severity === "medium"
      ? "border-yellow-500"
      : "border-green-500"

  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        className={`p-4 cursor-pointer border-l-4 ${severityBorder}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between items-center gap-4">
          <p className="font-medium break-words">{alert.title}</p>
          <span className="flex-shrink-0">
            {open ? "▲" : "▼"}
          </span>
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

function InsightCard({ title, description, impact }: any) {
  const impactStyles =
    impact === "Positive"
      ? "bg-[#4ade80]/20 text-[#15803d]"
      : impact === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-600"

  return (
    <div className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-5 space-y-3 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <h3 className="font-semibold break-words">{title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${impactStyles}`}>
          {impact}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}