import React from 'react'

type Variant = 'error' | 'warning' | 'success' | 'info'

interface AlertBannerProps {
  variant?: Variant
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
}

const VARIANT_STYLES: Record<Variant, { wrapper: string; icon: string }> = {
  error:   { wrapper: 'bg-red-50 border-red-200 text-red-700',         icon: '⚠' },
  warning: { wrapper: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: '⚠' },
  success: { wrapper: 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#16a34a]', icon: '✓' },
  info:    { wrapper: 'bg-blue-50 border-blue-200 text-blue-700',       icon: 'ℹ' },
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = 'info',
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const styles = VARIANT_STYLES[variant]

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 px-4 py-3 border rounded-xl text-sm ${styles.wrapper} ${className}`}
    >
      <span className="shrink-0 font-semibold mt-px" aria-hidden="true">
        {styles.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className="leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none mt-px"
        >
          ✕
        </button>
      )}
    </div>
  )
}
