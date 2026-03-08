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
  const [manual, setManual] = useState({ agentId: 0, lat: "", lng: "", unit: "" });

  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: "Sarah Jenkins", role: "Field Support Agent", unit: "Care", email: "sarah@company.com", status: "On Duty", location: { lat: 28.6139, lng: 77.2090 } },
    { id: 2, name: "Mike Ross", role: "Senior Field Agent", unit: "Care", email: "mike@company.com", status: "On Duty", location: { lat: 28.7041, lng: 77.1025 } },
    { id: 3, name: "Jessica Pearson", role: "Case Response Manager", unit: "Management", email: "jessica@company.com", status: "Off Duty", location: { lat: 28.5355, lng: 77.3910 } },
    { id: 4, name: "Harvey Specter", role: "Operations Compliance Agent", unit: "Operations", email: "harvey@company.com", status: "On Duty", location: { lat: 28.4595, lng: 77.0266 } },
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

  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || agent.unit.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleAutoAssign = (targetLat?: number, targetLng?: number, unit?: string) => {
    let candidates = agents.filter(a => a.status === "On Duty");
    if (unit) candidates = candidates.filter(a => a.unit.toLowerCase() === unit.toLowerCase());
    if (!candidates.length) return setNotification("No available agents match criteria!");

    let selected: Agent;
    if (targetLat !== undefined && targetLng !== undefined) {
      selected = candidates.reduce((prev, curr) => {
        const prevDist = getDistance(prev.location.lat, prev.location.lng, targetLat, targetLng);
        const currDist = getDistance(curr.location.lat, curr.location.lng, targetLat, targetLng);
        return currDist < prevDist ? curr : prev;
      });
      setAgents(prev => prev.map(a => a.id === selected.id ? { ...a, location: { lat: targetLat, lng: targetLng } } : a));
    } else {
      selected = candidates[0];
    }
    setNotification(`Assigned ${selected.name}`);
    setTimeout(() => setNotification(""), 4000);
  };

  const handleManualAssign = () => {
    const { agentId, lat, lng, unit } = manual;
    if (!agentId) return setNotification("Select an agent");
    setAgents(prev =>
      prev.map(a =>
        a.id === Number(agentId)
          ? { ...a, location: lat && lng ? { lat: Number(lat), lng: Number(lng) } : a.location, unit: unit || a.unit }
          : a
      )
    );
    setNotification("Manually assigned agent successfully");
    setTimeout(() => setNotification(""), 4000);
  };

  return (
    <div className="p-4 md:p-8 xl:p-12 max-w-7xl mx-auto bg-[#f6f4ef] min-h-screen space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Agentic Rostering</h1>
        <p className="text-slate-500 font-medium">Live deployment & dynamic assignment</p>
      </div>

      {notification && (
        <div className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold shadow-sm transition">
          {notification}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="font-bold text-lg text-slate-700">Assign Agent</h2>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <input type="text" placeholder="Target Lat (optional)" className="px-4 py-2 border rounded-lg w-full" onChange={e => setManual({ ...manual, lat: e.target.value })} value={manual.lat} />
          <input type="text" placeholder="Target Lng (optional)" className="px-4 py-2 border rounded-lg w-full" onChange={e => setManual({ ...manual, lng: e.target.value })} value={manual.lng} />
          <input type="text" placeholder="Unit (optional)" className="px-4 py-2 border rounded-lg w-full" onChange={e => setManual({ ...manual, unit: e.target.value })} value={manual.unit} />
          <button
            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition w-full md:w-auto"
            onClick={() => handleAutoAssign(manual.lat ? Number(manual.lat) : undefined, manual.lng ? Number(manual.lng) : undefined, manual.unit || undefined)}
          >
            Auto Assign
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <select className="px-4 py-2 border rounded-lg w-full" value={manual.agentId} onChange={e => setManual({ ...manual, agentId: Number(e.target.value) })}>
            <option value={0}>Select Agent</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.unit})</option>)}
          </select>
          <button className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition w-full md:w-auto" onClick={handleManualAssign}>
            Manual Assign
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Search by agent or role..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-6 py-3 rounded-2xl border bg-white shadow-sm" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-6 py-3 rounded-2xl border bg-white shadow-sm">
          <option value="All">All Units</option>
          <option value="Care">Care</option>
          <option value="Management">Management</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{agent.name}</h3>
                <p className="text-xs text-slate-500">📍 {agent.location.lat.toFixed(4)}, {agent.location.lng.toFixed(4)}</p>
                <p className="text-sm text-slate-500 mt-1">{agent.role}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(agent.status)}`}>
                {agent.status}
              </span>
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold">Unit:</span> {agent.unit}</p>
              <p><span className="font-semibold">Contact:</span> {agent.email}</p>
            </div>
            <div className="mt-4">
              <MiniMap location={agent.location} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
