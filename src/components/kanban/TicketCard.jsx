import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Clock, CheckCircle2, Flame } from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function TicketCard({ ticket, isOverlay = false }) {
  const { assignees, setSelectedTicket, t } = useKanban();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket }
  });

  const assignee = assignees.find((a) => a.id === ticket.assigneeId) || {
    id: ticket.assigneeId || 'SM',
    name: 'Assignee',
    avatar: ticket.assigneeId || 'SM',
    color: '#77BC1F'
  };

  const isDone = ticket.columnId === 'done';
  const isInProgress = ticket.columnId === 'in_progress';
  const isRush = ticket.is_rush;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50
      }
    : undefined;

  const handleCardClick = () => {
    // If dragging, don't trigger click
    if (isDragging) return;
    setSelectedTicket(ticket);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#232F3F',
        borderLeft: isRush ? '4px solid #FF9900' : '4px solid #2f3d50'
      }}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`rounded-xl p-3.5 select-none transition-all cursor-grab active:cursor-grabbing border-t border-r border-b border-[#2f3d50]/70 hover:border-[#8fa0b4]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
        isDragging ? 'opacity-30 scale-95 ring-2 ring-[#FF9900]' : 'opacity-100'
      } ${isOverlay ? 'shadow-2xl ring-2 ring-[#FF9900] rotate-2 scale-105' : ''}`}
    >
      {/* Top Header: Tag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {isDone && isRush ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/40 shadow-[0_0_8px_rgba(119,188,31,0.2)]">
            <CheckCircle2 size={11} />
            <span>{t('rushCompleted')}</span>
          </span>
        ) : isRush ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-[0_0_8px_rgba(255,153,0,0.25)]">
            <Flame size={11} className="fill-[#FF9900]" />
            <span>{t('highPriorityRush')}</span>
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#8fa0b4] border border-white/10">
            {ticket.category}
          </span>
        )}

        <span className="text-[10px] font-mono font-bold text-[#8fa0b4]/70">
          {ticket.priority}
        </span>
      </div>

      {/* Title: 15px, semi-bold */}
      <h3 
        className={`text-[15px] font-semibold tracking-tight leading-snug line-clamp-2 mb-2 transition-colors ${
          isDone ? 'text-[#8fa0b4] line-through/40' : 'text-[#eef2f6]'
        }`}
      >
        {ticket.title}
      </h3>

      {/* In-progress cards show a thin green (#77BC1F) progress bar under the title */}
      {isInProgress && (
        <div className="my-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#8fa0b4] mb-1">
            <span>{t('progress')}</span>
            <span className="text-[#77BC1F] font-mono">{ticket.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#141c27] overflow-hidden">
            <div
              style={{ width: `${ticket.progress}%`, backgroundColor: '#77BC1F' }}
              className="h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(119,188,31,0.6)]"
            />
          </div>
        </div>
      )}

      {/* Footer: ticket ID + due date on the left, assignee avatar on the right */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2f3d50]/40 mt-1">
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#8fa0b4]">
          <span className="font-mono text-[11px] font-bold text-[#8fa0b4] tracking-wide">
            {ticket.id}
          </span>
          <span className="text-[#8fa0b4]/40">·</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock size={11} className="text-[#8fa0b4]/70" />
            <span>
              {isDone 
                ? `${t('done')} ${ticket.doneDate || 'Sep 28'}` 
                : `${t('due')} ${ticket.dueDate || 'Oct 6'}`}
            </span>
          </span>
        </div>

        {/* Assignee Avatar */}
        <div
          title={`${assignee.name} (${assignee.role})`}
          style={{ backgroundColor: assignee.color }}
          className="w-6 h-6 rounded-full text-[#0B0F14] font-black text-[9px] flex items-center justify-center shadow-sm select-none border border-[#141c27]"
        >
          {assignee.avatar}
        </div>
      </div>
    </div>
  );
}
