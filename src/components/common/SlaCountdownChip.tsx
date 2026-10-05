import React from 'react';
import { Ticket } from '../../types';
import { getLiveSlaClock } from '../../utils/slaEngine';
import { Clock, PauseCircle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SlaCountdownChipProps {
  ticket: Ticket;
  size?: 'sm' | 'md' | 'lg';
}

export const SlaCountdownChip: React.FC<SlaCountdownChipProps> = ({ ticket, size = 'md' }) => {
  const clock = getLiveSlaClock(ticket);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5 shadow-2xs',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2 shadow-xs',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const chosenSize = sizeClasses[size];
  const chosenIcon = iconSizes[size];

  if (clock.status === 'COMPLETED') {
    return (
      <span className={`inline-flex items-center rounded-md bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/40 ${chosenSize}`}>
        <CheckCircle2 className={`${chosenIcon} text-[#77BC1F]`} />
        <span>Delivered (On-Time)</span>
      </span>
    );
  }

  if (clock.status === 'NOT_STARTED') {
    return (
      <span className={`inline-flex items-center rounded-md bg-gray-100 dark:bg-white/10 text-[#232F3F]/80 dark:text-gray-300 border border-gray-200 dark:border-white/10 ${chosenSize}`}>
        <Clock className={`${chosenIcon} text-gray-400 dark:text-gray-400`} />
        <span>{clock.countdownText}</span>
      </span>
    );
  }

  if (clock.status === 'PAUSED') {
    return (
      <span className={`inline-flex items-center rounded-md bg-[#FF9900]/15 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/40 animate-pulse ${chosenSize}`}>
        <PauseCircle className={`${chosenIcon} text-[#FF9900]`} />
        <span>Clock Paused</span>
      </span>
    );
  }

  if (clock.status === 'BREACHED') {
    return (
      <span className={`inline-flex items-center rounded-md bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/30 font-bold ${chosenSize}`}>
        <AlertOctagon className={`${chosenIcon} text-red-600 dark:text-red-400 animate-bounce`} />
        <span>{clock.countdownText}</span>
        {clock.escalationLevel > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] uppercase font-bold">
            Escalation L{clock.escalationLevel}
          </span>
        )}
      </span>
    );
  }

  // Running State
  const colorStyles =
    clock.color === 'red'
      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30'
      : clock.color === 'amber'
      ? 'bg-[#FF9900]/15 text-[#B26A00] dark:text-[#FF9900] border-[#FF9900]/40'
      : 'bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border-[#77BC1F]/40';

  return (
    <span className={`inline-flex items-center rounded-md border ${colorStyles} ${chosenSize}`}>
      <Clock className={chosenIcon} />
      <span>{clock.countdownText}</span>
    </span>
  );
};
