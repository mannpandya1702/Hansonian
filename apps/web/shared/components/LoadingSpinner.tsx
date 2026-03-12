import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const SIZE = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => (
  <div
    role="status"
    aria-label={label ?? 'Loading'}
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
  >
    <span
      className={`${SIZE[size]} rounded-full border-[#e8e4dd] border-t-[#1a1a2e] animate-spin inline-block`}
    />
    {label && (
      <p className="text-sm text-[#4a4a6a]">{label}</p>
    )}
  </div>
)
