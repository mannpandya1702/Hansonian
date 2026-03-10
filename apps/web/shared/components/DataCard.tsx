import React from 'react';

interface DataCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  children, 
  footer, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6 flex-grow">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
};