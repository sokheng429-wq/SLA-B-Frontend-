import React, { useState } from 'react';
import { 
  Search, 
  Flame, 
  ChevronDown, 
  Users, 
  Layers, 
  X, 
  Check 
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    rushOnly,
    setRushOnly,
    selectedAssignee,
    setSelectedAssignee,
    assignees,
    groupBy,
    setGroupBy,
    t
  } = useKanban();

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);

  return (
    <div className="px-10 py-4 flex items-center justify-between gap-4 select-none flex-wrap">
      {/* Left side filters: Search, Avatars, Urgent & Rush, Assignee Chip */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Input */}
        <div className="relative w-64">
          <Search 
            size={15} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa0b4]" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('filterPlaceholder')}
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:border-transparent focus-visible:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8fa0b4] hover:text-[#eef2f6]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Overlapping Assignee Avatars (SM, BC, JS, SL) */}
        <div className="flex items-center pl-1">
          <div className="flex items-center -space-x-2">
            {assignees.map((person) => {
              const isSelected = selectedAssignee === person.id;

              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setSelectedAssignee(isSelected ? null : person.id)}
                  title={`${person.name} (${person.role})`}
                  style={{
                    backgroundColor: person.color,
                    boxShadow: isSelected ? '0 0 0 2px #FF9900, 0 0 10px rgba(255,153,0,0.5)' : 'none'
                  }}
                  className={`w-7 h-7 rounded-full text-[#0B0F14] font-black text-[10px] flex items-center justify-center border-2 border-[#141c27] hover:scale-110 hover:z-10 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
                    isSelected ? 'z-10 scale-105' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {person.avatar}
                </button>
              );
            })}
          </div>
          {selectedAssignee && (
            <button
              type="button"
              onClick={() => setSelectedAssignee(null)}
              className="ml-2 text-[11px] text-[#8fa0b4] hover:text-[#FF9900] transition-colors"
            >
              {t('allAssignees')}
            </button>
          )}
        </div>

        {/* Orange "Urgent & Rush" Toggle Chip */}
        <button
          type="button"
          onClick={() => setRushOnly(!rushOnly)}
          style={{
            backgroundColor: rushOnly ? 'rgba(255,153,0,0.2)' : '#232F3F',
            borderColor: rushOnly ? '#FF9900' : '#2f3d50',
            color: rushOnly ? '#FF9900' : '#8fa0b4'
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-bold transition-all cursor-pointer hover:border-[#FF9900] hover:text-[#FF9900] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
            rushOnly ? 'shadow-[0_0_12px_rgba(255,153,0,0.25)]' : ''
          }`}
        >
          <Flame size={15} className={rushOnly ? 'text-[#FF9900] fill-[#FF9900]' : 'text-[#8fa0b4]'} />
          <span>{t('urgentAndRush')}</span>
        </button>

        {/* Assignee Filter Dropdown Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#232F3F] border border-[#2f3d50] text-[13px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:border-[#8fa0b4] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
          >
            <Users size={14} />
            <span>
              {selectedAssignee
                ? assignees.find((a) => a.id === selectedAssignee)?.name
                : t('assigneeFilter')}
            </span>
            <ChevronDown size={14} />
          </button>

          {showAssigneeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-xl bg-[#232F3F] border border-[#2f3d50] shadow-2xl py-1 z-30">
              <button
                type="button"
                onClick={() => {
                  setSelectedAssignee(null);
                  setShowAssigneeDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors text-left"
              >
                <span>{t('allAssignees')}</span>
                {!selectedAssignee && <Check size={14} className="text-[#FF9900]" />}
              </button>
              {assignees.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setSelectedAssignee(a.id);
                    setShowAssigneeDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-[#0B0F14]"
                      style={{ backgroundColor: a.color }}
                    >
                      {a.avatar}
                    </span>
                    <span>{a.name}</span>
                  </div>
                  {selectedAssignee === a.id && <Check size={14} className="text-[#FF9900]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Aligned: "Group by" Chip */}
      <div className="relative ml-auto">
        <button
          type="button"
          onClick={() => setShowGroupByDropdown(!showGroupByDropdown)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#232F3F] border border-[#2f3d50] text-[13px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:border-[#8fa0b4] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
        >
          <Layers size={14} />
          <span>{t('groupBy')}: <span className="text-[#eef2f6] capitalize">{groupBy === 'none' ? t('none') : groupBy}</span></span>
          <ChevronDown size={14} />
        </button>

        {showGroupByDropdown && (
          <div className="absolute top-full right-0 mt-1 w-40 rounded-xl bg-[#232F3F] border border-[#2f3d50] shadow-2xl py-1 z-30">
            {['none', 'priority', 'category'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setGroupBy(mode);
                  setShowGroupByDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors text-left capitalize"
              >
                <span>{mode === 'none' ? t('none') : mode === 'priority' ? t('groupPriority') : t('groupCategory')}</span>
                {groupBy === mode && <Check size={14} className="text-[#FF9900]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
