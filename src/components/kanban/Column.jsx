import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, X, Flame } from 'lucide-react';
import TicketCard from './TicketCard';
import { useKanban } from '../../context/KanbanContext';

export default function Column({ column, tickets = [] }) {
  const { addTicket, assignees, t } = useKanban();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { column }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineAssignee, setInlineAssignee] = useState(assignees[0]?.id || 'SM');
  const [inlineDueDate, setInlineDueDate] = useState('Oct 8');
  const [inlineRush, setInlineRush] = useState(false);
  const [inlineCategory, setInlineCategory] = useState('Social');

  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;

    await addTicket({
      title: inlineTitle.trim(),
      columnId: column.id,
      assigneeId: inlineAssignee,
      dueDate: inlineDueDate,
      is_rush: inlineRush,
      category: inlineCategory,
      priority: inlineRush ? 'P1' : 'P2',
      progress: column.id === 'done' ? 100 : column.id === 'in_progress' ? 25 : 0,
      description: `Task created for ${column.name} column`
    });

    setInlineTitle('');
    setIsAdding(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: '#141c27',
        borderColor: isOver ? '#FF9900' : '#2f3d50',
        padding: '14px'
      }}
      className={`w-80 min-w-[280px] max-w-[340px] flex-1 flex flex-col rounded-[16px] border select-none transition-all duration-200 ${
        isOver ? 'ring-2 ring-[#FF9900]/40 shadow-[0_0_20px_rgba(255,153,0,0.15)]' : ''
      }`}
    >
      {/* Column Header: Status Dot, Name, Count Pill */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            style={{ backgroundColor: column.dotColor }}
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
          />
          <h2 className="text-[14px] font-bold text-[#eef2f6] tracking-tight truncate">
            {column.id === 'todo' ? t('colTodo') :
             column.id === 'in_progress' ? t('colInProgress') :
             column.id === 'in_review' ? t('colInReview') :
             t('colDone')}
          </h2>
        </div>

        {/* Ticket Count Pill */}
        <span className="px-2 py-0.5 rounded-full bg-[#232F3F] border border-[#2f3d50] text-[#8fa0b4] font-mono text-[11px] font-bold">
          {tickets.length}
        </span>
      </div>

      {/* Cards Stream: 12px gap between cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 custom-scrollbar min-h-[140px]">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}

        {tickets.length === 0 && !isAdding && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#2f3d50]/60 rounded-xl text-[12px] text-[#8fa0b4]/60 font-medium">
            Empty column
          </div>
        )}
      </div>

      {/* Inline Quick Add Form */}
      {isAdding ? (
        <form 
          onSubmit={handleInlineSubmit}
          className="mt-3 p-3 rounded-xl bg-[#232F3F] border border-[#FF9900]/50 shadow-xl space-y-2.5"
        >
          <input
            type="text"
            autoFocus
            value={inlineTitle}
            onChange={(e) => setInlineTitle(e.target.value)}
            placeholder={t('ticketTitlePlaceholder')}
            className="w-full h-8 px-2.5 rounded-lg bg-[#141c27] border border-[#2f3d50] text-[13px] text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
          />

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {/* Assignee select */}
            <select
              value={inlineAssignee}
              onChange={(e) => setInlineAssignee(e.target.value)}
              className="h-7 px-1.5 rounded-lg bg-[#141c27] border border-[#2f3d50] text-[#8fa0b4] text-[11px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            >
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.avatar} - {a.name}
                </option>
              ))}
            </select>

            {/* Due date input */}
            <input
              type="text"
              value={inlineDueDate}
              onChange={(e) => setInlineDueDate(e.target.value)}
              placeholder="Due date"
              className="h-7 px-2 rounded-lg bg-[#141c27] border border-[#2f3d50] text-[#8fa0b4] text-[11px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            />

            {/* Category select */}
            <select
              value={inlineCategory}
              onChange={(e) => setInlineCategory(e.target.value)}
              className="h-7 px-1.5 rounded-lg bg-[#141c27] border border-[#2f3d50] text-[#8fa0b4] text-[11px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            >
              <option value="Social">Social</option>
              <option value="Video">Video</option>
              <option value="Packaging">Packaging</option>
              <option value="Campaign">Campaign</option>
              <option value="POSM">POSM</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Rush Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-[#FF9900] select-none">
              <input
                type="checkbox"
                checked={inlineRush}
                onChange={(e) => setInlineRush(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#FF9900] rounded"
              />
              <Flame size={12} className="fill-[#FF9900]" />
              <span>Rush</span>
            </label>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors"
              >
                <X size={15} />
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#77BC1F' }}
                className="px-2.5 py-1 rounded-lg text-[#0B0F14] font-bold text-[11px] shadow-sm hover:bg-[#65A319] transition-colors cursor-pointer"
              >
                {t('add')}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Each column ends with a dashed "+ Add ticket" button */
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-[#2f3d50] hover:border-[#FF9900] text-[#8fa0b4] hover:text-[#FF9900] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-[#232F3F]/40 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>{t('addTicket')}</span>
        </button>
      )}
    </div>
  );
}
