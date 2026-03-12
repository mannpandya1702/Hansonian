import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type ComplianceStatus = 'valid' | 'expiring' | 'expired';

interface ComplianceBadgeProps {
  status: ComplianceStatus;
  label?: string;
  className?: string;
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ status, label, className = '' }) => {
  const config = {
    valid: {
      styles: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      defaultLabel: 'Compliant'
    },
    expiring: {
      styles: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: AlertTriangle,
      defaultLabel: 'Expiring Soon'
    },
    expired: {
      styles: 'bg-red-100 text-[#E11D48] border-red-200', // NDIS Red text
      icon: XCircle,
      defaultLabel: 'Non-Compliant'
    }
  };

  const { styles, icon: Icon, defaultLabel } = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
      role="status"
      aria-label={`Compliance status: ${label || defaultLabel}`}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
      {label || defaultLabel}
    </span>
  );
};