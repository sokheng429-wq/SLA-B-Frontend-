import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function SpaceHeader() {
  const { 
    activeDepartment,
    departments,
    activeTab, 
    setActiveTab, 
    setIsCreateModalOpen, 
    t 
  } = useKanban();

  const activeDeptObj = departments.find(d => d.id === activeDepartment) || departments[0];
  const deptName = activeDepartment === 'mkt' ? t('marketingAndBrand') :
                   activeDepartment === 'it' ? t('itServiceDesk') :
                   activeDepartment === 'purchasing' ? t('purchasingAndSourcing') :
                   activeDepartment === 'store' ? t('storeOperations') :
                   activeDepartment === 'finance' ? t('financeAndAccounting') :
                   t('humanResources');

  const tabs = [
    { id: 'Summary', labelKey: 'tabSummary' },
    { id: 'List', labelKey: 'tabList' },
    { id: 'Board', labelKey: 'tabBoard' },
    { id: 'Forms', labelKey: 'tabForms' },
    { id: 'Timeline', labelKey: 'tabTimeline' },
    { id: 'Pages', labelKey: 'tabPages' }
  ];

  return (
    <div className="px-10 pt-6 pb-0 select-none bg-transparent">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[#8fa0b4] mb-2 font-medium">
        <span className="hover:text-[#eef2f6] cursor-pointer transition-colors">
          {t('breadcrumbDepartments')}
        </span>
        <ChevronRight size={13} className="text-[#8fa0b4]/60" />
        <span className="text-[#eef2f6] font-semibold flex items-center gap-2">
          <span 
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: activeDeptObj.dotColor }}
          />
          {deptName}
        </span>
      </nav>

      {/* Title & Primary Action */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-[30px] font-bold text-[#eef2f6] tracking-tight leading-none">
          {t('boardTitle')}
        </h1>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ backgroundColor: '#77BC1F' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#0B0F14] font-bold text-[14px] shadow-[0_2px_12px_rgba(119,188,31,0.35)] hover:bg-[#65A319] hover:shadow-[0_4px_16px_rgba(119,188,31,0.45)] transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>{t('createTicket')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-7 border-b border-[#2f3d50] text-[14px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                color: isActive ? '#FF9900' : '#8fa0b4',
                borderBottom: isActive ? '2px solid #FF9900' : '2px solid transparent'
              }}
              className={`pb-3 font-semibold transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
                isActive ? 'font-bold' : 'hover:text-[#eef2f6]'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
