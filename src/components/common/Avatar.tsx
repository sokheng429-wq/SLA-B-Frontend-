import React from 'react';

interface AvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name = 'User', avatarUrl, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[11px] font-semibold',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-14 h-14 text-lg font-bold',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        title={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white/80 shadow-xs shrink-0 ${className}`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // Consistent brand-harmonized color palette
  const bgColors = [
    'bg-[#232F3F]', // Navy
    'bg-[#77BC1F]', // Green
    'bg-[#FF9900]', // Orange
    'bg-[#2D3D50]', // Light Navy
    'bg-[#558D14]', // Darker Green
    'bg-[#B26A00]', // Deep Orange
    'bg-indigo-600',
    'bg-purple-600'
  ];
  const colorIndex = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % bgColors.length;

  return (
    <div
      title={name}
      className={`${sizeClasses[size]} ${bgColors[colorIndex]} text-white rounded-full flex items-center justify-center font-bold tracking-tight select-none shrink-0 shadow-xs ring-2 ring-white/60 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
