import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs gap-1.5',
    md: 'h-9 px-3 text-xs md:text-sm gap-2',
    lg: 'h-11 px-4 text-sm md:text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer select-none border ${
        isDark
          ? 'bg-[#1E293B] hover:bg-[#28384E] text-[#FF9900] border-white/15 hover:border-[#FF9900]/50 shadow-md shadow-black/20'
          : 'bg-white hover:bg-gray-100 text-[#232F3F] border-gray-200 hover:border-[#77BC1F]/50 shadow-xs'
      } ${sizeClasses[size]} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className={`${iconSizes[size]} text-[#FF9900] animate-in zoom-in-75 duration-200 fill-[#FF9900]/20`} />
        ) : (
          <Moon className={`${iconSizes[size]} text-[#232F3F] animate-in zoom-in-75 duration-200 fill-[#232F3F]/10`} />
        )}
      </div>

      {showLabel && (
        <span className="font-semibold tracking-wide">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
