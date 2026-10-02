import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame 
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function TimelineTab() {
  const { tickets, assignees, setSelectedTicket } = useKanban();
  const [viewMode, setViewMode] = useState('Days');

  const days = [
    { day: 'Wed', date: 1 },
    { day: 'Thu', date: 2, isToday: true },
    { day: 'Fri', date: 3 },
    { day: 'Sat', date: 4 },
    { day: 'Sun', date: 5 },
    { day: 'Mon', date: 6 },
    { day: 'Tue', date: 7 },
    { day: 'Wed', date: 8 },
    { day: 'Thu', date: 9 },
    { day: 'Fri', date: 10 },
    { day: 'Sat', date: 11 },
    { day: 'Sun', date: 12 },
    { day: 'Mon', date: 13 },
    { day: 'Tue', date: 14 }
  ];

  // Helper to calculate bar offset & width
  const getTimelinePosition = (ticket, index) => {
    // Deterministic layout based on ticket
    const startDay = (index % 4) + 1;
    const duration = ticket.tatDays || (ticket.is_rush ? 2 : 3);
    const leftPercent = ((startDay - 1) / 14) * 100;
    const widthPercent = Math.max(10, (duration / 14) * 100);

    return {
      left: `${leftPercent}%`,
      width: `${Math.min(95 - leftPercent, widthPercent)}%`
    };
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
      {/* Timeline Controls Header */}
      <div className="p-5 rounded-2xl bg-[#141c27] border border-[#2f3d50] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#232F3F] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-base font-extrabold text-[#eef2f6] tracking-tight">
              October 2026
            </span>
            <button
              type="button"
              className="p-1.5 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#232F3F] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#232F3F] p-1 rounded-xl border border-[#2f3d50]">
            {['Days', 'Weeks', 'Months'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === mode 
                    ? 'bg-[#FF9900] text-[#0B0F14] shadow-sm' 
                    : 'text-[#8fa0b4] hover:text-[#eef2f6]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-[#8fa0b4]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F]" />
            <span>Done / Delivered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>In Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>To Do</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Grid */}
      <div className="rounded-2xl border border-[#2f3d50] bg-[#141c27] overflow-hidden shadow-2xl">
        {/* Timeline Header Row */}
        <div className="grid grid-cols-12 border-b border-[#2f3d50] bg-[#232F3F]/60 text-xs font-bold text-[#8fa0b4]">
          {/* Left column: Ticket Info */}
          <div className="col-span-4 p-3.5 border-r border-[#2f3d50] uppercase tracking-wider">
            Ticket &amp; Assignee
          </div>

          {/* Right column: Dates Grid */}
          <div className="col-span-8 grid grid-cols-14 relative">
            {days.map((d) => (
              <div
                key={d.date}
                className={`text-center py-2.5 border-r border-[#2f3d50]/40 last:border-none ${
                  d.isToday ? 'bg-[#FF9900]/15 text-[#FF9900] font-extrabold' : ''
                }`}
              >
                <div className="text-[10px] uppercase">{d.day}</div>
                <div className="text-xs font-mono">{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-[#2f3d50]/40">
          {tickets.map((ticket, idx) => {
            const assignee = assignees.find((a) => a.id === ticket.assigneeId);
            const pos = getTimelinePosition(ticket, idx);
            const isDone = ticket.columnId === 'done';
            const isInProgress = ticket.columnId === 'in_progress';

            const barColor = isDone 
              ? 'bg-[#77BC1F] text-[#0B0F14]' 
              : isInProgress 
              ? 'bg-[#FF9900] text-[#0B0F14]' 
              : ticket.columnId === 'in_review'
              ? 'bg-sky-400 text-[#0B0F14]'
              : 'bg-[#2A384A] text-[#eef2f6] border border-[#2f3d50]';

            return (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="grid grid-cols-12 hover:bg-[#232F3F]/30 transition-colors cursor-pointer group"
              >
                {/* Left Card Info */}
                <div className="col-span-4 p-3.5 border-r border-[#2f3d50] flex items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-[#8fa0b4] group-hover:text-[#FF9900] transition-colors">
                        {ticket.id}
                      </span>
                      {ticket.is_rush && (
                        <Flame size={12} className="text-[#FF9900] fill-[#FF9900]" />
                      )}
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#8fa0b4]">
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#eef2f6] truncate">
                      {ticket.title}
                    </div>
                  </div>

                  <div
                    title={assignee?.name}
                    style={{ backgroundColor: assignee?.color || '#77BC1F' }}
                    className="w-6 h-6 rounded-full text-[9px] font-black text-[#0B0F14] flex items-center justify-center shrink-0 border border-[#141c27]"
                  >
                    {assignee?.avatar || 'SM'}
                  </div>
                </div>

                {/* Right Calendar Area with Gantt Bar */}
                <div className="col-span-8 p-2.5 relative flex items-center">
                  {/* Subtle date grid background lines */}
                  <div className="absolute inset-0 grid grid-cols-14 pointer-events-none opacity-20">
                    {days.map((d) => (
                      <div 
                        key={d.date} 
                        className={`border-r border-[#2f3d50] ${d.isToday ? 'bg-[#FF9900]/20' : ''}`} 
                      />
                    ))}
                  </div>

                  {/* Gantt Bar */}
                  <div
                    style={pos}
                    className={`relative h-7 rounded-lg ${barColor} px-2.5 flex items-center justify-between text-xs font-bold shadow-md hover:scale-y-110 transition-transform z-10`}
                  >
                    <span className="truncate pr-1 text-[11px]">
                      {ticket.category} · {ticket.progress || (isDone ? 100 : 0)}%
                    </span>
                    <span className="text-[10px] font-mono opacity-80 shrink-0">
                      {ticket.tatDays || 3}d TAT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
