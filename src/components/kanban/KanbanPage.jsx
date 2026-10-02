import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import SpaceHeader from './SpaceHeader';
import FilterBar from './FilterBar';
import KanbanBoard from './KanbanBoard';
import TicketDetailDrawer from './TicketDetailDrawer';
import CreateTicketModal from './CreateTicketModal';
import FormsTab from './FormsTab';
import TimelineTab from './TimelineTab';
import PagesTab from './PagesTab';
import ProjectSettingsModal from './ProjectSettingsModal';
import { useKanban } from '../../context/KanbanContext';
import { Flame } from 'lucide-react';

function SummaryTab() {
  const { tickets, allTickets, assignees, activeDepartment, departments } = useKanban();
  const activeDeptObj = departments.find(d => d.id === activeDepartment) || departments[0];

  const total = tickets.length;
  const doneCount = tickets.filter((t) => t.columnId === 'done').length;
  const inProgressCount = tickets.filter((t) => t.columnId === 'in_progress').length;
  const inReviewCount = tickets.filter((t) => t.columnId === 'in_review').length;
  const rushCount = tickets.filter((t) => t.is_rush).length;
  const compliance = activeDeptObj.targetSla || '98.2%';

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        {/* Total Tickets */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">Total</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-[#eef2f6]">{total}</span>
            <span className="text-[10px] text-[#77BC1F] font-bold">Active</span>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">SLA Target</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-[#77BC1F]">{compliance}</span>
          </div>
        </div>

        {/* Urgent Rush */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">Rush Priority</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-[#FF9900]">{rushCount}</span>
            <span className="text-[10px] text-[#FF9900] font-bold">P1</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">In Progress</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-[#FF9900]">{inProgressCount}</span>
            <span className="text-[10px] text-[#8fa0b4]">Active</span>
          </div>
        </div>

        {/* In Review */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">In Review</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-sky-400">{inReviewCount}</span>
            <span className="text-[10px] text-[#8fa0b4]">Pending</span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] block">Completed</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-[#77BC1F]">{doneCount}</span>
            <span className="text-[10px] text-[#77BC1F] font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* Assignee Workload */}
      <div className="p-6 rounded-2xl bg-[#141c27] border border-[#2f3d50]">
        <h3 className="text-base font-bold text-[#eef2f6] mb-4">Creative Team Workload</h3>
        <div className="space-y-4">
          {assignees.map((a) => {
            const count = allTickets.filter((t) => t.assigneeId === a.id).length;
            const pct = Math.min(100, Math.round((count / Math.max(1, total)) * 100));

            return (
              <div key={a.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-[#0B0F14]"
                      style={{ backgroundColor: a.color }}
                    >
                      {a.avatar}
                    </span>
                    <span className="text-[#eef2f6]">{a.name}</span>
                    <span className="text-[#8fa0b4]">({a.role})</span>
                  </div>
                  <span className="text-[#8fa0b4] font-mono">{count} tickets</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#232F3F] overflow-hidden">
                  <div 
                    style={{ width: `${pct}%`, backgroundColor: a.color }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ListTab() {
  const { tickets, setSelectedTicket, assignees } = useKanban();

  return (
    <div className="flex-1 overflow-y-auto px-10 py-4">
      <div className="rounded-2xl border border-[#2f3d50] overflow-hidden bg-[#141c27]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2f3d50] bg-[#232F3F]/60 text-[#8fa0b4] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Key</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2f3d50]/40">
            {tickets.map((ticket) => {
              const assignee = assignees.find((a) => a.id === ticket.assigneeId);

              return (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="hover:bg-[#232F3F]/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#8fa0b4]">
                    {ticket.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#eef2f6]">
                    <div className="flex items-center gap-2">
                      {ticket.is_rush && (
                        <Flame size={13} className="text-[#FF9900] fill-[#FF9900] shrink-0" />
                      )}
                      <span className="truncate max-w-md">{ticket.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 text-[#8fa0b4] border border-white/10">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#8fa0b4]">
                    {ticket.priority}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      style={{
                        backgroundColor: ticket.columnId === 'done' ? 'rgba(119,188,31,0.15)' : ticket.columnId === 'in_progress' ? 'rgba(255,153,0,0.15)' : 'rgba(255,255,255,0.06)',
                        color: ticket.columnId === 'done' ? '#77BC1F' : ticket.columnId === 'in_progress' ? '#FF9900' : '#8fa0b4',
                        borderColor: ticket.columnId === 'done' ? 'rgba(119,188,31,0.3)' : ticket.columnId === 'in_progress' ? 'rgba(255,153,0,0.3)' : 'rgba(255,255,255,0.1)'
                      }}
                      className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border"
                    >
                      {ticket.columnId.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: assignee?.color || '#77BC1F' }}
                        className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-[#0B0F14]"
                      >
                        {assignee?.avatar || 'SM'}
                      </span>
                      <span className="text-[#eef2f6] font-medium">{assignee?.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#8fa0b4]">
                    {ticket.dueDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { activeTab } = useKanban();

  return (
    <div 
      style={{ backgroundColor: '#0B0F14' }}
      className="flex h-screen w-screen overflow-hidden text-[#eef2f6]"
    >
      {/* 1. Left Sidebar (260px, slate background) */}
      <Sidebar />

      {/* 2. Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#0B0F14]">
        {/* Top Bar with Language toggle and Backend indicator */}
        <TopNav />

        {/* Space Header: Breadcrumb, 30px Title, Green Create Button, Tabs */}
        <SpaceHeader />

        {/* Filter Bar: Search, Avatars, Urgent & Rush Chip, Assignee, Group by */}
        <FilterBar />

        {/* Active Tab View */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeTab === 'Board' && <KanbanBoard />}
          {activeTab === 'Summary' && <SummaryTab />}
          {activeTab === 'List' && <ListTab />}
          {activeTab === 'Forms' && <FormsTab />}
          {activeTab === 'Timeline' && <TimelineTab />}
          {activeTab === 'Pages' && <PagesTab />}
        </div>

        {/* Ticket Detail Right Slide-over Drawer */}
        <TicketDetailDrawer />

        {/* Ticket Creation Modal */}
        <CreateTicketModal />

        {/* Project Governance Settings Modal */}
        <ProjectSettingsModal />
      </main>
    </div>
  );
}
