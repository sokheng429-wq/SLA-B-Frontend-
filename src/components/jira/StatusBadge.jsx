import React from 'react';

export default function StatusBadge({ status = 'TO DO', className = '' }) {
  const s = (status || '').toUpperCase().replace(/[\s-]+/g, '_');

  let badgeStyle = 'bg-white/5 text-slate-300 border-white/10';
  let label = status;

  if (s.includes('TODO') || s.includes('SUBMITTED') || s === 'TO_DO') {
    badgeStyle = 'bg-white/5 text-slate-300 border-white/10';
    label = 'TO DO';
  } else if (s.includes('BRIEF') || s.includes('CHECK')) {
    badgeStyle = 'bg-[#FF9900]/15 text-[#FFB338] border-[#FF9900]/30';
    label = 'BRIEF CHECK';
  } else if (s.includes('PROGRESS') || s.includes('PRODUCTION')) {
    badgeStyle = 'bg-[#FF9900]/20 text-[#FF9900] border-[#FF9900]/40 shadow-[0_0_10px_rgba(255,153,0,0.2)]';
    label = 'IN PROGRESS';
  } else if (s.includes('REVIEW')) {
    badgeStyle = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    label = 'IN REVIEW';
  } else if (s.includes('DONE') || s.includes('DELIVERED') || s.includes('APPROVED')) {
    badgeStyle = 'bg-[#77BC1F]/20 text-[#77BC1F] border-[#77BC1F]/40 shadow-[0_0_10px_rgba(119,188,31,0.25)]';
    label = 'DONE';
  } else if (s.includes('PAUSE') || s.includes('WAITING')) {
    badgeStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    label = 'WAITING';
  } else if (s.includes('REJECT')) {
    badgeStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    label = 'REJECTED';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-sm select-none transition-all ${badgeStyle} ${className}`}
    >
      {label}
    </span>
  );
}
