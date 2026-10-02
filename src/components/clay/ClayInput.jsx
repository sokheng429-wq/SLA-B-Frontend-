import React from 'react';

/**
 * High-Fidelity B'Groceries Recessed Input
 * Features:
 * - Recessed Concavity: shadow-clayPressed on #141C26 base
 * - Focus transition: transforms into a raised slate surface with #77BC1F neon glow ring
 * - Height: h-16 (64px)
 * - Accessible text contrast: #FFFFFF text, #64748B placeholder
 */
export default function ClayInput({
  label,
  error,
  helper,
  icon: Icon,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  containerClassName = '',
  id,
  ...props
}) {
  const inputId = id || (label ? `clay-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`w-full flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontFamily: 'Nunito, sans-serif' }}
          className="text-sm font-extrabold text-white tracking-wide ml-1 flex items-center justify-between"
        >
          <span>{label}</span>
          {helper && <span className="text-xs font-normal text-[#94A3B8]">{helper}</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-5 flex items-center justify-center text-[#94A3B8] pointer-events-none">
            <Icon className="w-5 h-5 text-[#77BC1F]" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ fontFamily: 'DM Sans, sans-serif' }}
          className={`flex w-full h-16 rounded-2xl border border-[#2E3D50] bg-[#141C26] text-white text-base sm:text-lg shadow-clayPressed placeholder:text-[#64748B] transition-all duration-200 outline-none focus:bg-[#1A232F] focus:border-[#77BC1F] focus:ring-4 focus:ring-[#77BC1F]/25 ${
            Icon ? 'pl-14 pr-6' : 'px-6'
          } ${error ? 'ring-2 ring-rose-500 bg-rose-950/20' : ''} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs font-bold text-rose-400 ml-1.5 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
