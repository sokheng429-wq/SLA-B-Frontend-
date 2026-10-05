import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '../store/adminStore';
import { useDepartmentStore } from '../store/departmentStore';
import { PriorityIcon } from '../components/common/PriorityIcon';
import {
  Settings,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { slaPolicies, updateSlaPolicy, escalationRules, updateEscalationRule } = useAdminStore();
  const { holidays, addHoliday, removeHoliday } = useDepartmentStore();

  const [activeTab, setActiveTab] = useState<'policies' | 'escalation' | 'holidays'>('policies');

  // New Holiday Form State
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayEn, setNewHolidayEn] = useState('');
  const [newHolidayKh, setNewHolidayKh] = useState('');

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayEn) {
      alert('Please fill in holiday date and name');
      return;
    }
    addHoliday({
      id: `h-${Date.now()}`,
      holidayDate: newHolidayDate,
      nameEn: newHolidayEn,
      nameKh: newHolidayKh || newHolidayEn,
      isRecurring: false,
    });
    setNewHolidayDate('');
    setNewHolidayEn('');
    setNewHolidayKh('');
    alert('Holiday added to business calendar.');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>ENTERPRISE GOVERNANCE • SLA POLICIES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#77BC1F]" />
            <span>{t('nav.admin')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Configurable SLA Priority Policies, Escalation Protocols, and Cambodian Public Holiday Calendar
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 dark:border-white/10 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'policies'
              ? 'border-[#77BC1F] text-[#558D14] dark:text-[#77BC1F] bg-[#77BC1F]/10 dark:bg-[#77BC1F]/20 rounded-t-xl'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>SLA Priority Policies (P1–P4)</span>
        </button>

        <button
          onClick={() => setActiveTab('escalation')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'escalation'
              ? 'border-[#77BC1F] text-[#558D14] dark:text-[#77BC1F] bg-[#77BC1F]/5 dark:bg-[#77BC1F]/15 rounded-t-lg'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Escalation Rules (Level 1–4)</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'holidays'
              ? 'border-[#77BC1F] text-[#558D14] dark:text-[#77BC1F] bg-[#77BC1F]/5 dark:bg-[#77BC1F]/15 rounded-t-lg'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cambodian Holiday Calendar</span>
        </button>
      </div>

      {/* TAB 1: SLA Priority Policies */}
      {activeTab === 'policies' && (
        <div className="space-y-5">
          <div className="p-4 bg-[#77BC1F]/10 dark:bg-[#77BC1F]/15 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 rounded-xl text-sm font-medium text-[#232F3F] dark:text-white shadow-2xs">
            <strong>Rule 11 Enforced:</strong> All response times, TAT business days, and escalation thresholds below are completely configurable in real-time.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {slaPolicies.map((pol) => (
              <div key={pol.id} className="p-5 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <PriorityIcon priority={pol.priorityTier} showLabel size="md" />
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm font-khmer">({pol.nameKh})</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono font-bold">{pol.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 font-bold">
                      Initial Response (Min)
                    </label>
                    <input
                      type="number"
                      value={pol.initialResponseMinutes}
                      onChange={(e) => updateSlaPolicy({ ...pol, initialResponseMinutes: Number(e.target.value) })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 font-bold">
                      Standard TAT (Days)
                    </label>
                    <input
                      type="number"
                      value={pol.tatBusinessDays}
                      onChange={(e) => updateSlaPolicy({ ...pol, tatBusinessDays: Number(e.target.value) })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 font-bold">
                      Approver Role
                    </label>
                    <input
                      type="text"
                      value={pol.approverRole}
                      onChange={(e) => updateSlaPolicy({ ...pol, approverRole: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg font-medium text-xs text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1.5 font-bold">
                      Escalate Alert Delay (Hours)
                    </label>
                    <input
                      type="number"
                      value={pol.alertDelayThresholdHours}
                      onChange={(e) => updateSlaPolicy({ ...pol, alertDelayThresholdHours: Number(e.target.value) })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Escalation Rules */}
      {activeTab === 'escalation' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {escalationRules.map((rule) => (
              <div key={rule.level} className="p-5 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 flex items-center justify-center font-extrabold text-sm border border-red-200 dark:border-red-800">
                      L{rule.level}
                    </span>
                    <span className="font-extrabold text-[#232F3F] dark:text-white text-sm md:text-base">{rule.nameEn}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#232F3F]/10 dark:bg-white/10 text-[#232F3F] dark:text-gray-200">
                    Target: {rule.targetRole}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs font-bold mb-1">Trigger Delay Threshold (Hours overdue)</label>
                    <input
                      type="number"
                      value={rule.triggerDelayHours}
                      onChange={(e) => updateEscalationRule({ ...rule, triggerDelayHours: Number(e.target.value) })}
                      className="w-full p-2 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-xs font-bold mb-1">Mandatory Action Required</label>
                    <textarea
                      rows={2}
                      value={rule.actionRequiredEn}
                      onChange={(e) => updateEscalationRule({ ...rule, actionRequiredEn: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg text-xs md:text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Cambodian Holiday Calendar */}
      {activeTab === 'holidays' && (
        <div className="space-y-5">
          {/* Add Holiday Form */}
          <form onSubmit={handleAddHoliday} className="p-5 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xs flex flex-wrap items-end gap-4 text-sm">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-xs">Holiday Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg font-medium text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-xs">Holiday Name (English)</label>
              <input
                type="text"
                placeholder="e.g. Royal Ploughing Ceremony"
                value={newHolidayEn}
                onChange={(e) => setNewHolidayEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm font-medium text-[#232F3F] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#77BC1F]"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-xs">Holiday Name (Khmer)</label>
              <input
                type="text"
                placeholder="e.g. ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល"
                value={newHolidayKh}
                onChange={(e) => setNewHolidayKh(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg font-khmer text-sm font-medium text-[#232F3F] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#77BC1F]"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#77BC1F] hover:bg-[#66A31A] text-white rounded-lg font-bold text-sm transition-all shadow-md shadow-[#77BC1F]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Holiday</span>
            </button>
          </form>

          {/* Holiday List Table */}
          <div className="bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/90 dark:bg-[#121924] border-b border-gray-200 dark:border-white/10 text-[#232F3F] dark:text-gray-200 font-bold uppercase text-xs">
                <tr>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Name (English)</th>
                  <th className="py-3.5 px-5">Name (Khmer)</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#558D14] dark:text-[#77BC1F]">{h.holidayDate}</td>
                    <td className="py-3.5 px-5 font-bold text-gray-800 dark:text-gray-200">{h.nameEn}</td>
                    <td className="py-3.5 px-5 text-gray-600 dark:text-gray-400 font-khmer">{h.nameKh}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => removeHoliday(h.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Delete Holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
