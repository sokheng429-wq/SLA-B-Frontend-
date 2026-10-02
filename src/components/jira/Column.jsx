import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import TicketCard from './TicketCard';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Ticket Card Wrapper
function SortableTicketCard({ ticket, onCardClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: ticket.id,
    data: { ticket }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TicketCard
        ticket={ticket}
        onClick={onCardClick}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function Column({
  id,
  title,
  tickets = [],
  isCollapsed = false,
  onToggleCollapse = () => {},
  onCardClick = () => {},
  onCreateClick = () => {}
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { status: id }
  });

  // Column header status styling
  const getStatusConfig = () => {
    switch (id) {
      case 'TO_DO':
        return { color: '#94A3B8', dot: 'bg-slate-400', glow: '' };
      case 'BRIEF_CHECK':
        return { color: '#FF9900', dot: 'bg-[#FF9900]', glow: 'shadow-[0_0_8px_rgba(255,153,0,0.8)]' };
      case 'IN_PROGRESS':
      case 'IN_PRODUCTION':
        return { color: '#FF9900', dot: 'bg-[#FF9900]', glow: 'shadow-[0_0_8px_rgba(255,153,0,0.8)]' };
      case 'IN_REVIEW':
        return { color: '#F59E0B', dot: 'bg-amber-400', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.8)]' };
      case 'DONE':
      case 'DELIVERED':
        return { color: '#77BC1F', dot: 'bg-[#77BC1F]', glow: 'shadow-[0_0_8px_rgba(119,188,31,0.8)]' };
      default:
        return { color: '#94A3B8', dot: 'bg-slate-400', glow: '' };
    }
  };

  const statusConfig = getStatusConfig();

  if (isCollapsed) {
    return (
      <div
        onClick={onToggleCollapse}
        style={{ width: '44px', minWidth: '44px' }}
        className="bg-[#18222E]/80 border border-[#2E3D50] rounded-2xl p-2.5 flex flex-col items-center cursor-pointer hover:bg-[#232F3F] transition-all select-none shadow-md"
      >
        <div
          className="text-[12px] font-black uppercase tracking-wider text-[#94A3B8]"
          style={{ writingMode: 'vertical-rl' }}
        >
          {title} ({tickets.length})
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ width: '284px', minWidth: '284px' }}
      className={`bg-[#18222E]/80 backdrop-blur-xl border border-[#2B3B4E]/80 rounded-2xl flex flex-col max-h-[calc(100vh-210px)] transition-all select-none shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
        isOver ? 'ring-2 ring-[#77BC1F] bg-[#1E2B3A] shadow-[0_0_20px_rgba(119,188,31,0.25)]' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3.5 py-3 shrink-0 border-b border-[#2E3D50]/50">
        <div className="flex items-center gap-2">
          {/* Status Dot */}
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig.dot} ${statusConfig.glow}`} />
          <span
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[13px] font-black uppercase tracking-wide text-white"
          >
            {title}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0B0F14] text-[#94A3B8] border border-[#2E3D50]">
            {tickets.length}
          </span>
        </div>

        <button
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-all cursor-pointer"
          title="Column actions"
        >
          <MoreHorizontal size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2.5">
        <SortableContext
          items={tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tickets.map((ticket) => (
            <SortableTicketCard
              key={ticket.id}
              ticket={ticket}
              onCardClick={onCardClick}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="py-8 text-center text-[#64748B] text-xs font-semibold border border-dashed border-[#2E3D50] rounded-xl my-2">
            No tickets here
          </div>
        )}
      </div>

      {/* Create button at bottom */}
      <div className="px-2.5 pb-2.5 pt-1">
        <button
          onClick={() => onCreateClick(id)}
          className="w-full h-8.5 rounded-xl border border-dashed border-[#2E3D50] hover:border-[#77BC1F]/60 flex items-center justify-center gap-1.5 px-3 text-[13px] font-bold text-[#94A3B8] hover:text-[#77BC1F] hover:bg-[#232F3F]/60 transition-all cursor-pointer"
        >
          <Plus size={15} strokeWidth={2} />
          <span>Add ticket</span>
        </button>
      </div>
    </div>
  );
}
