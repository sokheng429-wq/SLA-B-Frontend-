import React from 'react';

/**
 * High-Fidelity B'Groceries Pill Badge
 */
export default function ClayBadge({
  children,
  variant = 'green', // 'green' | 'orange' | 'slate' | 'sky' | 'amber' | 'emerald'
  icon: Icon,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const variantStyles = {
    green: 'bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/40 shadow-[0_0_10px_rgba(119,188,31,0.2)]',
    emerald: 'bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/40 shadow-[0_0_10px_rgba(119,188,31,0.2)]',
    orange: 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-[0_0_10px_rgba(255,153,0,0.2)]',
    amber: 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-[0_0_10px_rgba(255,153,0,0.2)]',
    slate: 'bg-[#1A232F] text-white border border-[#2E3D50]',
    neutral: 'bg-[#232F3F] text-white border border-[#34465B]',
    sky: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
    violet: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
    pink: 'bg-pink-500/20 text-pink-400 border border-pink-500/40',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1 gap-1.5',
    md: 'text-sm px-4 py-1.5 gap-2',
    lg: 'text-base px-5 py-2 gap-2.5',
  };

  return (
    <span
      style={{ fontFamily: 'Nunito, sans-serif' }}
      className={`inline-flex items-center justify-center font-black rounded-full shadow-clayPill select-none transition-all ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.green} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </span>
  );
}
