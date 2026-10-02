import React from 'react';
import { ArrowUp, ArrowDown, Equal, ChevronUp, ChevronsUp } from 'lucide-react';

export default function PriorityIcon({ priority = 'P3', size = 16 }) {
  switch (priority) {
    case 'P1':
      return <ChevronsUp size={size} strokeWidth={2.5} className="text-[#FF4D4D] drop-shadow-[0_0_6px_rgba(255,77,77,0.5)]" />;
    case 'P2':
      return <ChevronUp size={size} strokeWidth={2.5} className="text-[#FF9900] drop-shadow-[0_0_6px_rgba(255,153,0,0.4)]" />;
    case 'P3':
      return <Equal size={size} strokeWidth={2.5} className="text-[#77BC1F] drop-shadow-[0_0_6px_rgba(119,188,31,0.4)]" />;
    case 'P4':
      return <ArrowDown size={size} strokeWidth={2} className="text-sky-400" />;
    default:
      return <Equal size={size} strokeWidth={2} className="text-slate-500" />;
  }
}
