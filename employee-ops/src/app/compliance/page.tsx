"use client";

import { useMemo } from "react";

export default function ComplianceVault() {
  const today = new Date();

  const staffData = [
    {
      name: "Sarah Jenkins",
      role: "Support Worker",
      credentials: [
        { type: "NDIS Screening", expiry: "2027-03-14" },
        { type: "First Aid", expiry: "2026-03-12" },
        { type: "Police Check", expiry: "2025-12-02" },
      ],
    },
    {
      name: "Mike Ross",
      role: "Senior Carer",
      credentials: [
        { type: "NDIS Screening", expiry: "2026-01-05" },
        { type: "First Aid", expiry: "2026-02-28" },
        { type: "Police Check", expiry: "2026-02-25" },
      ],
    },
    {
      name: "Jessica Pearson",
      role: "Case Manager",
      credentials: [
        { type: "NDIS Screening", expiry: null },
        { type: "First Aid", expiry: "2026-08-01" },
      ],
    },
  ];

  const calculateStatus = (credentials: any[]) => {
    let hasMissing = false;
    let hasExpiring = false;

    credentials.forEach((cred) => {
      if (!cred.expiry) {
        hasMissing = true;
        return;
      }

      const expiryDate = new Date(cred.expiry);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays <= 30) {
        hasExpiring = true;
      }
    });

    if (hasMissing) return { label: "Missing", style: "bg-red-100 text-red-600" };
    if (hasExpiring) return { label: "Expiring Soon", style: "bg-yellow-100 text-yellow-700" };
    return { label: "Compliant", style: "bg-green-100 text-green-600" };
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-7xl mx-auto bg-[#faf9f7] min-h-screen space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a2e] tracking-tight"
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}>
            Compliance Vault
          </h1>
          <p className="text-[#4a4a6a] text-sm mt-1">
            US.E2 — Centralised credential monitoring &amp; expiry tracking
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2 bg-white border border-[#e8e4dd] rounded-xl font-semibold text-sm text-[#4a4a6a] hover:border-[#1a1a2e]/30 transition-all">
            Filter
          </button>
          <button className="px-5 py-2 bg-[#1a1a2e] text-white rounded-xl font-semibold text-sm hover:bg-[#252540] transition-all">
            + Add Credential
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8e4dd] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="min-w-[750px] w-full text-left">
          <thead className="bg-[#f0ede6] text-[#4a4a6a] text-[10px] font-bold uppercase tracking-widest border-b border-[#e8e4dd]">
            <tr>
              <th className="px-6 sm:px-10 py-5">Staff Member</th>
              <th className="px-6 sm:px-10 py-5">Role</th>
              <th className="px-6 sm:px-10 py-5">Credentials</th>
              <th className="px-6 sm:px-10 py-5 text-center">Overall Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e8e4dd]">
            {staffData.map((staff) => {
              const status = calculateStatus(staff.credentials);

              return (
                <tr key={staff.name} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="px-6 sm:px-10 py-5 font-semibold text-[#1a1a2e]">
                    {staff.name}
                  </td>

                  <td className="px-6 sm:px-10 py-5 text-[#4a4a6a] font-medium">
                    {staff.role}
                  </td>

                  <td className="px-10 py-6 space-y-2">
                    {staff.credentials.map((cred, index) => {
                      if (!cred.expiry) {
                        return (
                          <div
                            key={index}
                            className="text-xs font-semibold text-red-600"
                          >
                            {cred.type} — Missing
                          </div>
                        );
                      }

                      const expiryDate = new Date(cred.expiry);
                      const diffTime =
                        expiryDate.getTime() - today.getTime();
                      const diffDays =
                        diffTime / (1000 * 60 * 60 * 24);

                      const isExpiring = diffDays <= 30;

                      return (
                        <div
                          key={index}
                          className={`text-xs font-semibold ${
                            isExpiring
                              ? "text-[#b45309]"
                              : "text-[#4a4a6a]"
                          }`}
                        >
                          {cred.type} — Expires{" "}
                          {expiryDate.toLocaleDateString()}
                        </div>
                      );
                    })}
                  </td>

                  <td className="px-6 sm:px-10 py-5 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.style}`}
                    >
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
