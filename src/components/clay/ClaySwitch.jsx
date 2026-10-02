import React from 'react';

/**
 * High-Fidelity B'Groceries Tactile Switch
 * Features:
 * - Recessed Concave Track: shadow-clayPressed on #141C26
 * - Convex Sliding Clay Pill: glowing #77BC1F green
 * - Active squish physics
 */
export default function ClaySwitch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) {
  return (
    <label
      className={`inline-flex items-center gap-3.5 select-none cursor-pointer ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Recessed Track */}
      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative w-16 h-9 rounded-full transition-all duration-300 p-1 flex items-center shadow-clayPressed cursor-pointer border ${
          checked ? 'bg-[#77BC1F]/25 border-[#77BC1F]/60' : 'bg-[#141C26] border-[#2E3D50]'
        }`}
      >
        {/* Sliding Convex Knob */}
        <div
          className={`w-7 h-7 rounded-full transition-all duration-300 transform active:scale-90 flex items-center justify-center ${
            checked
              ? 'translate-x-7 bg-gradient-to-r from-[#77BC1F] to-[#5EA014] text-[#0B0F14] shadow-[0_0_12px_rgba(119,188,31,0.8)]'
              : 'translate-x-0 bg-[#232F3F] border border-[#34465B] shadow-md'
          }`}
        >
          {checked && (
            <div className="w-2 h-2 rounded-full bg-[#0B0F14]" />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="text-sm font-extrabold text-white"
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[#94A3B8]">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
