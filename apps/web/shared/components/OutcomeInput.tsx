import React from 'react';

interface OutcomeInputProps {
  value: number | null;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

export const OutcomeInput: React.FC<OutcomeInputProps> = ({ 
  value, 
  onChange, 
  label = "NDIS Outcome Score", 
  disabled = false 
}) => {
  const scores = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-gray-700" id="outcome-label">
        {label}
      </label>
      <div 
        className="flex gap-2" 
        role="radiogroup" 
        aria-labelledby="outcome-label"
      >
        {scores.map((score) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => !disabled && onChange(score)}
              disabled={disabled}
              aria-checked={isSelected}
              role="radio"
              aria-label={`Score ${score}`}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${isSelected 
                  ? 'bg-[#1A56DB] text-white ring-2 ring-offset-2 ring-[#1A56DB] scale-110' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-[#1A56DB] hover:text-[#1A56DB] hover:bg-blue-50'}
                ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:border-gray-300 hover:text-gray-600 hover:bg-white' : 'cursor-pointer shadow-sm'}
              `}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs font-medium text-gray-400 w-[230px] px-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};