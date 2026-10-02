import React from 'react';

/**
 * High-Fidelity B'Groceries Clay Button
 * Features:
 * - High convexity with tactile rim light
 * - Squish physics: hover:-translate-y-1, active:scale-[0.92]
 * - Rounded corners: rounded-[20px]
 * - Theme: #77BC1F (Brand Green) & #FF9900 (Radiant Orange)
 */
export default function ClayButton({
  children,
  variant = 'primary', // 'primary' | 'accent' | 'secondary' | 'sky' | 'emerald' | 'amber' | 'outline' | 'ghost'
  size = 'default',     // 'sm' (h-11) | 'default' (h-14) | 'lg' (h-16) | 'icon' (h-14 w-14)
  icon: Icon,
  iconPosition = 'left',
  squish = true,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  style = {},
  ...props
}) {
  const sizeStyles = {
    sm: 'h-11 px-5 text-sm rounded-[18px]',
    default: 'h-14 px-7 text-base rounded-[20px]',
    lg: 'h-16 px-9 text-lg rounded-[22px]',
    icon: 'h-14 w-14 p-0 rounded-[20px] justify-center',
    iconSm: 'h-11 w-11 p-0 rounded-[18px] justify-center',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#77BC1F] to-[#5EA014] text-[#0B0F14] font-black shadow-clayGreen hover:shadow-clayGreen shadow-[0_0_20px_rgba(119,188,31,0.35)]',
    accent:
      'bg-gradient-to-r from-[#FF9900] to-[#E68A00] text-[#0B0F14] font-black shadow-clayOrange hover:shadow-clayOrange shadow-[0_0_20px_rgba(255,153,0,0.35)]',
    secondary:
      'bg-[#232F3F] text-white border border-[#34465B] shadow-claySecondary hover:border-[#77BC1F]/60 hover:text-white',
    emerald:
      'bg-gradient-to-r from-[#77BC1F] to-[#5EA014] text-[#0B0F14] font-black shadow-clayGreen',
    amber:
      'bg-gradient-to-r from-[#FF9900] to-[#E68A00] text-[#0B0F14] font-black shadow-clayOrange',
    sky:
      'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white font-black shadow-claySky',
    outline:
      'border-2 border-[#77BC1F]/50 bg-[#77BC1F]/10 text-[#77BC1F] backdrop-blur-md hover:border-[#77BC1F] hover:bg-[#77BC1F]/20',
    ghost:
      'text-[#CBD5E1] hover:bg-[#232F3F] hover:text-white active:bg-[#1A232F]',
  };

  const squishStyles = squish && !disabled
    ? 'hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed'
    : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ fontFamily: 'Nunito, sans-serif', ...style }}
      className={`inline-flex items-center justify-center gap-2.5 font-black tracking-wide select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
        sizeStyles[size] || sizeStyles.default
      } ${variantStyles[variant] || variantStyles.primary} ${squishStyles} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 shrink-0" />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 shrink-0" />}
    </button>
  );
}
