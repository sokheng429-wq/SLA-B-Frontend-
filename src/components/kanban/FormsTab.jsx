import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Flame, 
  UploadCloud, 
  Layout,
  Image as ImageIcon,
  Film,
  Zap,
  Box,
  Monitor,
  Key,
  Laptop,
  Wifi,
  Tag,
  FilePlus,
  Truck,
  Snowflake,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';
import { SERVICE_CATALOGS } from '../../data/mockTickets';

const ICON_MAP = {
  Layout,
  Image: ImageIcon,
  Film,
  Zap,
  Box,
  Monitor,
  Key,
  Laptop,
  Wifi,
  Tag,
  FilePlus,
  Truck,
  Snowflake,
  CreditCard,
  UserCheck
};

export default function FormsTab() {
  const { 
    activeDepartment, 
    departments, 
    addTicket, 
    setActiveTab 
  } = useKanban();

  const activeDeptObj = departments.find(d => d.id === activeDepartment) || departments[0];
  const catalogs = SERVICE_CATALOGS[activeDepartment] || SERVICE_CATALOGS.mkt;

  const [selectedCatalog, setSelectedCatalog] = useState(catalogs[0]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    placementOrFormat: 'Facebook / Telegram Feed',
    dimensions: '1080 x 1350 px (4:5)',
    targetDate: '2026-10-10',
    cloudLink: 'https://drive.google.com/bgroceries-assets',
    priority: selectedCatalog?.priority || 'P2',
    isRush: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCatalogSelect = (cat) => {
    setSelectedCatalog(cat);
    setFormData((prev) => ({
      ...prev,
      priority: cat.priority
    }));
    setIsSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await addTicket({
      title: formData.title.trim(),
      description: `${formData.description}\n[Specs: ${formData.dimensions} | Assets: ${formData.cloudLink}]`,
      columnId: 'todo',
      deptId: activeDepartment,
      department: activeDeptObj.name,
      category: selectedCatalog.name.split(' ')[0] || 'Task',
      priority: formData.isRush ? 'P1' : formData.priority,
      is_rush: formData.isRush,
      dueDate: formData.targetDate,
      progress: 0,
      tatDays: parseInt(selectedCatalog.tat) || 3
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setActiveTab('Board');
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
      {/* Banner / SLA Rules Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#232F3F] to-[#141c27] border border-[#2f3d50] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#77BC1F]/20 text-[#77BC1F] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(119,188,31,0.25)]">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#eef2f6]">
              {activeDeptObj.name} · Service Catalog Intake
            </h2>
            <p className="text-xs text-[#8fa0b4] mt-0.5 max-w-xl">
              Official SLA Request Portal for B'Groceries Cambodia. Requests submitted before 3:00 PM ICT start count on the same business day.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0B0F14] border border-[#2f3d50] text-right">
            <span className="text-[10px] font-bold text-[#8fa0b4] uppercase tracking-wider block">Intake Cutoff</span>
            <span className="text-xs font-mono font-bold text-[#FF9900]">15:00 ICT (3:00 PM)</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0B0F14] border border-[#2f3d50] text-right">
            <span className="text-[10px] font-bold text-[#8fa0b4] uppercase tracking-wider block">Target SLA</span>
            <span className="text-xs font-mono font-bold text-[#77BC1F]">{activeDeptObj.targetSla}</span>
          </div>
        </div>
      </div>

      {/* Catalog Grid Selector */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#8fa0b4] mb-3">
          1. Select Request Service Item
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {catalogs.map((cat) => {
            const isSelected = selectedCatalog?.id === cat.id;
            const IconComponent = ICON_MAP[cat.icon] || FileText;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCatalogSelect(cat)}
                style={{
                  borderColor: isSelected ? '#FF9900' : '#2f3d50',
                  backgroundColor: isSelected ? '#232F3F' : '#141c27'
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover:border-[#FF9900]/70 hover:shadow-lg relative focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
                  isSelected ? 'shadow-[0_0_16px_rgba(255,153,0,0.2)]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#FF9900] text-[#0B0F14]' : 'bg-[#232F3F] text-[#8fa0b4]'
                  }`}>
                    <IconComponent size={16} />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-[#0B0F14] text-[#77BC1F] border border-[#2f3d50]">
                    {cat.tat} TAT
                  </span>
                </div>

                <div className="text-[13px] font-bold text-[#eef2f6] leading-snug mb-1">
                  {cat.name}
                </div>
                <div className="text-[11px] text-[#8fa0b4] font-medium">
                  Priority: {cat.priority} · {cat.fee}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed SLA Intake Form */}
      <div className="p-7 rounded-2xl bg-[#141c27] border border-[#2f3d50] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#2f3d50] mb-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#FF9900]" />
            <h3 className="text-base font-bold text-[#eef2f6]">
              2. SLA Brief Form: {selectedCatalog?.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#8fa0b4]">
            <Clock size={14} className="text-[#77BC1F]" />
            <span>Standard TAT: <strong className="text-[#eef2f6]">{selectedCatalog?.tat}</strong></span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#77BC1F]/20 text-[#77BC1F] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(119,188,31,0.4)]">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-[#eef2f6] mb-1">Ticket Submitted Successfully!</h4>
            <p className="text-sm text-[#8fa0b4] max-w-md mb-4">
              Your SLA request has been queued in the Kanban Board with a verified timestamp. Redirecting to board...
            </p>
            <span className="px-3 py-1 rounded-full bg-[#77BC1F]/20 text-[#77BC1F] text-xs font-bold font-mono">
              Redirecting to Board...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Ticket Title / Campaign Summary *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Q4 Weekend Supermarket Fresh Seafood Flash Promo Banner"
                className="w-full h-11 px-4 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[14px] text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                  Format / Placement Type
                </label>
                <input
                  type="text"
                  value={formData.placementOrFormat}
                  onChange={(e) => setFormData({ ...formData, placementOrFormat: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                  Dimensions (WxH or Ratio)
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                  Required Target Date
                </label>
                <input
                  type="text"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  placeholder="e.g. Oct 12"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Cloud Assets / Drive Folder Link
              </label>
              <div className="relative">
                <UploadCloud size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa0b4]" />
                <input
                  type="text"
                  value={formData.cloudLink}
                  onChange={(e) => setFormData({ ...formData, cloudLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Brief Specifications &amp; Key Messaging
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Include headlines, pricing mechanics, target outlet branches, or specific SKU names..."
                className="w-full p-3.5 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-[13px] text-[#eef2f6] focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2f3d50]/70 flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isRush}
                  onChange={(e) => setFormData({ ...formData, isRush: e.target.checked })}
                  className="w-4 h-4 accent-[#FF9900] rounded"
                />
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#FF9900]">
                  <Flame size={14} className="fill-[#FF9900]" />
                  Mark as High Priority Rush (Consumes 1 monthly department quota)
                </span>
              </label>

              <button
                type="submit"
                style={{ backgroundColor: '#77BC1F' }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[#0B0F14] font-bold text-sm shadow-[0_2px_14px_rgba(119,188,31,0.35)] hover:bg-[#65A319] hover:shadow-[0_4px_20px_rgba(119,188,31,0.45)] transition-all cursor-pointer active:scale-95"
              >
                <Send size={16} />
                <span>Submit SLA Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
