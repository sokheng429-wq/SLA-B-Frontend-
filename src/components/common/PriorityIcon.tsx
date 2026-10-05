import React from 'react';
import { Priority } from '../../types';
import { ChevronsUp, ChevronUp, Equal, ChevronDown } from 'lucide-react';

interface PriorityIconProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, showLabel = false, className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const labelSize = size === 'sm' ? 'text-xs' : 'text-xs font-bold';

  switch (priority) {
    case 'P1':
      return (
        <span className={`inline-flex items-center gap-1 font-bold text-red-600 ${className}`} title="P1 - Critical (Crisis)">
          <ChevronsUp className={`${iconSize} stroke-[2.5]`} />
          {showLabel && <span className={labelSize}>P1 Critical</span>}
        </span>
      );
    case 'P2':
      return (
        <span className={`inline-flex items-center gap-1 font-bold text-[#FF9900] ${className}`} title="P2 - High Priority">
          <ChevronUp className={`${iconSize} stroke-[2.5]`} />
          {showLabel && <span className={labelSize}>P2 High</span>}
        </span>
      );
    case 'P3':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold text-amber-600 ${className}`} title="P3 - Medium (Standard)">
          <Equal className={`${iconSize} stroke-[2.5]`} />
          {showLabel && <span className={labelSize}>P3 Medium</span>}
        </span>
      );
    case 'P4':
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-[#77BC1F] ${className}`} title="P4 - Low / Routine">
          <ChevronDown className={`${iconSize} stroke-[2.5]`} />
          {showLabel && <span className={labelSize}>P4 Low</span>}
        </span>
      );
  }
};
