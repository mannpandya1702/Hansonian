import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
    <div>
      <h1
        className="text-2xl sm:text-3xl font-semibold text-[#1a1a2e]"
        style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[#4a4a6a] mt-1">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)
