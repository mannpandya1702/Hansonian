import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsTileProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon?: React.ElementType;
  className?: string;
}

export const StatsTile: React.FC<StatsTileProps> = ({ 
  label, 
  value, 
  trend, 
  trendLabel, 
  icon: Icon,
  className = ''
}) => {
  const trendConfig = {
    up: { color: 'text-green-600', icon: TrendingUp },
    down: { color: 'text-[#E11D48]', icon: TrendingDown }, // NDIS Red for negative trends
    neutral: { color: 'text-gray-500', icon: Minus },
  };

  const TrendIcon = trend ? trendConfig[trend].icon : null;

  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate pr-2">{label}</h4>
        {Icon && <div className="p-2 bg-blue-50 rounded-lg text-[#1A56DB]"><Icon className="w-5 h-5" /></div>}
      </div>
      <div className="flex items-baseline mt-auto">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
      </div>
      {trend && (
        <div className={`flex items-center mt-2 text-sm font-medium ${trendConfig[trend].color}`}>
          {TrendIcon && <TrendIcon className="w-4 h-4 mr-1.5" />}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
};