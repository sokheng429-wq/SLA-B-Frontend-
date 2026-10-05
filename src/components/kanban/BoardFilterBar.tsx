import React from 'react';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import { MOCK_USERS } from '../../data/mockUsers';
import { Avatar } from '../common/Avatar';
import { Filter, Zap, X } from 'lucide-react';

export const BoardFilterBar: React.FC = () => {
  const { filters, setFilters, tickets } = useTicketStore();
  const { currentUser } = useAuthStore();

  const isMyTicketsOnly = filters.assigneeFilter === currentUser?.id;

  const toggleMyTickets = () => {
    if (isMyTicketsOnly) {
      setFilters({ assigneeFilter: 'ALL' });
    } else if (currentUser) {
      setFilters({ assigneeFilter: currentUser.id });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      assigneeFilter: 'ALL',
      priorityFilter: 'ALL',
      statusFilter: 'ALL',
      rushOnly: false
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.assigneeFilter !== 'ALL' || 
    filters.priorityFilter !== 'ALL' || 
    filters.statusFilter !== 'ALL' || 
    filters.rushOnly;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-white/70 dark:bg-[#121924]/70 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 transition-colors">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-extrabold flex items-center gap-1.5 mr-1">
          <Filter className="w-4 h-4 text-[#232F3F] dark:text-[#77BC1F]" />
          <span>Filters:</span>
        </span>

        {/* Quick Filter: Only My Tickets */}
        <button
          onClick={toggleMyTickets}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
            isMyTicketsOnly
              ? 'bg-[#77BC1F]/15 dark:bg-[#77BC1F]/25 text-[#558D14] dark:text-[#77BC1F] border-[#77BC1F]/50 shadow-sm'
              : 'bg-white/80 dark:bg-[#16202C] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/15 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Only My Tickets
        </button>

        {/* Quick Filter: Rush Requests */}
        <button
          onClick={() => setFilters({ rushOnly: !filters.rushOnly })}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
            filters.rushOnly
              ? 'bg-[#FF9900]/15 dark:bg-[#FF9900]/25 text-[#B26A00] dark:text-[#FF9900] border-[#FF9900]/50 shadow-sm'
              : 'bg-white/80 dark:bg-[#16202C] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/15 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          <Zap className="w-4 h-4 fill-[#FF9900] text-[#FF9900]" />
          <span>Rush Only</span>
        </button>

        {/* Priority Filter */}
        <select
          value={filters.priorityFilter}
          onChange={(e) => setFilters({ priorityFilter: e.target.value })}
          className="px-3.5 py-2 text-xs md:text-sm bg-white/80 dark:bg-[#16202C] border border-gray-200 dark:border-white/15 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#77BC1F] font-bold cursor-pointer shadow-xs"
        >
          <option value="ALL">All Priorities</option>
          <option value="P1">P1 - Critical (Crisis)</option>
          <option value="P2">P2 - High Priority</option>
          <option value="P3">P3 - Medium (Standard)</option>
          <option value="P4">P4 - Low / Routine</option>
        </select>

        {/* Assignee Filter with avatars */}
        <div className="flex items-center gap-1.5 ml-2">
          {MOCK_USERS.slice(0, 5).map((user) => {
            const isSelected = filters.assigneeFilter === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setFilters({ assigneeFilter: isSelected ? 'ALL' : user.id })}
                className={`p-0.5 rounded-full transition-transform cursor-pointer ${
                  isSelected ? 'ring-2 ring-[#77BC1F] scale-110 shadow-sm' : 'hover:opacity-85'
                }`}
                title={user.fullNameEn}
              >
                <Avatar name={user.fullNameEn} avatarUrl={user.avatarUrl} size="sm" />
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs md:text-sm text-[#558D14] dark:text-[#77BC1F] hover:text-[#232F3F] dark:hover:text-white ml-2 font-bold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold">
        <span>Showing <strong className="text-[#232F3F] dark:text-white">{tickets.length}</strong> total tickets</span>
      </div>
    </div>
  );
};
