import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket } from '../../types';
import { PriorityIcon } from '../common/PriorityIcon';
import { SlaCountdownChip } from '../common/SlaCountdownChip';
import { Avatar } from '../common/Avatar';
import { useTicketStore } from '../../store/ticketStore';
import { Zap, MessageSquare, Paperclip, RefreshCw } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { setSelectedTicketId } = useTicketStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    data: { ticket },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedTicketId(ticket.id)}
      className="bg-white/95 dark:bg-[#16202C]/95 rounded-2xl p-4.5 shadow-xs hover:shadow-xl hover:shadow-black/15 border border-gray-200/90 dark:border-white/10 cursor-pointer transition-all duration-200 select-none group relative mb-3.5 active:cursor-grabbing hover:border-[#77BC1F] dark:hover:border-[#77BC1F]/80 hover:-translate-y-1 backdrop-blur-xs"
    >
      {/* Top Row: Ticket Key, Service Code, Rush Badge, Revision Round */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs md:text-sm font-bold text-[#232F3F] dark:text-white group-hover:text-[#558D14] dark:group-hover:text-[#77BC1F] hover:underline">
            {ticket.ticketNumber}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 font-mono">
            {ticket.serviceCode}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ticket.isRush && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-extrabold bg-[#FF9900]/15 dark:bg-[#FF9900]/25 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/40 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
              <span>RUSH</span>
            </span>
          )}

          {ticket.isChangeRequest && (
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              CR (+3d)
            </span>
          )}

          {ticket.revisionCount > 0 && !ticket.isChangeRequest && (
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>Rev {ticket.revisionCount}/2</span>
            </span>
          )}
        </div>
      </div>

      {/* Ticket Title */}
      <h4 className="text-sm font-bold text-[#232F3F] dark:text-gray-100 line-clamp-2 leading-relaxed mb-3 group-hover:text-[#558D14] dark:group-hover:text-[#77BC1F] transition-colors">
        {ticket.title}
      </h4>

      {/* SLA Clock Countdown Chip */}
      <div className="mb-3">
        <SlaCountdownChip ticket={ticket} size="md" />
      </div>

      {/* Bottom Footer: Priority, Comments/Attachments count, Assignee Avatar */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2.5">
          {/* Priority Icon */}
          <PriorityIcon priority={ticket.priority} size="md" />

          {/* Attachments / Comments icons */}
          {ticket.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{ticket.attachments.length}</span>
            </span>
          )}
          {ticket.commentsCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{ticket.commentsCount}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        <div className="flex items-center">
          {ticket.assigneeName ? (
            <div className="flex items-center gap-1.5" title={`Assignee: ${ticket.assigneeName}`}>
              <Avatar name={ticket.assigneeName} avatarUrl={ticket.assigneeAvatar} size="sm" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5"
              title="Unassigned"
            >
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
