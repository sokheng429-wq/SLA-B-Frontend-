import React from 'react';

/**
 * High-Fidelity B'Groceries Stat Orb
 * Features:
 * - Spherical geometry with subtle ambient occlusion
 * - Breathing pulse simulation (animate-clay-breathe)
 * - Tactile hover growth (hover:scale-110)
 * - Brand themes: #77BC1F Green & #FF9900 Orange
 */
export default function ClayStatOrb({
  number,
  label,
  sublabel,
  icon: Icon,
  variant = 'green', // 'green' | 'orange' | 'slate' | 'sky'
  size = 'default',   // 'default' | 'lg' | 'sm'
  className = '',
  onClick,
}) {
  const variantStyles = {
    green: {
      bg: 'bg-gradient-to-br from-[#77BC1F]/30 via-[#232F3F] to-[#141C26] border border-[#77BC1F]/60 shadow-[0_0_20px_rgba(119,188,31,0.3)]',
      text: 'text-[#77BC1F]',
      badge: 'bg-[#77BC1F] text-[#0B0F14]',
    },
    orange: {
      bg: 'bg-gradient-to-br from-[#FF9900]/30 via-[#232F3F] to-[#141C26] border border-[#FF9900]/60 shadow-[0_0_20px_rgba(255,153,0,0.3)]',
      text: 'text-[#FF9900]',
      badge: 'bg-[#FF9900] text-[#0B0F14]',
    },
    slate: {
      bg: 'bg-gradient-to-br from-[#34465B]/60 via-[#232F3F] to-[#141C26] border border-[#2E3D50] shadow-clayCard',
      text: 'text-white',
      badge: 'bg-slate-700 text-white',
    },
    sky: {
      bg: 'bg-gradient-to-br from-[#38BDF8]/30 via-[#232F3F] to-[#141C26] border border-[#38BDF8]/60 shadow-[0_0_20px_rgba(56,189,248,0.3)]',
      text: 'text-sky-400',
      badge: 'bg-sky-500 text-white',
    },
  };

  const sizeStyles = {
    sm: 'w-28 h-28',
    default: 'w-36 h-36 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-48 sm:h-48',
  };

  const currentTheme = variantStyles[variant] || variantStyles.green;

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center text-center cursor-pointer select-none ${className}`}
    >
      {/* Spherical Clay Orb */}
      <div
        className={`relative flex flex-col items-center justify-center rounded-full shadow-clayOrb animate-clay-breathe transition-transform duration-300 group-hover:scale-110 ${
          sizeStyles[size] || sizeStyles.default
        } ${currentTheme.bg}`}
      >
        {/* Specular Highlight Sheen */}
        <div className="absolute top-2 left-4 w-8 h-4 rounded-full bg-white/20 blur-[1px] rotate-[-25deg] pointer-events-none" />

        {Icon && (
          <div className="mb-1 text-slate-300">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}

        <div
          style={{ fontFamily: 'Nunito, sans-serif' }}
          className={`text-3xl sm:text-4xl font-black tracking-tight leading-none ${currentTheme.text}`}
        >
          {number}
        </div>

        {sublabel && (
          <div
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[11px] font-black uppercase tracking-wider text-[#94A3B8] mt-1"
          >
            {sublabel}
          </div>
        )}
      </div>

      {label && (
        <span
          style={{ fontFamily: 'Nunito, sans-serif' }}
          className="mt-3.5 text-sm sm:text-base font-black text-white tracking-tight group-hover:text-[#77BC1F] transition-colors"
        >
          {label}
        </span>
      )}
    </div>
  );
}
