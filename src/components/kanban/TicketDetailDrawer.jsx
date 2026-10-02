import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Flame, 
  Send 
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

function DrawerContent({ ticket, onClose }) {
  const { updateTicket, columns, assignees, t } = useKanban();

  const [title, setTitle] = useState(ticket.title || '');
  const [description, setDescription] = useState(ticket.description || '');
  const [columnId, setColumnId] = useState(ticket.columnId || 'todo');
  const [priority, setPriority] = useState(ticket.priority || 'P2');
  const [isRush, setIsRush] = useState(!!ticket.is_rush);
  const [assigneeId, setAssigneeId] = useState(ticket.assigneeId || 'SM');
  const [dueDate, setDueDate] = useState(ticket.dueDate || '');
  const [progress, setProgress] = useState(ticket.progress || 0);
  const [comments, setComments] = useState([
    { id: 1, author: 'Sokha Meas', time: 'Yesterday at 3:15 PM', text: 'Initial design brief reviewed and aligned with brand guidelines.' },
    { id: 2, author: 'Bopha Chan', time: 'Today at 10:20 AM', text: 'Uploaded high resolution PNG exports to company drive.' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSave = async () => {
    await updateTicket(ticket.id, {
      title,
      description,
      columnId,
      priority,
      is_rush: isRush,
      assigneeId,
      dueDate,
      progress: columnId === 'done' ? 100 : progress
    });
    onClose();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Sokha Meas (You)',
        time: 'Just now',
        text: newComment.trim()
      }
    ]);
    setNewComment('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        style={{ width: '560px', backgroundColor: '#1A232F' }}
        onClick={(e) => e.stopPropagation()}
        className="h-full max-w-full flex flex-col border-l border-[#2f3d50] shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#2f3d50] flex items-center justify-between gap-4 bg-[#232F3F]/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#8fa0b4] bg-[#141c27] px-2.5 py-1 rounded-md border border-[#2f3d50]">
              {ticket.id}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-white/5 text-[#8fa0b4] border border-white/10">
              {ticket.category}
            </span>
            <button
              type="button"
              onClick={() => setIsRush(!isRush)}
              title="Toggle Rush priority"
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isRush
                  ? 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40'
                  : 'bg-white/5 text-[#8fa0b4] border border-white/10 hover:text-[#FF9900]'
              }`}
            >
              <Flame size={12} className={isRush ? 'fill-[#FF9900]' : ''} />
              <span>{isRush ? 'Rush' : 'Normal'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#232F3F] transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                {t('status')}
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none cursor-pointer"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                {t('priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none cursor-pointer"
              >
                <option value="P1">P1 - Critical / Urgent</option>
                <option value="P2">P2 - High Priority</option>
                <option value="P3">P3 - Standard Normal</option>
                <option value="P4">P4 - Low Priority</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                {t('assigneeFilter')}
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none cursor-pointer"
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                {t('due')}
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              />
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between text-[12px] font-bold text-[#8fa0b4] mb-2">
              <span>{t('progress')}</span>
              <span className="text-[#77BC1F] font-mono text-sm">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-[#141c27] rounded-lg appearance-none cursor-pointer accent-[#77BC1F]"
            />
          </div>

          {/* SLA Clock Box */}
          <div className="p-4 rounded-xl bg-[#232F3F] border border-[#2f3d50] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#77BC1F]/20 text-[#77BC1F] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4]">
                  {t('slaCountdown')}
                </span>
                <p className="text-[14px] font-extrabold text-[#eef2f6]">
                  {ticket.tatDays || 3} Business Days TAT (96.4% Compliance)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#77BC1F]/15 text-[#77BC1F] border border-[#77BC1F]/30">
              On Track
            </span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
              {t('description')}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full p-3.5 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none resize-none"
            />
          </div>

          {/* Activity / Comments Stream */}
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-3">
              {t('comments')}
            </h4>

            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#141c27] border border-[#2f3d50]/70 text-[13px]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#8fa0b4] mb-1">
                    <span className="text-[#eef2f6] font-bold">{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-[#eef2f6]/90 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('writeComment')}
                className="flex-1 h-10 px-3.5 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[13px] text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              />
              <button
                type="submit"
                style={{ backgroundColor: '#FF9900' }}
                className="px-4 h-10 rounded-xl text-[#0B0F14] font-bold text-[13px] flex items-center gap-1.5 hover:bg-[#E68A00] transition-colors cursor-pointer"
              >
                <Send size={14} />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#2f3d50] bg-[#232F3F] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#8fa0b4] hover:text-[#eef2f6] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ backgroundColor: '#77BC1F' }}
            className="px-5 py-2 rounded-xl text-[#0B0F14] text-[13px] font-bold shadow-md hover:bg-[#65A319] transition-all cursor-pointer"
          >
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailDrawer() {
  const { selectedTicket, setSelectedTicket } = useKanban();

  if (!selectedTicket) return null;

  return (
    <DrawerContent
      key={selectedTicket.id}
      ticket={selectedTicket}
      onClose={() => setSelectedTicket(null)}
    />
  );
}
