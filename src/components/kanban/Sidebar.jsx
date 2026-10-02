import React from 'react';
import { 
  Briefcase, 
  Clock, 
  Star, 
  LayoutDashboard, 
  Settings, 
  ChevronRight
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

export default function Sidebar() {
  const { 
    departments, 
    activeDepartment, 
    setActiveDepartment, 
    setIsSettingsOpen,
    t, 
    lang 
  } = useKanban();

  const navLinks = [
    { id: 'work', icon: Briefcase, labelKey: 'yourWork' },
    { id: 'recent', icon: Clock, labelKey: 'recent' },
    { id: 'starred', icon: Star, labelKey: 'starred' },
    { id: 'dashboards', icon: LayoutDashboard, labelKey: 'dashboards' },
  ];

  return (
    <aside 
      style={{ width: '260px', backgroundColor: '#232F3F' }}
      className="h-screen flex flex-col border-r border-[#2f3d50] select-none shrink-0 z-20"
      aria-label="Sidebar navigation"
    >
      {/* Logo Block: orange rounded square with "B'" + "B'Groceries" */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[#2f3d50]">
        <div className="w-9 h-9 rounded-xl bg-[#FF9900] flex items-center justify-center font-black text-[#0B0F14] text-xl shadow-[0_2px_10px_rgba(255,153,0,0.35)] shrink-0">
          B'
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-[17px] text-[#eef2f6] tracking-tight leading-none truncate">
            {t('brandName')}
          </span>
          <span className="text-[11px] text-[#8fa0b4] font-medium tracking-wide leading-tight truncate mt-1">
            {lang === 'kh' ? 'សេវាកម្មដឹកជញ្ជូនទំនិញ' : 'Cambodia Supermarket'}
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="p-3 space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27]/60 transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
            >
              <Icon size={16} className="text-[#8fa0b4]" />
              <span className="truncate">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Departments Section */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#8fa0b4]/70">
          {t('departments')}
        </div>

        <div className="space-y-0.5">
          {departments.map((dept) => {
            const isActive = dept.id === activeDepartment;

            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setActiveDepartment(dept.id)}
                style={{
                  backgroundColor: isActive ? '#0B0F14' : 'transparent',
                  borderLeft: isActive ? '3px solid #FF9900' : '3px solid transparent'
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-r-lg text-[13px] font-medium transition-all cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none ${
                  isActive 
                    ? 'text-[#eef2f6] font-bold shadow-sm pl-2.5' 
                    : 'text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27]/40 pl-2.5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: dept.dotColor }}
                  />
                  <span className="truncate">
                    {dept.id === 'mkt' ? t('marketingAndBrand') :
                     dept.id === 'it' ? t('itServiceDesk') :
                     dept.id === 'purchasing' ? t('purchasingAndSourcing') :
                     dept.id === 'store' ? t('storeOperations') :
                     dept.id === 'finance' ? t('financeAndAccounting') :
                     t('humanResources')}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight size={14} className="text-[#FF9900] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pinned Bottom: Project Settings */}
      <div className="p-3 border-t border-[#2f3d50] bg-[#1d2735]">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
        >
          <Settings size={16} className="text-[#8fa0b4]" />
          <span className="truncate">{t('projectSettings')}</span>
        </button>
      </div>
    </aside>
  );
}
