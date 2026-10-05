import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTicketStore } from '../store/ticketStore';
import { useDepartmentStore } from '../store/departmentStore';
import { PriorityIcon } from '../components/common/PriorityIcon';
import { SlaCountdownChip } from '../components/common/SlaCountdownChip';
import { Avatar } from '../components/common/Avatar';
import { Download, Search, Zap } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ListViewPage: React.FC = () => {
  const { t } = useTranslation();
  const { tickets, setSelectedTicketId } = useTicketStore();
  const { currentDepartmentId, getCurrentDepartment } = useDepartmentStore();
  const dept = getCurrentDepartment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = tickets.filter((t) => {
    if (t.departmentId !== currentDepartmentId) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.serviceCode.toLowerCase().includes(q) ||
        (t.assigneeName && t.assigneeName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportToExcel = () => {
    const exportData = filteredTickets.map((t) => ({
      'Ticket Number': t.ticketNumber,
      'Service Code': t.serviceCode,
      'Title': t.title,
      'Status': t.status,
      'Priority': t.priority,
      'Is Rush': t.isRush ? 'YES' : 'NO',
      'Requester': t.requesterName,
      'Requester Department': t.requesterDepartmentName,
      'Assignee': t.assigneeName || 'Unassigned',
      'Revision Count': `${t.revisionCount} / 2`,
      'Submitted At': t.submittedAt,
      'Deadline': t.slaTargetAt || 'N/A',
      'CSAT Score': t.csatScore || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets_Export');
    XLSX.writeFile(wb, `BGroceries_SLA_Tickets_${dept.code}_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>AUDITED DESK REPOSITORY • {dept.code}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">
            {t('nav.list')} — {dept.nameEn}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Manage, filter, and export formal service desk tickets with full SLA governance
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#77BC1F] hover:bg-[#66A31A] text-white rounded-xl text-sm font-extrabold shadow-md shadow-[#77BC1F]/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export to Excel (.xlsx)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm backdrop-blur-xs">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ticket key, deliverable, or assignee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#77BC1F]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 px-3.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#77BC1F] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="BRIEF_CHECK">Brief Check</option>
            <option value="IN_PRODUCTION">In Production</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED_DELIVERED">Approved / Delivered</option>
            <option value="WAITING_FOR_REQUESTER">Waiting for Requester (Paused)</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-[#121924] border-b border-gray-200 dark:border-white/10 text-[#232F3F] dark:text-gray-200 font-bold uppercase text-xs tracking-wider">
                <th className="py-3.5 px-4">Ticket Key</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Service Code</th>
                <th className="py-3.5 px-5">Title</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">SLA Countdown</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-3">Revisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
                    No tickets found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className="hover:bg-[#77BC1F]/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#232F3F] dark:text-white hover:text-[#558D14] dark:hover:text-[#77BC1F]">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <PriorityIcon priority={t.priority} size="md" />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md font-mono bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 text-xs font-semibold">
                          {t.serviceCode}
                        </span>
                        {t.isRush && (
                          <span className="p-1 rounded bg-[#FF9900]/20 text-[#B26A00] dark:text-[#FF9900]" title="Rush Ticket">
                            <Zap className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#232F3F] dark:text-gray-100 max-w-sm truncate">
                      {t.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#232F3F]/10 dark:bg-white/10 text-[#232F3F] dark:text-gray-200">
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <SlaCountdownChip ticket={t} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                      <div className="font-semibold text-xs md:text-sm">{t.requesterName}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{t.requesterDepartmentName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {t.assigneeName ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={t.assigneeName} avatarUrl={t.assigneeAvatar} size="xs" />
                          <span className="truncate max-w-[120px] font-semibold text-xs md:text-sm text-gray-800 dark:text-gray-200">{t.assigneeName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        Rev {t.revisionCount}/2
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
