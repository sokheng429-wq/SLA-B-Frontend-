import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkflowStatusKey, Ticket } from '../../types';
import { TicketCard } from './TicketCard';
import { PauseCircle, XCircle } from 'lucide-react';

interface KanbanColumnProps {
  statusKey: WorkflowStatusKey;
  titleEn: string;
  titleKh: string;
  tickets: Ticket[];
  badgeColor?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  statusKey,
  titleEn,
  titleKh,
  tickets,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: statusKey,
  });

  const getHeaderBorderColor = () => {
    switch (statusKey) {
      case 'SUBMITTED': return 'border-t-[#77BC1F]';
      case 'BRIEF_CHECK': return 'border-t-[#FF9900]';
      case 'IN_PRODUCTION': return 'border-t-[#232F3F]';
      case 'IN_REVIEW': return 'border-t-indigo-600';
      case 'APPROVED_DELIVERED': return 'border-t-[#77BC1F]';
      case 'WAITING_FOR_REQUESTER': return 'border-t-[#FF9900]';
      case 'REJECTED': return 'border-t-rose-600';
      default: return 'border-t-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-84 md:w-88 shrink-0 bg-[#F4F6F8]/80 dark:bg-[#121924]/80 backdrop-blur-md rounded-2xl flex flex-col max-h-[calc(100vh-175px)] border-t-4 ${getHeaderBorderColor()} border-x border-b border-gray-200/80 dark:border-white/10 transition-all shadow-sm ${
        isOver ? 'bg-[#77BC1F]/15 border-[#77BC1F] ring-2 ring-[#77BC1F]/50 ring-inset' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-4 pb-3 border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between select-none bg-white/80 dark:bg-[#16202C]/90 rounded-t-2xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold text-xs md:text-sm text-[#232F3F] dark:text-white uppercase tracking-wider">
            {statusKey === 'WAITING_FOR_REQUESTER' && <PauseCircle className="w-4 h-4 text-[#FF9900]" />}
            {statusKey === 'REJECTED' && <XCircle className="w-4 h-4 text-rose-600" />}
            <span>{titleEn}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal font-khmer mt-0.5">
            {titleKh}
          </span>
        </div>

        {/* Count Badge */}
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#232F3F]/10 dark:bg-white/10 text-[#232F3F] dark:text-gray-200 border border-[#232F3F]/15 dark:border-white/10">
          {tickets.length}
        </span>
      </div>

      {/* Cards List with Sortable Context */}
      <div className="flex-1 p-3 overflow-y-auto min-h-[160px] space-y-3">
        <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SortableContext>

        {tickets.length === 0 && (
          <div className="h-32 border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl flex items-center justify-center text-sm font-semibold text-gray-400 dark:text-gray-500 select-none bg-white/40 dark:bg-white/5">
            Drop tickets here
          </div>
        )}
      </div>
    </div>
  );
};
