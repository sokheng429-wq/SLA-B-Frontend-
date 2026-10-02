import React from 'react';
import { CheckSquare } from 'lucide-react';
import PriorityIcon from './PriorityIcon';
import Avatar from './Avatar';

export default function TicketCard({
  ticket,
  onClick = () => {},
  isDragging = false
}) {
  if (!ticket) return null;

  const isUrgent = ticket.priority === 'P1' || ticket.isRush;

  return (
    <div
      onClick={() => onClick(ticket)}
      className={`bg-[#232F3F] border rounded-2xl p-3.5 cursor-pointer select-none transition-all duration-200 group relative ${
        isDragging
          ? 'border-[#FF9900] shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,153,0,0.4)] rotate-1 scale-[1.03] z-50'
          : 'border-[#33465B] shadow-[0_4px_16px_rgba(0,0,0,0.45)] hover:-translate-y-1 hover:border-[#77BC1F]/70 hover:shadow-[0_12px_28px_rgba(0,0,0,0.7),0_0_15px_rgba(119,188,31,0.22)]'
      }`}
    >
      {/* Priority Rush Tag if applicable */}
      {isUrgent && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-[0_0_8px_rgba(255,153,0,0.3)]">
            ⚡ High Priority / Rush
          </span>
        </div>
      )}

      {/* Card Title */}
      <p className="text-[14px] font-bold text-[#F1F5F9] leading-snug mb-3.5 line-clamp-2 group-hover:text-white transition-colors">
        {ticket.title}
      </p>

      {/* Bottom Row: Type Icon + Ticket Key | Priority + Avatar */}
      <div className="flex items-center justify-between pt-1 border-t border-[#2E3D50]/60">
        {/* Left: Work type icon + Ticket ID */}
        <div className="flex items-center gap-1.5">
          <CheckSquare
            size={15}
            strokeWidth={2.2}
            className="text-[#77BC1F] shrink-0"
          />
          <span className="text-[12px] font-mono font-bold text-[#94A3B8] group-hover:text-[#77BC1F] transition-colors">
            {ticket.id}
          </span>
        </div>

        {/* Right: Priority icon + Assignee avatar */}
        <div className="flex items-center gap-2">
          <PriorityIcon priority={ticket.priority || 'P3'} size={15} />
          <Avatar
            name={ticket.assignee || 'Unassigned'}
            size={24}
            title={ticket.assignee || 'Unassigned'}
            className="border-2 border-[#1A232F]"
          />
        </div>
      </div>
    </div>
  );
}
