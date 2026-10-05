import React from 'react';
import { useDepartmentStore } from '../store/departmentStore';
import { useTicketStore } from '../store/ticketStore';
import { BoardFilterBar } from '../components/kanban/BoardFilterBar';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Sparkles, AlertOctagon, PauseCircle, CheckCircle2 } from 'lucide-react';

export const BoardPage: React.FC = () => {
  const { getCurrentDepartment } = useDepartmentStore();
  const { tickets } = useTicketStore();
  const dept = getCurrentDepartment();

  const deptTickets = tickets.filter(t => t.departmentId === dept.id);
  const activeCount = deptTickets.filter(t => t.status !== 'APPROVED_DELIVERED' && t.status !== 'REJECTED').length;
  const p1Count = deptTickets.filter(t => t.priority === 'P1' && t.status !== 'APPROVED_DELIVERED').length;
  const pausedCount = deptTickets.filter(t => t.status === 'WAITING_FOR_REQUESTER').length;
  const deliveredCount = deptTickets.filter(t => t.status === 'APPROVED_DELIVERED').length;

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors">
      {/* Space Header - Elevated Glassmorphic Design */}
      <div className="px-6 py-5 bg-white/80 dark:bg-[#121924]/80 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/30 text-[#77BC1F] mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#77BC1F] animate-ping" />
            <span>LIVE DESK KANBAN • {dept.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#232F3F] dark:text-white tracking-tight flex items-center gap-3">
            <span>{dept.nameEn}</span>
            <span className="text-base font-semibold text-gray-400 dark:text-gray-400 font-khmer">({dept.nameKh})</span>
          </h1>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 text-xs md:text-sm font-extrabold text-[#558D14] dark:text-[#77BC1F] shadow-xs backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#77BC1F]" />
            <span>Active: {activeCount}</span>
          </div>

          {p1Count > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs md:text-sm font-extrabold text-red-700 dark:text-red-300 animate-pulse shadow-xs backdrop-blur-sm">
              <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>P1 Critical: {p1Count}</span>
            </div>
          )}

          {pausedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9900]/15 dark:bg-[#FF9900]/25 border border-[#FF9900]/40 dark:border-[#FF9900]/50 text-xs md:text-sm font-extrabold text-[#B26A00] dark:text-[#FF9900] shadow-xs backdrop-blur-sm">
              <PauseCircle className="w-4 h-4 text-[#FF9900]" />
              <span>Clock Paused: {pausedCount}</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 text-xs md:text-sm font-extrabold text-[#558D14] dark:text-[#77BC1F] shadow-xs backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
            <span>Delivered: {deliveredCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <BoardFilterBar />

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <KanbanBoard />
      </div>
    </div>
  );
};
