"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("./minimap"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

type Agent = {
  id: number;
  name: string;
  role: string;
  unit: string;
  email: string;
  status: string;
  location: { lat: number; lng: number };
};

type Shift = {
  id: string;
  agentId: number | null;
  agentName: string;
  client: string;
  day: string;
  startHour: number;
  endHour: number;
  type: string;
  schadsViolation?: string;
};

// ─── SCHADS Rule Engine ───────────────────────────────────────────────────────
// Rules: SCHADS Award + NDIS Practice Standards
// Cl.10 min 3h engagement | max 10h ordinary time | min 10h break between shifts

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function checkSchads(shift: Shift, allShifts: Shift[]): string | null {
  const duration = shift.endHour - shift.startHour;
  if (duration < 3) return `Only ${duration}h — min 3h engagement (SCHADS Cl.10)`;
  if (duration > 10) return `${duration}h shift — overtime clause applies (SCHADS Cl.28)`;

  if (shift.agentId !== null) {
    const dayIdx = DAY_ORDER.indexOf(shift.day);
    const prevDayShifts = allShifts.filter(
      (s) =>
        s.agentId === shift.agentId &&
        DAY_ORDER.indexOf(s.day) === dayIdx - 1 &&
        s.id !== shift.id
    );
    if (prevDayShifts.length > 0) {
      const lastPrev = prevDayShifts.reduce((max, s) =>
        s.endHour > max.endHour ? s : max
      );
      const breakHours = 24 - lastPrev.endHour + shift.startHour;
      if (breakHours < 10)
        return `Only ${breakHours}h break (min 10h required — SCHADS Cl.31)`;
    }
  }
  return null;
}

function applySchads(shifts: Shift[]): Shift[] {
  return shifts.map((s) => ({
    ...s,
    schadsViolation: checkSchads(s, shifts) ?? undefined,
  }));
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const INITIAL_AGENTS: Agent[] = [
  { id: 1, name: "Sarah Jenkins", role: "Field Support Agent", unit: "Care", email: "sarah@company.com", status: "On Duty", location: { lat: -37.8136, lng: 144.9631 } },
  { id: 2, name: "Mike Ross", role: "Senior Field Agent", unit: "Care", email: "mike@company.com", status: "On Duty", location: { lat: -37.8200, lng: 144.9550 } },
  { id: 3, name: "Jessica Pearson", role: "Case Response Manager", unit: "Management", email: "jessica@company.com", status: "Off Duty", location: { lat: -37.8000, lng: 144.9700 } },
  { id: 4, name: "Harvey Specter", role: "Operations Compliance Agent", unit: "Operations", email: "harvey@company.com", status: "On Duty", location: { lat: -37.8300, lng: 144.9800 } },
];

// s3 is a 2-hour shift → SCHADS violation; s7 is unassigned open shift
const RAW_SHIFTS: Shift[] = [
  { id: "s1", agentId: 1, agentName: "Sarah Jenkins", client: "Margaret T.", day: "Mon", startHour: 9,  endHour: 13, type: "Personal Care" },
  { id: "s2", agentId: 1, agentName: "Sarah Jenkins", client: "Robert M.",   day: "Mon", startHour: 14, endHour: 18, type: "Community Access" },
  { id: "s3", agentId: 2, agentName: "Mike Ross",     client: "Patricia K.", day: "Tue", startHour: 8,  endHour: 10, type: "Domestic Assist" },
  { id: "s4", agentId: 2, agentName: "Mike Ross",     client: "William B.",  day: "Wed", startHour: 9,  endHour: 14, type: "Support Coordination" },
  { id: "s5", agentId: 3, agentName: "Jessica Pearson", client: "Dorothy S.", day: "Thu", startHour: 10, endHour: 13, type: "Life Skills" },
  { id: "s6", agentId: 4, agentName: "Harvey Specter", client: "Open Shift", day: "Fri", startHour: 9,  endHour: 12, type: "Review" },
  { id: "s7", agentId: null, agentName: "Unassigned",  client: "Open Shift", day: "Mon", startHour: 9,  endHour: 12, type: "Personal Care" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgenticRoster() {
  const [tab, setTab]               = useState<"schedule" | "staff">("schedule");
  const [shifts, setShifts]         = useState<Shift[]>(() => applySchads(RAW_SHIFTS));
  const [agents, setAgents]         = useState<Agent[]>(INITIAL_AGENTS);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [notification, setNotification] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedLat, setAdvancedLat]   = useState("");
  const [advancedLng, setAdvancedLng]   = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [pendingAssignment, setPendingAssignment] = useState<{ agent: Agent; note: string } | null>(null);
  const [hilShift, setHilShift]     = useState<Shift | null>(null);
  const dragId = useRef<string | null>(null);

  // Simulate GPS drift
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          location: {
            lat: a.location.lat + (Math.random() - 0.5) * 0.001,
            lng: a.location.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // ── Drag-and-drop ──────────────────────────────────────────────────────────

  const onDragStart = (shiftId: string) => { dragId.current = shiftId; };

  const onDrop = (targetDay: string) => {
    if (!dragId.current) return;
    const updated = shifts.map((s) =>
      s.id === dragId.current ? { ...s, day: targetDay } : s
    );
    setShifts(applySchads(updated));
    dragId.current = null;
    notify("Shift moved — click it to review & approve via HIL gate.");
  };

  // ── HIL gate ──────────────────────────────────────────────────────────────

  const confirmHil = () => {
    if (!hilShift) return;
    // TODO: POST to data-connector /roster/hil-approve when Ravi wires backend
    setHilShift(null);
    notify("HIL sign-off recorded — shift published to schedule.");
  };

  // ── Auto-assign ───────────────────────────────────────────────────────────

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleAutoAssign = () => {
    let candidates = agents.filter((a) => a.status === "On Duty");
    if (selectedUnit) candidates = candidates.filter((a) => a.unit === selectedUnit);
    if (!candidates.length) { notify("No available agents match criteria."); return; }

    let selected: Agent;
    if (showAdvanced && advancedLat && advancedLng) {
      const lat = Number(advancedLat);
      const lng = Number(advancedLng);
      selected = candidates.reduce((prev, curr) =>
        getDistance(curr.location.lat, curr.location.lng, lat, lng) <
        getDistance(prev.location.lat, prev.location.lng, lat, lng)
          ? curr : prev
      );
    } else {
      selected = candidates[0];
    }
    const note =
      showAdvanced && advancedLat && advancedLng
        ? `Nearest to (${Number(advancedLat).toFixed(4)}, ${Number(advancedLng).toFixed(4)})`
        : selectedUnit
        ? `First available in ${selectedUnit} unit`
        : "First available agent";
    setPendingAssignment({ agent: selected, note });
  };

  const confirmAssignment = () => {
    if (!pendingAssignment) return;
    const { agent } = pendingAssignment;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agent.id && showAdvanced && advancedLat && advancedLng
          ? { ...a, location: { lat: Number(advancedLat), lng: Number(advancedLng) } }
          : a
      )
    );
    setPendingAssignment(null);
    // TODO: POST to data-connector /roster/assign when Ravi wires backend
    notify(`${agent.name} assigned — HIL approval queued.`);
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  const filteredAgents = agents.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.unit === filter;
    return matchSearch && matchFilter;
  });

  const violationCount = shifts.filter((s) => s.schadsViolation).length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#faf9f7] min-h-screen space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]">Rostering</h1>
        <p className="text-sm text-[#4a4a6a] mt-1">
          Manage staff schedules with SCHADS compliance validation and HIL approval gate.
        </p>
      </div>

      {/* SCHADS violation banner */}
      {violationCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-3 rounded-xl text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <strong>{violationCount} SCHADS violation{violationCount > 1 ? "s" : ""}</strong>
          &nbsp;detected — fix flagged shifts before publishing. HIL approval is blocked until resolved.
        </div>
      )}

      {/* Notification toast */}
      {notification && (
        <div className="bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#16a34a] px-5 py-3 rounded-xl text-sm font-medium">
          {notification}
        </div>
      )}

      {/* ── HIL Gate Modal ─────────────────────────────────────────────────── */}
      {hilShift && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">HIL Gate — Shift Approval</h2>
            <p className="text-xs text-[#4a4a6a] mb-4">
              Human-in-Loop sign-off is required before this shift is published. Review the details below.
            </p>
            <div className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-4 mb-4 space-y-1.5">
              <p className="text-sm font-semibold text-[#1a1a2e]">{hilShift.client}</p>
              <p className="text-xs text-[#4a4a6a]">
                {hilShift.agentName} · {hilShift.day} {hilShift.startHour}:00 – {hilShift.endHour}:00
              </p>
              <p className="text-xs text-[#4a4a6a]">{hilShift.type}</p>
              {hilShift.schadsViolation && (
                <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>SCHADS violation: {hilShift.schadsViolation}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-[#4a4a6a] mb-4">
              By approving, you confirm this shift complies with the SCHADS Award, NDIS Practice Standards, and applicable workplace legislation.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setHilShift(null)}
                className="flex-1 py-2.5 border border-[#e8e4dd] text-[#4a4a6a] font-medium rounded-xl hover:bg-[#faf9f7] text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmHil}
                disabled={!!hilShift.schadsViolation}
                className="flex-1 py-2.5 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#252540] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {hilShift.schadsViolation ? "Resolve Violation First" : "Approve & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-Assign Confirmation Modal ─────────────────────────────────── */}
      {pendingAssignment && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Confirm Assignment</h2>
            <p className="text-sm text-[#4a4a6a] mb-4">
              System selected the following staff member based on your criteria:
            </p>
            <div className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-4 mb-3 space-y-1">
              <p className="font-semibold text-[#1a1a2e]">{pendingAssignment.agent.name}</p>
              <p className="text-sm text-[#4a4a6a]">
                {pendingAssignment.agent.role} · {pendingAssignment.agent.unit}
              </p>
              <p className="text-xs text-[#4a4a6a] mt-1 italic">{pendingAssignment.note}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-xs text-blue-700 font-medium">
                HIL Gate: This assignment will be queued for supervisor review before activation.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingAssignment(null)}
                className="flex-1 py-2.5 border border-[#e8e4dd] text-[#4a4a6a] font-medium rounded-xl hover:bg-[#faf9f7] text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                className="flex-1 py-2.5 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#252540] text-sm"
              >
                Confirm & Queue HIL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab switcher ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-white border border-[#e8e4dd] rounded-xl p-1 w-fit">
        {(["schedule", "staff"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? "bg-[#1a1a2e] text-white" : "text-[#4a4a6a] hover:text-[#1a1a2e]"
            }`}
          >
            {t === "schedule" ? "Weekly Schedule" : "Staff Map"}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* WEEKLY SCHEDULE TAB                                                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {tab === "schedule" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dd] overflow-x-auto">
            <div className="p-4 border-b border-[#e8e4dd] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm font-semibold text-[#1a1a2e]">Week of 10 Mar 2026</p>
              <p className="text-xs text-[#4a4a6a]">
                Drag shifts between days to reschedule · Click shift to open HIL approval
              </p>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-5 min-w-[640px]">
              {DAYS.map((day) => {
                const dayShifts = shifts.filter((s) => s.day === day);
                return (
                  <div
                    key={day}
                    className="border-r border-[#e8e4dd] last:border-r-0"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(day)}
                  >
                    <div className="bg-[#faf9f7] border-b border-[#e8e4dd] px-3 py-2.5 text-center">
                      <p className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest">{day}</p>
                      <p className="text-[10px] text-[#b0a9a0] mt-0.5">{dayShifts.length} shift{dayShifts.length !== 1 ? "s" : ""}</p>
                    </div>

                    <div className="p-2 space-y-2 min-h-[220px]">
                      {dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          draggable
                          onDragStart={() => onDragStart(shift.id)}
                          onClick={() => setHilShift(shift)}
                          className={`rounded-xl border p-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition select-none ${
                            shift.agentId === null
                              ? "bg-gray-50 border-dashed border-[#e8e4dd]"
                              : shift.schadsViolation
                              ? "bg-amber-50 border-amber-300"
                              : "bg-[#f0fdf4] border-[#86efac]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <p className="text-xs font-semibold text-[#1a1a2e] leading-tight">{shift.client}</p>
                            {shift.schadsViolation && (
                              <span className="shrink-0 text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-300">
                                SCHADS
                              </span>
                            )}
                            {!shift.schadsViolation && shift.agentId !== null && (
                              <span className="shrink-0 text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-300">
                                OK
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#4a4a6a]">{shift.agentName}</p>
                          <p className="text-[10px] text-[#4a4a6a]">
                            {shift.startHour}:00 – {shift.endHour}:00 ({shift.endHour - shift.startHour}h)
                          </p>
                          <p className="text-[10px] text-[#4a4a6a]">{shift.type}</p>
                          {shift.schadsViolation && (
                            <p className="text-[9px] text-amber-700 font-medium mt-1 leading-tight">
                              ⚠ {shift.schadsViolation}
                            </p>
                          )}
                        </div>
                      ))}

                      {dayShifts.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-[#e8e4dd] rounded-xl flex items-center justify-center">
                          <p className="text-xs text-[#b0a9a0]">Drop shift here</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-[#4a4a6a]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#f0fdf4] border border-[#86efac] inline-block" />
              SCHADS compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-300 inline-block" />
              Violation detected — HIL blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-50 border border-dashed border-[#e8e4dd] inline-block" />
              Unassigned open shift
            </span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* STAFF MAP TAB                                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {tab === "staff" && (
        <div className="space-y-6">
          {/* Auto-assign panel */}
          <div className="bg-white rounded-2xl border border-[#e8e4dd] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#1a1a2e]">F4 Auto-Assign Staff</h2>
                <p className="text-xs text-[#4a4a6a] mt-0.5">
                  Selects nearest available staff. All assignments pass through HIL gate.
                  {/* TODO: Connect to F4 agent via data-connector /roster/suggest */}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm bg-[#faf9f7] text-[#1a1a2e]"
                >
                  <option value="">Any unit</option>
                  <option value="Care">Care</option>
                  <option value="Management">Management</option>
                  <option value="Operations">Operations</option>
                </select>
                <button
                  onClick={handleAutoAssign}
                  className="px-5 py-2 bg-[#1a1a2e] text-white text-sm font-semibold rounded-xl hover:bg-[#252540] transition"
                >
                  Auto-Assign
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-[#4a4a6a] hover:text-[#1a1a2e] transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showAdvanced ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
              </svg>
              {showAdvanced ? "Hide advanced options" : "Advanced: assign by GPS coordinates"}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-[#4a4a6a] mb-1">Target Latitude</label>
                  <input
                    type="text"
                    placeholder="-37.8136"
                    className="w-full px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm"
                    value={advancedLat}
                    onChange={(e) => setAdvancedLat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#4a4a6a] mb-1">Target Longitude</label>
                  <input
                    type="text"
                    placeholder="144.9631"
                    className="w-full px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm"
                    value={advancedLng}
                    onChange={(e) => setAdvancedLng(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search & filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e4dd] bg-white text-sm"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e8e4dd] bg-white text-sm"
            >
              <option value="All">All Units</option>
              <option value="Care">Care</option>
              <option value="Management">Management</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="text-[#4a4a6a]">
              <strong className="text-[#1a1a2e]">{agents.filter((a) => a.status === "On Duty").length}</strong> on duty
            </span>
            <span className="text-[#4a4a6a]">
              <strong className="text-[#1a1a2e]">{agents.filter((a) => a.status === "Off Duty").length}</strong> off duty
            </span>
            <span className="text-[#4a4a6a]">
              Showing <strong className="text-[#1a1a2e]">{filteredAgents.length}</strong> staff
            </span>
          </div>

          {/* Agent grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-2xl p-5 border border-[#e8e4dd] hover:shadow-md transition isolate">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">{agent.name}</h3>
                    <p className="text-xs text-[#4a4a6a] mt-0.5">{agent.role}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      agent.status === "Off Duty"
                        ? "bg-red-100 text-red-700"
                        : agent.status === "Standby"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-[#4a4a6a] mb-4">
                  <p><span className="font-medium text-[#1a1a2e]">Unit:</span> {agent.unit}</p>
                  <p><span className="font-medium text-[#1a1a2e]">Contact:</span> {agent.email}</p>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#e8e4dd]">
                  <MiniMap location={agent.location} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
