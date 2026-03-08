"use client";

import { useState } from "react";

type Session = {
  id: number;
  participant: string;
  staff: string;
  date: string;
  service: string;
  hours: number;
  scoreCircumstances: string;
  scoreGoals: string;
  scoreSatisfaction: number;
  readyToSubmit: boolean;
  status: "Pending" | "Approved" | "Flagged";
  approvedBy?: string;
  approvedAt?: string;
  issueNote?: string;
};

export default function SessionReview() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      participant: "Client A",
      staff: "Sarah Jenkins",
      date: "2026-02-20",
      service: "Physiotherapy",
      hours: 4,
      scoreCircumstances: "Stable living, carer support in place",
      scoreGoals: "Working toward independent mobility",
      scoreSatisfaction: 4,
      readyToSubmit: true,
      status: "Pending",
    },
    {
      id: 2,
      participant: "Client B",
      staff: "Mike Ross",
      date: "2026-02-19",
      service: "Occupational Therapy",
      hours: 3,
      scoreCircumstances: "Recent move, adjusting to new environment",
      scoreGoals: "Improving daily living skills",
      scoreSatisfaction: 5,
      readyToSubmit: true,
      status: "Pending",
    },
    {
      id: 3,
      participant: "Client C",
      staff: "Jessica Pearson",
      date: "2026-02-18",
      service: "Personal Care",
      hours: 2,
      scoreCircumstances: "",
      scoreGoals: "",
      scoreSatisfaction: 0,
      readyToSubmit: false,
      status: "Flagged",
      issueNote: "Staff ID missing — contact your coordinator to resolve before this session can be submitted.",
    },
  ]);

  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Flagged">("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleApprove = () => {
    const updated = sessions.map(session =>
      selected.includes(session.id) && session.readyToSubmit
        ? { ...session, status: "Approved" as const, approvedBy: "Admin User", approvedAt: new Date().toLocaleString() }
        : session
    );
    setSessions(updated);
    setSelected([]);
    setConfirmOpen(false);
  };

  const filteredSessions = filter === "All" ? sessions : sessions.filter(s => s.status === filter);
  const selectedReadyCount = selected.filter(id => sessions.find(s => s.id === id)?.readyToSubmit).length;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-5xl mx-auto bg-[#faf9f7] min-h-screen space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]">Session Review</h1>
          <p className="text-sm text-[#4a4a6a] mt-1">
            Review completed sessions and approve them for DEX submission. The technical formatting happens automatically in the background.
          </p>
        </div>
        <button
          onClick={() => selectedReadyCount > 0 && setConfirmOpen(true)}
          disabled={selectedReadyCount === 0}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
            selectedReadyCount === 0
              ? "bg-[#e8e4dd] text-[#4a4a6a] cursor-not-allowed"
              : "bg-[#1a1a2e] text-white hover:bg-[#252540]"
          }`}
        >
          Approve {selectedReadyCount > 0 ? `${selectedReadyCount} Session${selectedReadyCount > 1 ? "s" : ""}` : "Selected"}
        </button>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Confirm Submission</h2>
            <p className="text-sm text-[#4a4a6a] mb-4">
              You are approving <strong>{selectedReadyCount}</strong> session{selectedReadyCount > 1 ? "s" : ""} for DEX submission.
              Once approved, these sessions will be sent to the government data exchange automatically.
            </p>
            <ul className="mb-5 space-y-1">
              {selected.map(id => {
                const s = sessions.find(s => s.id === id);
                if (!s || !s.readyToSubmit) return null;
                return (
                  <li key={id} className="text-sm text-[#1a1a2e] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0" />
                    {s.participant} · {s.service} · {s.date}
                  </li>
                );
              })}
            </ul>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 py-2.5 border border-[#e8e4dd] text-[#4a4a6a] font-medium rounded-xl hover:bg-[#faf9f7]">
                Go Back
              </button>
              <button onClick={handleApprove} className="flex-1 py-2.5 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#252540]">
                Confirm &amp; Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Pending", "Approved", "Flagged"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-[#1a1a2e] text-white" : "bg-white border border-[#e8e4dd] text-[#4a4a6a] hover:bg-[#f0ede6]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {filteredSessions.map(session => {
          const isExpanded = expanded === session.id;
          const statusStyle =
            session.status === "Approved"
              ? "bg-[#4ade80]/15 text-[#16a34a] border border-[#4ade80]/30"
              : session.status === "Flagged"
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200";

          return (
            <div key={session.id} className="bg-white rounded-2xl border border-[#e8e4dd] overflow-hidden">
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <input
                  type="checkbox"
                  checked={selected.includes(session.id)}
                  onChange={() => toggleSelect(session.id)}
                  disabled={!session.readyToSubmit || session.status === "Approved"}
                  className="w-4 h-4 accent-[#1a1a2e] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-[#1a1a2e]">{session.participant}</span>
                    <span className="text-sm text-[#4a4a6a]">{session.service}</span>
                    <span className="text-sm text-[#4a4a6a]">·</span>
                    <span className="text-sm text-[#4a4a6a]">{session.staff}</span>
                  </div>
                  <p className="text-xs text-[#4a4a6a] mt-0.5">{session.date} · {session.hours}h</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    session.readyToSubmit ? "bg-[#4ade80]/15 text-[#16a34a]" : "bg-amber-50 text-amber-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${session.readyToSubmit ? "bg-[#4ade80]" : "bg-amber-500"}`} />
                    {session.readyToSubmit ? "Ready" : "Needs attention"}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${statusStyle}`}>
                    {session.status}
                  </span>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : session.id)}
                    className="text-[#4a4a6a] hover:text-[#1a1a2e] transition"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {isExpanded ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
                    </svg>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#e8e4dd] px-4 sm:px-5 py-4 bg-[#faf9f7] space-y-3">
                  {session.issueNote && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                      <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {session.issueNote}
                    </div>
                  )}
                  {session.readyToSubmit && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-[#e8e4dd]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4a4a6a] mb-1">Circumstances</p>
                        <p className="text-sm text-[#1a1a2e]">{session.scoreCircumstances}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-[#e8e4dd]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4a4a6a] mb-1">Goals</p>
                        <p className="text-sm text-[#1a1a2e]">{session.scoreGoals}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-[#e8e4dd]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4a4a6a] mb-1">Satisfaction Rating</p>
                        <p className="text-sm text-[#1a1a2e]">{session.scoreSatisfaction}/5</p>
                      </div>
                    </div>
                  )}
                  {session.status === "Approved" && (
                    <p className="text-xs text-[#4a4a6a]">Approved by <strong>{session.approvedBy}</strong> at {session.approvedAt}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
