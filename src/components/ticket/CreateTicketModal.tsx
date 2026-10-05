import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDepartmentStore } from '../../store/departmentStore';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import { Priority, ServiceCatalogItem } from '../../types';
import { isAfterCutoff } from '../../utils/slaEngine';
import { X, Zap, Clock, AlertTriangle, FileUp, Sparkles, ShieldCheck } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { departments, currentDepartmentId, getDepartmentServices } = useDepartmentStore();
  const { createTicket, getDepartmentRushUsageThisMonth } = useTicketStore();
  const { currentUser } = useAuthStore();

  const [selectedDeptId, setSelectedDeptId] = useState(currentDepartmentId);
  const deptServices = getDepartmentServices(selectedDeptId);

  const initialService = deptServices[0];
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialService?.id || '');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(initialService?.defaultPriority || 'P3');
  const [isRush, setIsRush] = useState(false);
  const [gmApprovalRef, setGmApprovalRef] = useState('');
  const [briefFormData, setBriefFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requestingDeptId = currentUser?.departmentId || 'dept-ops';
  const rushStatus = getDepartmentRushUsageThisMonth(requestingDeptId);
  const [pastCutoff] = useState(() => isAfterCutoff(new Date(), '15:00:00'));

  const activeServiceId = selectedServiceId || deptServices[0]?.id || '';
  const currentService: ServiceCatalogItem | undefined = deptServices.find(s => s.id === activeServiceId);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const s = deptServices.find(item => item.id === serviceId);
    if (s) {
      setPriority(s.defaultPriority || 'P3');
      setBriefFormData({});
      setErrors({});
    }
  };

  const handleBriefFieldChange = (fieldId: string, value: any) => {
    setBriefFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors['title'] = 'Ticket title is required';
    }

    if (isRush && rushStatus.requiresGm && !gmApprovalRef.trim()) {
      newErrors['gmApproval'] = 'GM approval reference is mandatory when exceeding the monthly rush quota';
    }

    // Validate mandatory brief fields per service schema
    if (currentService?.briefSchema) {
      for (const field of currentService.briefSchema) {
        if (field.required) {
          const val = briefFormData[field.id];
          if (val === undefined || val === null || String(val).trim() === '') {
            newErrors[field.id] = `${field.labelEn} is required (No Brief = No Start)`;
          }
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createTicket({
      departmentId: selectedDeptId,
      serviceCatalogId: selectedServiceId,
      title: title.trim(),
      priority,
      isRush,
      rushGmApproved: Boolean(gmApprovalRef),
      briefData: briefFormData,
      requesterId: currentUser?.id || 'unknown',
      requesterName: currentUser?.fullNameEn || 'Store Requester',
      requesterEmail: currentUser?.email || 'requester@bgroceries.com',
      requesterDepartmentId: requestingDeptId,
      requesterDepartmentName: currentUser?.departmentName || 'Store Operations',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16202C] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/15 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-white/95 dark:bg-[#121924] text-[#232F3F] dark:text-white flex items-center justify-between border-b border-gray-200 dark:border-white/10">
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#232F3F] dark:text-white flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#77BC1F] ring-2 ring-[#77BC1F]/30 animate-pulse" />
              <span>{t('ticket.createTitle')}</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-[#8FA0B4] mt-0.5 font-medium">
              SLA B' Groceries INTERNAL — Formal Intake Desk & Turnaround Governance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 dark:text-white/70 hover:text-[#232F3F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-7 space-y-5 text-sm">
          {/* Daily Cut-Off Alert */}
          {pastCutoff && (
            <div className="p-4 rounded-xl bg-[#FF9900]/10 dark:bg-[#FF9900]/15 border border-[#FF9900]/30 dark:border-[#FF9900]/40 flex items-start gap-3 text-amber-900 dark:text-amber-200 shadow-2xs">
              <Clock className="w-5 h-5 text-[#FF9900] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#B26A00] dark:text-[#FF9900] text-sm">3:00 PM Daily Cut-Off Applied</span>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed font-medium">
                  Submissions after 15:00 count from 08:00 AM on the next official business day.
                </p>
              </div>
            </div>
          )}

          {/* Department & Service Catalog Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-xs md:text-sm text-[#232F3F] dark:text-gray-200 mb-1.5">
                Target Department Desk <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setSelectedServiceId('');
                }}
                className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-bold text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameEn} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-xs md:text-sm text-[#232F3F] dark:text-gray-200 mb-1.5">
                Service Catalog Deliverable <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-bold text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
              >
                {deptServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Specs & SLA Benchmark Banner */}
          {currentService && (
            <div className="p-4 bg-[#77BC1F]/10 dark:bg-[#77BC1F]/15 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 rounded-xl space-y-2.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#77BC1F]/20 dark:border-[#77BC1F]/30 pb-2.5">
                <span className="font-extrabold text-[#232F3F] dark:text-white text-sm md:text-base">
                  {currentService.nameEn} <span className="font-khmer font-normal text-gray-600 dark:text-gray-400">({currentService.nameKh})</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] font-bold text-xs shadow-2xs">
                    Std TAT: {currentService.standardTatDays} Business Days
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FF9900]/20 text-[#B26A00] dark:text-[#FF9900] font-bold text-xs shadow-2xs">
                    Rush TAT: {currentService.rushTatHours} Hours
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
                    Review SLA: {currentService.reviewSlaHours}h
                  </span>
                </div>
              </div>
              <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-1.5 font-medium">
                <p>
                  <strong className="text-[#232F3F] dark:text-white">Deliverable Specs:</strong> {currentService.deliverableSpecsEn}
                </p>
                <p>
                  <strong className="text-[#232F3F] dark:text-white">Lead Specialist:</strong> {currentService.responsibleLeadTitleEn}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-bold text-xs md:text-sm text-[#232F3F] dark:text-gray-200 mb-1.5">
              Ticket Summary / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. A4 Weekly Leaflet Promo for Bakery & Fresh Meat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-semibold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
            />
            {errors['title'] && (
              <span className="text-red-500 text-xs font-bold mt-1 block">{errors['title']}</span>
            )}
          </div>

          {/* Priority & Rush Option */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-xs md:text-sm text-[#232F3F] dark:text-gray-200 mb-1.5">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-bold text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
              >
                <option value="P1">P1 - Critical (Crisis PR / Store Launch blocked)</option>
                <option value="P2">P2 - High Priority (Weekly Catalog / Seasonal)</option>
                <option value="P3">P3 - Medium Standard (Regular Campaigns)</option>
                <option value="P4">P4 - Low / Routine (Template updates / Stock)</option>
              </select>
            </div>

            {/* Rush Request Toggle with Monthly Quota indicator */}
            <div className="flex flex-col justify-end">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRush}
                    onChange={(e) => setIsRush(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#77BC1F] rounded focus:ring-[#77BC1F] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-gray-800 dark:text-gray-200">
                    <Zap className="w-4 h-4 fill-[#FF9900] text-[#FF9900]" />
                    <span>Emergency Rush Ticket (Fast TAT)</span>
                  </div>
                </label>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-7 font-medium">
                  {currentUser?.departmentName || 'Your department'} has used{' '}
                  <strong className={rushStatus.used >= 3 ? 'text-red-600 font-bold' : 'text-[#558D14] dark:text-[#77BC1F] font-bold'}>
                    {rushStatus.used} of {rushStatus.quota}
                  </strong>{' '}
                  rush requests this month.
                </div>
              </div>
            </div>
          </div>

          {/* GM Approval Field (If Rush Quota is Exceeded) */}
          {isRush && rushStatus.requiresGm && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs md:text-sm text-red-800 dark:text-red-300">
                <AlertTriangle className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
                <span>Monthly Rush Quota Exceeded (3/3 Limit Reached)</span>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                Rule 7 Enforced: An official GM approval reference or document is required to submit additional rush tickets.
              </p>
              <input
                type="text"
                placeholder="Enter GM Approval Reference / Email Memo details *"
                value={gmApprovalRef}
                onChange={(e) => setGmApprovalRef(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-[#0E1520] border border-red-300 dark:border-red-800 rounded-lg text-xs md:text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors['gmApproval'] && (
                <span className="text-red-600 text-xs font-bold block">{errors['gmApproval']}</span>
              )}
            </div>
          )}

          {/* Dynamic Brief Fields (Rule 1: No Brief = No Start) */}
          {currentService?.briefSchema && currentService.briefSchema.length > 0 && (
            <div className="p-5 bg-gray-50 dark:bg-[#121924] border border-gray-200 dark:border-white/10 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-2.5">
                <span className="font-extrabold text-[#232F3F] dark:text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#77BC1F]" />
                  <span>Mandatory Creative Brief Specifications</span>
                </span>
                <span className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold bg-[#77BC1F]/15 px-2 py-0.5 rounded border border-[#77BC1F]/30">
                  No Brief = No Start
                </span>
              </div>

              {currentService.briefSchema.map((field) => (
                <div key={field.id}>
                  <label className="block font-bold text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                    {field.labelEn}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-khmer font-normal ml-1">({field.labelKh})</span>
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholderEn}
                      value={briefFormData[field.id] || ''}
                      onChange={(e) => handleBriefFieldChange(field.id, e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      value={briefFormData[field.id] || ''}
                      onChange={(e) => handleBriefFieldChange(field.id, e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    >
                      <option value="">-- Please Select --</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      placeholder={field.placeholderEn}
                      value={briefFormData[field.id] || ''}
                      onChange={(e) => handleBriefFieldChange(field.id, e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                    />
                  )}

                  {errors[field.id] && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">{errors[field.id]}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Asset Upload Simulation */}
          <div>
            <label className="block font-bold text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Upload Supporting Assets (Logos, High-Res Packshots, SKU Excel)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-5 text-center hover:border-[#77BC1F] dark:hover:border-[#77BC1F] bg-gray-50/70 dark:bg-white/5 cursor-pointer transition-colors">
              <FileUp className="w-8 h-8 text-[#77BC1F] mx-auto mb-1.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">Click to browse or drag and drop assets</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF, AI, PSD, XLSX up to 50MB</p>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-[#F4F6F8] dark:bg-[#121924] flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#77BC1F]" />
            <span>Encrypted internal corporate ticket intake</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 font-bold text-xs md:text-sm transition-colors cursor-pointer"
            >
              {t('ticket.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-[#77BC1F] hover:bg-[#66A31A] text-white font-extrabold text-xs md:text-sm transition-all shadow-md shadow-[#77BC1F]/30 hover:scale-102 cursor-pointer glow-green"
            >
              {t('ticket.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
