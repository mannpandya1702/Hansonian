"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("./minimap"), { ssr: false });

type Agent = {
  id: number;
  name: string;
  role: string;
  unit: string;
  email: string;
  status: string;
  location: { lat: number; lng: number };
};

export default function AgenticRoster() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notification, setNotification] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedLat, setAdvancedLat] = useState("");
  const [advancedLng, setAdvancedLng] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [pendingAssignment, setPendingAssignment] = useState<{ agent: Agent; note: string } | null>(null);

  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: "Sarah Jenkins", role: "Field Support Agent", unit: "Care", email: "sarah@company.com", status: "On Duty", location: { lat: -37.8136, lng: 144.9631 } },
    { id: 2, name: "Mike Ross", role: "Senior Field Agent", unit: "Care", email: "mike@company.com", status: "On Duty", location: { lat: -37.8200, lng: 144.9550 } },
    { id: 3, name: "Jessica Pearson", role: "Case Response Manager", unit: "Management", email: "jessica@company.com", status: "Off Duty", location: { lat: -37.8000, lng: 144.9700 } },
    { id: 4, name: "Harvey Specter", role: "Operations Compliance Agent", unit: "Operations", email: "harvey@company.com", status: "On Duty", location: { lat: -37.8300, lng: 144.9800 } },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev =>
        prev.map(agent => ({
          ...agent,
          location: {
            lat: agent.location.lat + (Math.random() - 0.5) * 0.001,
            lng: agent.location.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Off Duty": return "bg-red-100 text-red-700";
      case "Standby": return "bg-amber-100 text-amber-700";
      default: return "bg-emerald-100 text-emerald-700";
    }
  };

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleAutoAssignRequest = () => {
    let candidates = agents.filter(a => a.status === "On Duty");
    if (selectedUnit) candidates = candidates.filter(a => a.unit === selectedUnit);
    if (!candidates.length) {
      setNotification("No available agents match the selected criteria.");
      setTimeout(() => setNotification(""), 4000);
      return;
    }

    let selected: Agent;
    if (showAdvanced && advancedLat && advancedLng) {
      const lat = Number(advancedLat);
      const lng = Number(advancedLng);
      selected = candidates.reduce((prev, curr) =>
        getDistance(curr.location.lat, curr.location.lng, lat, lng) <
        getDistance(prev.location.lat, prev.location.lng, lat, lng) ? curr : prev
      );
    } else {
      selected = candidates[0];
    }

    const note = showAdvanced && advancedLat && advancedLng
      ? `Nearest to coordinates (${Number(advancedLat).toFixed(4)}, ${Number(advancedLng).toFixed(4)})`
      : selectedUnit ? `First available in ${selectedUnit} unit` : "First available agent";

    setPendingAssignment({ agent: selected, note });
  };

  const confirmAssignment = () => {
    if (!pendingAssignment) return;
    const { agent } = pendingAssignment;
    setAgents(prev =>
      prev.map(a =>
        a.id === agent.id && showAdvanced && advancedLat && advancedLng
          ? { ...a, location: { lat: Number(advancedLat), lng: Number(advancedLng) } }
          : a
      )
    );
    setNotification(`${agent.name} has been assigned.`);
    setTimeout(() => setNotification(""), 4000);
    setPendingAssignment(null);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || agent.unit === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#faf9f7] min-h-screen space-y-6">

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]">Rostering</h1>
        <p className="text-sm text-[#4a4a6a] mt-1">View your team and assign staff to sessions.</p>
      </div>

      {notification && (
        <div className="bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#16a34a] px-5 py-3 rounded-xl text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingAssignment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Confirm Assignment</h2>
            <p className="text-sm text-[#4a4a6a] mb-4">
              The system has selected the following staff member based on your criteria:
            </p>
            <div className="bg-[#faf9f7] border border-[#e8e4dd] rounded-xl p-4 mb-4 space-y-1">
              <p className="font-semibold text-[#1a1a2e]">{pendingAssignment.agent.name}</p>
              <p className="text-sm text-[#4a4a6a]">{pendingAssignment.agent.role} · {pendingAssignment.agent.unit}</p>
              <p className="text-xs text-[#4a4a6a] mt-2 italic">{pendingAssignment.note}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPendingAssignment(null)} className="flex-1 py-2.5 border border-[#e8e4dd] text-[#4a4a6a] font-medium rounded-xl hover:bg-[#faf9f7]">
                Cancel
              </button>
              <button onClick={confirmAssignment} className="flex-1 py-2.5 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#252540]">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Panel */}
      <div className="bg-white rounded-2xl border border-[#e8e4dd] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">Auto-Assign Staff</h2>
            <p className="text-xs text-[#4a4a6a] mt-0.5">The system will select the most suitable available staff member.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm bg-[#faf9f7] text-[#1a1a2e]"
            >
              <option value="">Any unit</option>
              <option value="Care">Care</option>
              <option value="Management">Management</option>
              <option value="Operations">Operations</option>
            </select>
            <button
              onClick={handleAutoAssignRequest}
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
          {showAdvanced ? "Hide advanced options" : "Advanced: assign by location"}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs text-[#4a4a6a] mb-1">Target Latitude</label>
              <input type="text" placeholder="-37.8136" className="w-full px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm" value={advancedLat} onChange={e => setAdvancedLat(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-[#4a4a6a] mb-1">Target Longitude</label>
              <input type="text" placeholder="144.9631" className="w-full px-3 py-2 border border-[#e8e4dd] rounded-lg text-sm" value={advancedLng} onChange={e => setAdvancedLng(e.target.value)} />
            </div>
            <p className="col-span-full text-xs text-[#4a4a6a]">When coordinates are provided, the nearest available staff member will be selected.</p>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e4dd] bg-white text-sm" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#e8e4dd] bg-white text-sm">
          <option value="All">All Units</option>
          <option value="Care">Care</option>
          <option value="Management">Management</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-[#4a4a6a]"><strong className="text-[#1a1a2e]">{agents.filter(a => a.status === "On Duty").length}</strong> on duty</span>
        <span className="text-[#4a4a6a]"><strong className="text-[#1a1a2e]">{agents.filter(a => a.status === "Off Duty").length}</strong> off duty</span>
        <span className="text-[#4a4a6a]">Showing <strong className="text-[#1a1a2e]">{filteredAgents.length}</strong> staff</span>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-white rounded-2xl p-5 border border-[#e8e4dd] hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">{agent.name}</h3>
                <p className="text-xs text-[#4a4a6a] mt-0.5">{agent.role}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(agent.status)}`}>
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
  );
}
