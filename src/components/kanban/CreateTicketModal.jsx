import React, { useState } from 'react';
import { X, Plus, Flame } from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function CreateTicketModal() {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    addTicket, 
    columns, 
    assignees, 
    t 
  } = useKanban();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('todo');
  const [priority, setPriority] = useState('P2');
  const [isRush, setIsRush] = useState(false);
  const [assigneeId, setAssigneeId] = useState('SM');
  const [category, setCategory] = useState('Social');
  const [dueDate, setDueDate] = useState('Oct 12');

  if (!isCreateModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTicket({
      title: title.trim(),
      description: description.trim(),
      columnId,
      priority,
      is_rush: isRush,
      assigneeId,
      category,
      dueDate,
      progress: columnId === 'done' ? 100 : columnId === 'in_progress' ? 20 : 0
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setIsCreateModalOpen(false)}
    >
      <div 
        style={{ width: '600px', backgroundColor: '#1E2837' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-2xl border border-[#2f3d50] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2f3d50] bg-[#232F3F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#77BC1F]/20 text-[#77BC1F] flex items-center justify-center">
              <Plus size={18} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#eef2f6]">
                {t('createTicket')}
              </h2>
              <span className="text-[11px] text-[#8fa0b4] font-medium">
                B'Groceries SLA System · Marketing & Brand
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
              Ticket Summary / Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Khmer New Year Supermarket Promotional Poster Pack"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[14px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              >
                <option value="Social">Social Media Poster</option>
                <option value="Video">Video / Reel Commercial</option>
                <option value="Packaging">Packaging Adaptation</option>
                <option value="Campaign">360° Campaign Pack</option>
                <option value="POSM">POSM & Store Banner</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Target Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.avatar}) - {a.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Due Date
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Oct 15"
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] font-semibold focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
              >
                <option value="P1">P1 - Urgent</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Standard</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRush}
                  onChange={(e) => setIsRush(e.target.checked)}
                  className="w-4 h-4 accent-[#FF9900] rounded"
                />
                <span className="flex items-center gap-1 text-[13px] font-bold text-[#FF9900]">
                  <Flame size={15} className="fill-[#FF9900]" />
                  Mark as High Priority Rush
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
              Detailed Description / Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background, target audience, dimensions, or cloud links..."
              className="w-full p-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-[#eef2f6] text-[13px] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#2f3d50] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-[#8fa0b4] hover:text-[#eef2f6] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#77BC1F' }}
              className="px-5 py-2 rounded-xl text-[#0B0F14] text-[13px] font-bold shadow-md hover:bg-[#65A319] transition-all cursor-pointer"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
