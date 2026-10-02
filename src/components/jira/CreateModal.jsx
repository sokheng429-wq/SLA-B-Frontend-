import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Sparkles, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CreateModal({ isOpen = false, onClose = () => {} }) {
  const {
    lang,
    user,
    addTicket,
    DEPARTMENTS,
    CATALOG_ITEMS,
    CATALOG_BRIEF_FIELDS,
    rushQuotas
  } = useApp();

  const [departmentCode, setDepartmentCode] = useState('COM');
  const [catalogCode, setCatalogCode] = useState('CAT-POSM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('P2');
  const [isRush, setIsRush] = useState(false);
  const [assignee, setAssignee] = useState('Sokha Meas (Lead Designer)');
  const [dueDate, setDueDate] = useState('2026-10-05');
  const [briefValues, setBriefValues] = useState({});

  if (!isOpen) return null;

  const selectedCatalog =
    CATALOG_ITEMS?.find((c) => c.code === catalogCode) || CATALOG_ITEMS?.[0];
  const dynamicFields = CATALOG_BRIEF_FIELDS?.[catalogCode] || [];

  const handleBriefChange = (key, val) => {
    setBriefValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTicket({
      title,
      description,
      catalogCode,
      catalogName: selectedCatalog.name_en,
      department:
        DEPARTMENTS.find((d) => d.code === departmentCode)?.name_en ||
        'Commercial & Purchasing',
      departmentCode,
      priority,
      is_rush: isRush,
      assignee,
      due_date: dueDate,
      tat_days: selectedCatalog.tat_business_days,
      brief_json: briefValues
    });

    onClose();
  };

  const usedQuota = rushQuotas[departmentCode] || 0;
  const isOverQuota = isRush && usedQuota >= 3;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-[#232F3F] text-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#2E3D50] flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#2E3D50] flex items-center justify-between shrink-0 bg-[#1A232F] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900] shadow-[0_0_8px_rgba(255,153,0,0.8)]" />
            <h2
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="text-[17px] font-black text-white"
            >
              {lang === 'kh' ? 'បង្កើតសំណើ / សំបុត្រការងារ' : 'Create Issue / Service Request'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-[#2A384A] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-[13px]">
          {/* Space / Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
                Project / Space *
              </label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code} className="bg-[#141C26] text-white">
                    {d.name_en} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
                Work Type (Service Catalog) *
              </label>
              <select
                value={catalogCode}
                onChange={(e) => {
                  setCatalogCode(e.target.value);
                  setBriefValues({});
                }}
                className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
              >
                {CATALOG_ITEMS.map((item) => (
                  <option key={item.code} value={item.code} className="bg-[#141C26] text-white">
                    {item.name_en} (TAT {item.tat_business_days}d)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary / Title */}
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Summary / Request Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Flash Sale Banner for Store Front"
              className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white text-[14px] outline-none"
            />
          </div>

          {/* Priority & Rush & Due Date */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
              >
                <option value="P1" className="bg-[#141C26]">P1 - Critical / Urgent (2-4h)</option>
                <option value="P2" className="bg-[#141C26]">P2 - High (24h / 1d)</option>
                <option value="P3" className="bg-[#141C26]">P3 - Medium (Standard 2-3d)</option>
                <option value="P4" className="bg-[#141C26]">P4 - Low (3-5d)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
              >
                <option value="Sokha Meas (Lead Designer)" className="bg-[#141C26]">Sokha Meas (Lead)</option>
                <option value="Bopha Chea (Marketing Ops)" className="bg-[#141C26]">Bopha Chea (Ops)</option>
                <option value="John Smith (Designer)" className="bg-[#141C26]">John Smith (Designer)</option>
                <option value="Sarah Lee (Brand Designer)" className="bg-[#141C26]">Sarah Lee (Brand)</option>
              </select>
            </div>
          </div>

          {/* Rush Checkbox + Quota Notice */}
          <div className="p-3.5 bg-[#1A232F] rounded-xl border border-[#2E3D50] flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-white text-[13px]">
              <input
                type="checkbox"
                checked={isRush}
                onChange={(e) => setIsRush(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF9900] accent-[#FF9900] cursor-pointer"
              />
              <span>Flag as Rush Request (Priority escalation)</span>
            </label>

            <span className="text-[12px] font-bold text-[#FF9900]">
              Used: {usedQuota}/3 monthly quota
            </span>
          </div>

          {isOverQuota && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-[12px] flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>
                Quota exceeded ({usedQuota}/3). This request will require GM sign-off.
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background context or instructions..."
              className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
            />
          </div>

          {/* Dynamic Brief Fields (No Brief = No Start) */}
          {dynamicFields.length > 0 && (
            <div className="pt-3 border-t border-[#2E3D50] space-y-3">
              <div className="text-[12px] font-black uppercase tracking-wider text-[#77BC1F] flex items-center justify-between">
                <span>Required Brief Fields for {selectedCatalog.name_en}</span>
                <span className="text-[11px] text-[#94A3B8]">No Brief = No Start</span>
              </div>

              {dynamicFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[11px] font-bold text-[#CBD5E1] mb-1">
                    {field.label_en} {field.required && <span className="text-[#FF9900]">*</span>}
                  </label>
                  {field.type === 'SELECT' ? (
                    <select
                      required={field.required}
                      value={briefValues[field.key] || ''}
                      onChange={(e) => handleBriefChange(field.key, e.target.value)}
                      className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#141C26] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'LONG_TEXT' ? (
                    <textarea
                      required={field.required}
                      rows={2}
                      value={briefValues[field.key] || ''}
                      onChange={(e) => handleBriefChange(field.key, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
                    />
                  ) : (
                    <input
                      type={field.type === 'NUMBER' ? 'number' : 'text'}
                      required={field.required}
                      value={briefValues[field.key] || ''}
                      onChange={(e) => handleBriefChange(field.key, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full p-2.5 border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl bg-[#141C26] text-white outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E3D50]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1A232F] hover:bg-[#2A384A] text-[#CBD5E1] hover:text-white rounded-xl text-[13px] font-bold transition-all cursor-pointer border border-[#2E3D50]"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="px-5 py-2 bg-gradient-to-r from-[#FF9900] to-[#E68A00] hover:from-[#FFA726] hover:to-[#FF9900] text-[#0B0F14] rounded-xl text-[13.5px] font-black shadow-[0_0_15px_rgba(255,153,0,0.4)] transition-all cursor-pointer"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
