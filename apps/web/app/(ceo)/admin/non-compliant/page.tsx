'use client'

import { useState } from "react"

type Session = {
  id: string
  client: string
  staff: string
  date: string
  issue: string
  status: "Pending" | "Resolved"
}

const initialSessions: Session[] = [
  { id: "NC-001", client: "John Smith", staff: "Emma Wilson", date: "2026-02-20", issue: "Missing progress notes", status: "Pending" },
  { id: "NC-002", client: "Sarah Brown", staff: "Liam Johnson", date: "2026-02-21", issue: "Session submitted after 48 hours", status: "Resolved" },
  { id: "NC-003", client: "Michael Lee", staff: "Olivia Taylor", date: "2026-02-22", issue: "Incorrect billing code", status: "Pending" },
]

export default function NonCompliantPage() {
  const [sessions, setSessions] = useState(initialSessions)

  const markResolved = (id: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, status: "Resolved" } : session
      )
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Non-Compliant Sessions
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Review and resolve sessions missing mandatory compliance data.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e4dd] shadow-sm overflow-x-auto">
        <table className="min-w-[900px] w-full text-xs sm:text-sm md:text-base">
          <thead className="bg-[#faf9f7] border-b">
            <tr className="text-left">
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Session ID</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Client</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Staff</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Date</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Issue</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Status</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id} className="border-t hover:bg-[#faf9f7] transition">
                <td className="p-3 sm:p-4 font-mono whitespace-nowrap">{session.id}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{session.client}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{session.staff}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">{session.date}</td>
                <td className="p-3 sm:p-4 min-w-[200px]">{session.issue}</td>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${session.status === "Pending" ? "bg-red-100 text-red-600" : "bg-[#4ade80]/20 text-[#16a34a]"}`}>
                    {session.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4 whitespace-nowrap">
                  {session.status === "Pending" && (
                    <button
                      onClick={() => markResolved(session.id)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#1a1a2e] text-white text-xs sm:text-sm hover:bg-[#252540] transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
