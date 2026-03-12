"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function EmployeeOps() {
  const staffData = [
    { name: "Sarah Jenkins", role: "Support Worker", daysLeft: 120 },
    { name: "Mike Ross", role: "Senior Carer", daysLeft: 18 },
    { name: "Jessica Pearson", role: "Case Manager", daysLeft: 200 },
    { name: "Harvey Specter", role: "Support Worker", daysLeft: 5 },
  ];

  const getStatus = (daysLeft: number) => {
    if (daysLeft <= 7) return { label: "Critical", style: "bg-[#2d2d4f] text-[#3ecf73]" };
    if (daysLeft <= 30) return { label: "Expiring Soon", style: "bg-[#e2ded6] text-[#1f1f38]" };
    return { label: "Compliant", style: "bg-[#3ecf73]/15 text-[#2fb866]" };
  };

  const totalStaff = staffData.length;
  const expiringSoon = staffData.filter((s) => s.daysLeft <= 30).length;
  const critical = staffData.filter((s) => s.daysLeft <= 7).length;
  const compliant = staffData.filter((s) => s.daysLeft > 30).length;

  const complianceDistribution = [
    { name: "Compliant", value: compliant },
    { name: "Expiring Soon", value: expiringSoon },
    { name: "Critical", value: critical },
  ];

  const expiryTrend = [
    { month: "Jan", expiring: 1 },
    { month: "Feb", expiring: 2 },
    { month: "Mar", expiring: 1 },
    { month: "Apr", expiring: 3 },
    { month: "May", expiring: expiringSoon },
  ];

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto bg-[#f6f4ef] min-h-screen space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1f1f38] tracking-tight">
          Workforce Operations Dashboard
        </h1>
        <p className="text-sm sm:text-base text-[#2d2d4f] font-medium">
          Live compliance monitoring & workforce risk visibility
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPI label="Total Staff" value={totalStaff} />
        <KPI label="Fully Compliant" value={compliant} />
        <KPI label="Expiring ≤ 30 Days" value={expiringSoon} />
        <KPI label="Critical ≤ 7 Days" value={critical} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ded6] hover:border-[#2d2d4f] transition-all duration-300 shadow-sm hover:shadow-md">
          <h3 className="font-bold text-[#1f1f38] mb-6">Compliance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complianceDistribution}>
              <CartesianGrid stroke="#e2ded6" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#2d2d4f" />
              <YAxis stroke="#2d2d4f" />
              <Tooltip />
              <Bar dataKey="value" fill="#6bbf9b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ded6] hover:border-[#2d2d4f] transition-all duration-300 shadow-sm hover:shadow-md">
          <h3 className="font-bold text-[#1f1f38] mb-6">Expiry Risk Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expiryTrend}>
              <CartesianGrid stroke="#e2ded6" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#2d2d4f" />
              <YAxis stroke="#2d2d4f" />
              <Tooltip />
              <Line type="monotone" dataKey="expiring" stroke="#2fb866" strokeWidth={3} strokeLinecap="round" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {critical > 0 && (
        <div className="bg-[#2d2d4f]/90 text-[#ffffff] px-4 sm:px-6 py-4 rounded-xl font-semibold shadow-sm">
          ⚠ {critical} staff members have credentials expiring within 7 days.
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-[#e2ded6] overflow-hidden shadow-sm">
        <div className="px-6 sm:px-10 py-6 border-b border-[#e2ded6] bg-[#f6f4ef]">
          <h3 className="text-lg font-bold text-[#1f1f38]">Compliance Registry and Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="text-[#2d2d4f] text-[10px] font-black uppercase tracking-widest border-b border-[#e2ded6]">
              <tr>
                <th className="px-6 sm:px-10 py-6">Staff Member</th>
                <th className="px-6 sm:px-10 py-6">Role</th>
                <th className="px-6 sm:px-10 py-6 text-center">Days Until Expiry</th>
                <th className="px-6 sm:px-10 py-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ded6]">
              {staffData.map((staff) => {
                const status = getStatus(staff.daysLeft);
                return (
                  <tr key={staff.name} className="hover:bg-[#f6f4ef] transition-all duration-200">
                    <td className="px-6 sm:px-10 py-6 font-bold text-[#1f1f38]">{staff.name}</td>
                    <td className="px-6 sm:px-10 py-6 text-[#2d2d4f] font-medium">{staff.role}</td>
                    <td className="px-6 sm:px-10 py-6 text-center font-semibold text-[#1f1f38]">{staff.daysLeft} days</td>
                    <td className="px-6 sm:px-10 py-6 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest ${status.style}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e2ded6] hover:border-[#2d2d4f] transition-all duration-300 shadow-sm hover:shadow-md">
      <p className="text-xs sm:text-sm text-[#2d2d4f] font-medium">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-black mt-2 text-[#1f1f38]">{value}</h2>
    </div>
  );
}
