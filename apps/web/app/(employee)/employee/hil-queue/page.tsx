"use client";

// M3-S12: Human-in-Loop (HIL) Approval Queue
// Supervisor reviews AI-suggested actions before they activate.
// Covers: DEX batch approvals, roster assignments, billing triggers.
// TODO: Replace mock items with live data from data-connector /hil/queue

import { useState } from "react";

type HilItemType = "DEX Submission" | "Roster Assignment" | "Billing Trigger" | "Shift Override";
type HilStatus   = "Pending" | "Approved" | "Rejected";

interface HilItem {
  id: string;
  type: HilItemType;
  title: string;
  description: string;
  raisedBy: string;
  raisedAt: string;
  participant?: string;
  staff?: string;
  riskFlag?: string;
  status: HilStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}

const INITIAL_ITEMS: HilItem[] = [
  {
    id: "hil-001",
    type: "DEX Submission",
    title: "Batch DEX Submission — Q2 Feb Sessions",
    description: "Agent B1 has prepared 6 session records for DEX submission. All SCORE fields completed. Requires supervisor sign-off before lodgement.",
    raisedBy: "B1 Agent (auto)",
    raisedAt: "2026-03-14 09:12",
    participant: "Multiple (6 sessions)",
    riskFlag: undefined,
    status: "Pending",
  },
  {
    id: "hil-002",
    type: "Roster Assignment",
    title: "Auto-Assign: Sarah Jenkins → Margaret T. (Mon 9:00)",
    description: "F4 agent selected Sarah Jenkins as nearest available staff for Mon 09:00 shift. No SCHADS violations detected.",
    raisedBy: "F4 Agent (auto)",
    raisedAt: "2026-03-14 08:55",
    staff: "Sarah Jenkins",
    participant: "Margaret T.",
    riskFlag: undefined,
    status: "Pending",
  },
  {
    id: "hil-003",
    type: "Billing Trigger",
    title: "Invoice Generation — 4 Completed Sessions",
    description: "4 sessions completed and SCORE verified. Billing agent has prepared NDIS invoices totalling $2,480. Requires HIL approval to send to PRODA.",
    raisedBy: "D1 Agent (auto)",
    raisedAt: "2026-03-13 17:30",
    participant: "Clients A, B, C, D",
    riskFlag: undefined,
    status: "Pending",
  },
  {
    id: "hil-004",
    type: "Shift Override",
    title: "Shift Duration Override — Mike Ross (Tue 8:00–10:00)",
    description: "Detected SCHADS violation: 2-hour shift below minimum 3h engagement. Override requires supervisor acknowledgement and reason.",
    raisedBy: "SCHADS Engine",
    raisedAt: "2026-03-13 08:10",
    staff: "Mike Ross",
    participant: "Patricia K.",
    riskFlag: "SCHADS Cl.10 — min 3h engagement not met",
    status: "Pending",
  },
  {
    id: "hil-005",
    type: "DEX Submission",
    title: "DEX Session — Missing SCORE Circumstances",
    description: "Session for William B. is missing SCORE Circumstances domain. Agent C1 flagged for manual completion before DEX submission.",
    raisedBy: "C1 Agent (auto)",
    raisedAt: "2026-03-12 14:00",
    staff: "Mike Ross",
    participant: "William B.",
    riskFlag: "Incomplete SCORE — DEX submission blocked",
    status: "Rejected",
    rejectedReason: "SCORE must be completed by caregiver — returned to Mike Ross.",
  },
];

const TYPE_COLORS: Record<HilItemType, string> = {
  "DEX Submission":    "bg-blue-100 text-blue-700 border-blue-200",
  "Roster Assignment": "bg-purple-100 text-purple-700 border-purple-200",
  "Billing Trigger":   "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Shift Override":    "bg-amber-100 text-amber-700 border-amber-200",
};

export default function HilQueuePage() {
  const [items, setItems]             = useState<HilItem[]>(INITIAL_ITEMS);
  const [filter, setFilter]           = useState<HilStatus | "All">("All");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [notification, setNotification] = useState("");

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Approved",
              approvedBy: "Admin User",
              approvedAt: new Date().toLocaleString("en-AU"),
            }
          : item
      )
    );
    // TODO: POST to data-connector /hil/approve { id } when Ravi wires backend
    // For billing triggers: POST to /billing/send-invoice
    // For DEX submissions: POST to /dex/submit-batch
    notify("Approved — action queued for execution by the relevant agent.");
  };

  const handleRejectSubmit = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === rejectTarget
          ? { ...item, status: "Rejected", rejectedReason: rejectReason.trim() }
          : item
      )
    );
    // TODO: POST to data-connector /hil/reject { id, reason }
    setRejectTarget(null);
    setRejectReason("");
    notify("Rejected — reason logged and agent notified.");
  };

  const displayed = items.filter((i) => filter === "All" || i.status === filter);
  const counts = {
    Pending:  items.filter((i) => i.status === "Pending").length,
    Approved: items.filter((i) => i.status === "Approved").length,
    Rejected: items.filter((i) => i.status === "Rejected").length,
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-[#faf9f7] min-h-screen space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]">HIL Approval Queue</h1>
        <p className="text-sm text-[#4a4a6a] mt-1">
          Human-in-Loop gate — review and approve or reject AI-suggested actions before they execute.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {(["Pending", "Approved", "Rejected"] as const).map((s) => (
          <div key={s} className="bg-white border border-[#e8e4dd] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a1a2e]">{counts[s]}</p>
            <p className="text-xs text-[#4a4a6a] mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#16a34a] px-5 py-3 rounded-xl text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Reject & Return</h2>
            <p className="text-sm text-[#4a4a6a]">Provide a reason — this will be logged in the audit trail and sent back to the originating agent.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. SCORE fields incomplete — return to caregiver for review."
              className="w-full px-3 py-2.5 border border-[#e8e4dd] rounded-xl text-sm resize-none h-24 focus:outline-none focus:border-[#1a1a2e]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1 py-2.5 border border-[#e8e4dd] text-[#4a4a6a] font-medium rounded-xl hover:bg-[#faf9f7] text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 text-sm disabled:opacity-40"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-[#e8e4dd] rounded-xl p-1 w-fit">
        {(["All", "Pending", "Approved", "Rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-[#1a1a2e] text-white" : "text-[#4a4a6a] hover:text-[#1a1a2e]"
            }`}
          >
            {f}
            {f !== "All" && counts[f as HilStatus] > 0 && (
              <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                {counts[f as HilStatus]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Queue items */}
      <div className="space-y-4">
        {displayed.length === 0 && (
          <div className="bg-white border border-[#e8e4dd] rounded-2xl p-10 text-center text-[#4a4a6a] text-sm">
            No items match this filter.
          </div>
        )}

        {displayed.map((item) => (
          <div
            key={item.id}
            className={`bg-white border border-[#e8e4dd] rounded-2xl p-5 space-y-3 ${
              item.status === "Pending" ? "" : "opacity-80"
            }`}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}>
                    {item.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : item.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1a1a2e]">{item.title}</h3>
              </div>
              <p className="text-xs text-[#4a4a6a] shrink-0">{item.raisedAt}</p>
            </div>

            <p className="text-sm text-[#4a4a6a] leading-relaxed">{item.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#4a4a6a]">
              <div><span className="font-medium text-[#1a1a2e]">Raised by:</span> {item.raisedBy}</div>
              {item.participant && <div><span className="font-medium text-[#1a1a2e]">Participant:</span> {item.participant}</div>}
              {item.staff && <div><span className="font-medium text-[#1a1a2e]">Staff:</span> {item.staff}</div>}
            </div>

            {/* Risk flag */}
            {item.riskFlag && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-xl text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {item.riskFlag}
              </div>
            )}

            {/* Rejection reason */}
            {item.status === "Rejected" && item.rejectedReason && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs">
                <strong>Rejection reason:</strong> {item.rejectedReason}
              </div>
            )}

            {/* Approval info */}
            {item.status === "Approved" && item.approvedBy && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-xs">
                Approved by <strong>{item.approvedBy}</strong> at {item.approvedAt}
              </div>
            )}

            {/* Action buttons — only for Pending */}
            {item.status === "Pending" && (
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setRejectTarget(item.id); }}
                  className="flex-1 py-2 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 text-sm transition"
                >
                  Reject & Return
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 py-2 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#252540] text-sm transition"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
