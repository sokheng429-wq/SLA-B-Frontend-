import React from 'react';
import { Calendar, CheckSquare } from 'lucide-react';
import PriorityIcon from './PriorityIcon';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export default function ListView({
  searchQuery = '',
  selectedAssignee = null,
  selectedPriority = null,
  onCardClick = () => {}
}) {
  const { tickets, lang } = useApp();

  const filteredTickets = tickets.filter((ticket) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ticket.title?.toLowerCase().includes(q);
      const matchId = ticket.id?.toLowerCase().includes(q);
      const matchAssignee = ticket.assignee?.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchAssignee) return false;
    }
    if (selectedAssignee && ticket.assignee !== selectedAssignee) return false;
    if (selectedPriority && ticket.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-auto p-6 sm:p-10 bg-[#0B0F14] select-none text-white">
      <div className="border border-[#2E3D50] rounded-2xl overflow-hidden shadow-2xl bg-[#232F3F]">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#1A232F] border-b border-[#2E3D50] text-[#94A3B8] text-[11px] font-black uppercase tracking-wider">
              <th className="py-3 px-4 w-28">Key</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4 w-36">Status</th>
              <th className="py-3 px-4 w-44">Assignee</th>
              <th className="py-3 px-4 w-24">Priority</th>
              <th className="py-3 px-4 w-36">Due Date</th>
              <th className="py-3 px-4 w-40">SLA Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E3D50]">
            {filteredTickets.map((t) => (
              <tr
                key={t.id}
                onClick={() => onCardClick(t)}
                className="hover:bg-[#2A384A]/60 cursor-pointer transition-colors"
              >
                {/* Key */}
                <td className="py-3 px-4 font-mono font-bold text-[#77BC1F] hover:underline flex items-center gap-2">
                  <CheckSquare size={14} className="text-[#77BC1F] shrink-0" />
                  <span>{t.id}</span>
                </td>

                {/* Summary */}
                <td className="py-3 px-4 font-semibold text-white max-w-md truncate">
                  <div className="truncate">{t.title}</div>
                  <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                    {t.catalogName} • {t.department}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <StatusBadge status={t.status} />
                </td>

                {/* Assignee */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={t.assignee || 'Unassigned'} size={22} />
                    <span className="truncate text-[#CBD5E1] text-[13px]">
                      {t.assignee || 'Unassigned'}
                    </span>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <PriorityIcon priority={t.priority} size={14} />
                    <span>{t.priority}</span>
                  </div>
                </td>

                {/* Due Date */}
                <td className="py-3 px-4 text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#FF9900]" />
                    <span>{t.due_date || '30 Sept 2026'}</span>
                  </div>
                </td>

                {/* SLA Status */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      t.clock_state === 'PAUSED'
                        ? 'bg-amber-950/40 text-[#FF9900] border border-amber-600/40'
                        : t.status === 'DELIVERED'
                        ? 'bg-emerald-950/40 text-[#77BC1F] border border-emerald-600/40'
                        : 'bg-sky-950/40 text-sky-400 border border-sky-600/40'
                    }`}
                  >
                    {t.clock_state === 'PAUSED'
                      ? '⏸ Paused'
                      : t.status === 'DELIVERED'
                      ? '✓ Delivered'
                      : '⚡ On Track'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="p-8 text-center text-[#94A3B8]">
            No matching tickets found.
          </div>
        )}
      </div>
    </div>
  );
}
