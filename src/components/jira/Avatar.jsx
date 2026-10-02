import React from 'react';

// Deterministic color from name
const AVATAR_COLORS = [
  '#1868DB', '#22A06B', '#8777D9', '#E34935', '#CF9F02',
  '#0C66E4', '#00B8D9', '#FF5630', '#6554C0', '#00875A'
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function Avatar({
  name = 'User',
  src = null,
  size = 24,
  className = '',
  title = '',
  bgColor: bgColorProp = null
}) {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(/[\s_.-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const colorIndex = hashCode(name) % AVATAR_COLORS.length;
  const bgColor = bgColorProp || AVATAR_COLORS[colorIndex];

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    fontSize: `${Math.max(9, Math.floor(size * 0.4))}px`,
    backgroundColor: bgColor
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={title || name}
        style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px` }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      title={title || name}
      style={style}
      className={`rounded-full flex items-center justify-center font-semibold text-white tracking-tight select-none ${className}`}
    >
      {initials}
    </div>
  );
}
