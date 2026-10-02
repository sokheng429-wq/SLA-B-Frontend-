import React from 'react';

/**
 * High-Fidelity B'Groceries Universal Clay Card
 * Features:
 * - Surface: #232F3F Midnight Slate
 * - Glow / depth: shadow-clayCard & shadow-clayCardHover
 * - Super-rounded corners (rounded-[32px])
 * - Floating hover lift (-translate-y-2)
 * - Inner content wrapper supporting peeking decorations
 */
export default function ClayCard({
  children,
  className = '',
  variant = 'glass', // 'glass' | 'solid' | 'obsidian' | 'recessed' | 'gradient'
  interactive = true,
  padding = 'p-6 sm:p-8',
  radius = 'rounded-[32px]',
  style = {},
  onClick,
  ...props
}) {
  const variantStyles = {
    glass: 'bg-[#232F3F]/85 backdrop-blur-xl border border-[#34465B] text-white shadow-clayCard',
    solid: 'bg-[#232F3F] border border-[#34465B] text-white shadow-clayCard',
    obsidian: 'bg-[#141C26]/90 border border-[#2E3D50] text-white shadow-clayCard',
    gradient: 'bg-gradient-to-br from-[#232F3F]/95 via-[#1E2837]/90 to-[#141C26]/95 backdrop-blur-xl border border-[#34465B] text-white shadow-clayCard',
    recessed: 'bg-[#141C26] text-white shadow-clayPressed border border-[#2E3D50]/50',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-500 hover:-translate-y-2 hover:shadow-clayCardHover cursor-pointer'
    : 'transition-all duration-300';

  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden ${radius} ${variantStyles[variant] || variantStyles.glass} ${interactiveStyles} ${padding} ${className}`}
      {...props}
    >
      {/* Inner Content Wrapper */}
      <div className="relative z-10 flex h-full flex-col">
        {children}
      </div>
    </div>
  );
}
