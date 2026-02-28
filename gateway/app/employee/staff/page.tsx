"use client";

import { useState } from "react";

type StaffMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: string;
};

export default function StaffDirectory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "Sarah Jenkins", role: "Support Worker", department: "Care", email: "sarah@company.com", status: "Active" },
    { id: 2, name: "Mike Ross", role: "Senior Carer", department: "Care", email: "mike@company.com", status: "Active" },
    { id: 3, name: "Jessica Pearson", role: "Case Manager", department: "Management", email: "jessica@company.com", status: "On Leave" },
    { id: 4, name: "Harvey Specter", role: "Compliance Officer", department: "Operations", email: "harvey@company.com", status: "Active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({ name: "", role: "", department: "Care", email: "", status: "Active" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStaff, setEditStaff] = useState<Partial<StaffMember>>({});

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || member.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || member.department.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "On Leave": return "bg-yellow-50 text-yellow-700";
      case "Inactive": return "bg-red-50 text-red-600";
      case "Left Company": return "bg-slate-200 text-slate-500 line-through";
      default: return "bg-green-50 text-green-700";
    }
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.email) return;
    setStaff(prev => [...prev, { id: prev.length + 1, ...newStaff } as StaffMember]);
    setNewStaff({ name: "", role: "", department: "Care", email: "", status: "Active" });
    setShowForm(false);
  };

  const markLeft = (id: number) => setStaff(prev => prev.map(s => s.id === id ? { ...s, status: "Left Company" } : s));
  const saveEdit = (id: number) => { setStaff(prev => prev.map(s => s.id === id ? { ...s, ...editStaff } as StaffMember : s)); setEditingId(null); setEditStaff({}); };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-7xl mx-auto bg-slate-50 min-h-screen space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-slate-500 font-medium">Organization-wide employee registry</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition" onClick={() => setShowForm(prev => !prev)}>
          + Add Staff
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-bold text-lg mb-4 text-slate-900">Add New Staff Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Full Name" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 outline-none" />
            <input type="text" placeholder="Role" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 outline-none" />
            <input type="email" placeholder="Email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 outline-none" />
            <select value={newStaff.department} onChange={e => setNewStaff({ ...newStaff, department: e.target.value })} className="px-4 py-2 border border-slate-200 rounded-lg">
              <option value="Care">Care</option>
              <option value="Management">Management</option>
              <option value="Operations">Operations</option>
            </select>
            <select value={newStaff.status} onChange={e => setNewStaff({ ...newStaff, status: e.target.value })} className="px-4 py-2 border border-slate-200 rounded-lg">
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition" onClick={handleAddStaff}>Save Staff</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-6 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-slate-300 outline-none" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-6 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <option value="All">All Departments</option>
          <option value="Care">Care</option>
          <option value="Management">Management</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredStaff.map(member => (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
            {editingId === member.id ? (
              <div className="space-y-3">
                <input type="text" value={editStaff.name || member.name} onChange={e => setEditStaff(prev => ({ ...prev, name: e.target.value }))} className="px-4 py-2 border border-slate-200 rounded-lg w-full" />
                <input type="text" value={editStaff.role || member.role} onChange={e => setEditStaff(prev => ({ ...prev, role: e.target.value }))} className="px-4 py-2 border border-slate-200 rounded-lg w-full" />
                <input type="email" value={editStaff.email || member.email} onChange={e => setEditStaff(prev => ({ ...prev, email: e.target.value }))} className="px-4 py-2 border border-slate-200 rounded-lg w-full" />
                <div className="flex gap-3 mt-2">
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition" onClick={() => saveEdit(member.id)}>Save</button>
                  <button className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-bold ${member.status === "Left Company" ? "text-slate-400 line-through" : "text-slate-900"}`}>{member.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{member.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(member.status)}`}>{member.status}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold">Department:</span> {member.department}</p>
                  <p><span className="font-semibold">Email:</span> {member.email}</p>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  {member.status !== "Left Company" && (
                    <button className="w-full py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition" onClick={() => markLeft(member.id)}>Mark as Left</button>
                  )}
                  <button className="w-full py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition" onClick={() => { setEditingId(member.id); setEditStaff(member); }}>Edit Details</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
