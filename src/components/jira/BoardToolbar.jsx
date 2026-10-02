import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  User2,
  SlidersHorizontal,
  Layers,
  MoreHorizontal,
  X
} from 'lucide-react';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export default function BoardToolbar({
  searchQuery = '',
  onSearchChange = () => {},
  selectedAssignee = null,
  onSelectAssignee = () => {},
  selectedPriority = null,
  onSelectPriority = () => {},
  groupBy = 'none',
  onGroupByChange = () => {},
  activeQuickFilter = 'all',
  onQuickFilterChange = () => {}
}) {
  const { lang, tickets } = useApp();

  // Extract unique assignees
  const assignees = Array.from(
    new Set(tickets.map((t) => t.assignee).filter(Boolean))
  );

  return (
    <div className="flex items-center gap-2.5 px-8 sm:px-10 py-3 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#2E3D50]/60 select-none text-white">
      {/* Search Board Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
          <Search size={15} strokeWidth={1.8} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={lang === 'kh' ? 'ស្វែងរក...' : 'Filter tickets...'}
          className="w-[180px] h-8.5 pl-8 pr-7 text-[13px] bg-[#1A232F] border border-[#2E3D50] hover:border-[#3D4F66] focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30 rounded-xl placeholder:text-[#64748B] text-white outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-[#94A3B8] hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Overlapping Assignee Avatars */}
      <div className="flex items-center -space-x-1.5 ml-1">
        {assignees.slice(0, 4).map((assignee, i) => {
          const isSelected = selectedAssignee === assignee;
          return (
            <div
              key={assignee}
              onClick={() => onSelectAssignee(isSelected ? null : assignee)}
              className="cursor-pointer transition-transform"
              style={{ zIndex: 10 - i }}
            >
              <Avatar
                name={assignee}
                size={28}
                title={assignee}
                className={`border-2 border-[#0B0F14] transition-all hover:scale-110 ${
                  isSelected ? 'ring-2 ring-[#77BC1F] scale-110 shadow-[0_0_8px_rgba(119,188,31,0.8)]' : ''
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-[#2E3D50] mx-1" />

      {/* Quick Filter: All vs Rush / P1 */}
      <button
        onClick={() => onQuickFilterChange(activeQuickFilter === 'urgent' ? 'all' : 'urgent')}
        className={`h-8.5 px-3 rounded-xl border text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
          activeQuickFilter === 'urgent'
            ? 'border-[#FF9900] bg-[#FF9900]/15 text-[#FF9900] shadow-[0_0_12px_rgba(255,153,0,0.3)]'
            : 'border-[#2E3D50] bg-[#1A232F] text-[#CBD5E1] hover:text-white hover:border-[#FF9900]/50'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
        <span>Urgent & Rush</span>
      </button>

      {/* Assignee Filter Button */}
      <button
        onClick={() => onSelectAssignee(null)}
        className={`h-8.5 px-3 rounded-xl border text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
          selectedAssignee
            ? 'border-[#77BC1F] bg-[#77BC1F]/15 text-[#77BC1F] shadow-[0_0_12px_rgba(119,188,31,0.3)]'
            : 'border-[#2E3D50] bg-[#1A232F] text-[#CBD5E1] hover:text-white hover:border-[#77BC1F]/50'
        }`}
      >
        <User2 size={15} strokeWidth={1.8} className={selectedAssignee ? 'text-[#77BC1F]' : 'text-[#94A3B8]'} />
        <span>{selectedAssignee ? selectedAssignee : 'Assignee'}</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side: Group by */}
      <button
        className={`h-8.5 px-3 rounded-xl border text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          groupBy !== 'none'
            ? 'border-[#77BC1F] bg-[#77BC1F]/15 text-[#77BC1F]'
            : 'border-[#2E3D50] bg-[#1A232F] text-[#94A3B8] hover:text-white hover:border-[#3D4F66]'
        }`}
      >
        <Layers size={15} strokeWidth={1.8} />
        <span>Group by</span>
        <ChevronDown size={14} strokeWidth={1.8} />
      </button>

      <button className="w-8.5 h-8.5 rounded-xl border border-[#2E3D50] bg-[#1A232F] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#3D4F66] transition-colors cursor-pointer">
        <MoreHorizontal size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
