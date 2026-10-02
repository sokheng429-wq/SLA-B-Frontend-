import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Clock, 
  Globe, 
  Flame, 
  Database, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';
import { backendApi } from '../../services/backendApi';

export default function ProjectSettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    isBackendConnected, 
    pingBackend 
  } = useKanban();

  const [cutoffTime, setCutoffTime] = useState('15:00');
  const [timezone, setTimezone] = useState('Asia/Phnom_Penh (UTC+7)');
  const [rushQuota, setRushQuota] = useState('3');
  const [autoApproveHours, setAutoApproveHours] = useState('48');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleResetData = () => {
    backendApi.resetToMock();
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div 
        style={{ width: '620px', backgroundColor: '#1E2837' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-2xl border border-[#2f3d50] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2f3d50] bg-[#232F3F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF9900]/20 text-[#FF9900] flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#eef2f6]">
                SLA Project &amp; Governance Settings
              </h2>
              <span className="text-xs text-[#8fa0b4]">
                B'Groceries Central Hyperstore Management
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Theme Palette Bar */}
          <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50]">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#8fa0b4]">
              <Palette size={14} className="text-[#FF9900]" />
              <span>Theme Brand Specification</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#FF9900] text-[#0B0F14] font-black shadow-sm">
                #FF9900<br /><span className="text-[9px] font-sans font-bold">Orange</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#77BC1F] text-[#0B0F14] font-black shadow-sm">
                #77BC1F<br /><span className="text-[9px] font-sans font-bold">Green</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B0F14] border border-[#2f3d50] text-[#eef2f6] font-black shadow-sm">
                #0B0F14<br /><span className="text-[9px] font-sans font-bold text-[#8fa0b4]">Black</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#232F3F] border border-[#2f3d50] text-[#eef2f6] font-black shadow-sm">
                #232F3F<br /><span className="text-[9px] font-sans font-bold text-[#8fa0b4]">Slate</span>
              </div>
            </div>
          </div>

          {/* Time & Cutoff */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Intake Cutoff Time
              </label>
              <div className="relative">
                <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa0b4]" />
                <input
                  type="text"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-xs font-mono font-bold text-[#FF9900]"
                />
              </div>
              <span className="text-[10px] text-[#8fa0b4] mt-1 block">Daily deadline for same-day TAT count</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Portal Timezone
              </label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa0b4]" />
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-xs text-[#eef2f6]"
                />
              </div>
              <span className="text-[10px] text-[#8fa0b4] mt-1 block">Phnom Penh, Cambodia Local Time</span>
            </div>
          </div>

          {/* Rules & Quotas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Monthly Rush Quota / Dept
              </label>
              <div className="relative">
                <Flame size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF9900]" />
                <input
                  type="number"
                  value={rushQuota}
                  onChange={(e) => setRushQuota(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-xs font-mono text-[#eef2f6]"
                />
              </div>
              <span className="text-[10px] text-[#8fa0b4] mt-1 block">Max rush tickets per month without GM signoff</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8fa0b4] mb-1.5">
                Auto-Approval Window
              </label>
              <div className="relative">
                <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77BC1F]" />
                <input
                  type="text"
                  value={autoApproveHours}
                  onChange={(e) => setAutoApproveHours(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141c27] border border-[#2f3d50] text-xs font-mono text-[#eef2f6]"
                />
              </div>
              <span className="text-[10px] text-[#8fa0b4] mt-1 block">Hours before delivered ticket auto-approves</span>
            </div>
          </div>

          {/* Backend Connection Diagnostic */}
          <div className="p-4 rounded-xl bg-[#141c27] border border-[#2f3d50] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className={isBackendConnected ? "text-[#77BC1F]" : "text-[#FF9900]"} />
              <div>
                <span className="text-xs font-bold text-[#eef2f6] block">
                  Backend API: http://localhost:8082
                </span>
                <span className="text-[11px] text-[#8fa0b4]">
                  {isBackendConnected 
                    ? 'Spring Boot + PostgreSQL connection active' 
                    : 'Backend offline — Running in local fallback mock mode'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={pingBackend}
              style={{ backgroundColor: '#232F3F' }}
              className="px-3 py-1.5 rounded-lg border border-[#2f3d50] text-xs font-bold text-[#eef2f6] hover:border-[#FF9900] transition-colors cursor-pointer"
            >
              Test Ping
            </button>
          </div>

          {/* Reset Mock Data Action */}
          <div className="pt-2 flex items-center justify-between border-t border-[#2f3d50]/60">
            <div>
              <span className="text-xs font-bold text-rose-400 block">Reset Data to Initial Seed</span>
              <span className="text-[10px] text-[#8fa0b4]">Restore initial mock tickets and clear test creations</span>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{resetSuccess ? 'Restoring...' : 'Reset Data'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2f3d50] bg-[#232F3F] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8fa0b4] hover:text-[#eef2f6] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            style={{ backgroundColor: '#77BC1F' }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#0B0F14] shadow-md hover:bg-[#65A319] transition-all cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
