"use client";

import { useState } from "react";
import Tooltip from "./tooltip";

type Session = {
  id: number;
  participant: string;
  staff: string;
  date: string;
  service: string;
  hours: number;
  mapped: boolean;
  status: "Pending" | "Approved" | "Flagged";
  approvedBy?: string;
  approvedAt?: string;
  mappingError?: string;
};

export default function DexAuditLab() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, participant: "Client A", staff: "Sarah Jenkins", date: "2026-02-20", service: "Physiotherapy", hours: 4, mapped: true, status: "Pending" },
    { id: 2, participant: "Client B", staff: "Mike Ross", date: "2026-02-19", service: "Occupational Therapy", hours: 3, mapped: true, status: "Pending" },
    { id: 3, participant: "Client C", staff: "Jessica Pearson", date: "2026-02-18", service: "Personal Care", hours: 2, mapped: false, status: "Flagged", mappingError: "Missing staff ID in XML schema" },
  ]);

  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Flagged">("All");

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBatchApprove = () => {
    const updated = sessions.map(session =>
      selected.includes(session.id) && session.mapped
        ? { ...session, status: "Approved", approvedBy: "Admin User", approvedAt: new Date().toLocaleString() }
        : session
    );
    setSessions(updated as Session[]);
    setSelected([]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-700";
      case "Flagged": return "bg-red-50 text-red-600";
      default: return "bg-yellow-50 text-yellow-700";
    }
  };

  const filteredSessions = filter === "All" ? sessions : sessions.filter(s => s.status === filter);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-7xl mx-auto bg-slate-50 min-h-screen space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">DEX Audit Lab</h1>
          <p className="text-slate-500 font-medium">Review & batch approve agent-mapped session data</p>
        </div>
        <button
          onClick={handleBatchApprove}
          disabled={selected.length === 0}
          className={`px-6 py-3 rounded-xl font-semibold transition ${selected.length === 0 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"}`}
        >
          Batch Approve ({selected.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Approved", "Flagged"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="min-w-[900px] w-full text-left">
          <thead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">Participant</th>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4 text-center">Date</th>
              <th className="px-6 py-4 text-center">Service</th>
              <th className="px-6 py-4 text-center">Hours</th>
              <th className="px-6 py-4 text-center">Schema Mapping</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSessions.map(session => (
              <tr key={session.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selected.includes(session.id)} onChange={() => toggleSelect(session.id)} disabled={!session.mapped} className="w-4 h-4 accent-slate-900" />
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">{session.participant}</td>
                <td className="px-6 py-4 text-slate-600">{session.staff}</td>
                <td className="px-6 py-4 text-center text-slate-700">{session.date}</td>
                <td className="px-6 py-4 text-center text-slate-700">{session.service}</td>
                <td className="px-6 py-4 text-center font-medium text-slate-800">{session.hours}h</td>
                <td className="px-6 py-4 text-center">
                  {session.mapped ? (
                    <span className="text-green-700 font-medium text-xs">Valid XML</span>
                  ) : (
                    <Tooltip content={session.mappingError || "Mapping Error"}>
                      <span className="text-red-600 font-medium text-xs cursor-help">Mapping Error</span>
                    </Tooltip>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(session.status)}`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-500 text-xs">
                  {session.status === "Approved" ? `${session.approvedBy} @ ${session.approvedAt}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
