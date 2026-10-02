import React from 'react';
import {
  Star,
  MoreHorizontal,
  Zap,
  BarChart3,
  ListFilter,
  KanbanSquare,
  FileText,
  Calendar,
  Code2,
  FileCode2,
  Palette,
  Cpu,
  ShoppingCart,
  DollarSign,
  Store,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SpaceHeader({
  activeSpace = 'MKT',
  activeTab = 'board',
  onTabChange = () => {}
}) {
  const { lang } = useApp();

  const SPACES_INFO = {
    MKT: { name: 'Marketing & Brand', nameKh: 'ផ្នែកទីផ្សារ និងម៉ាកសញ្ញា', key: 'MKT', color: '#8777D9', icon: Palette },
    IT:  { name: 'IT Service Desk', nameKh: 'ផ្នែកបច្ចេកវិទ្យាព័ត៌មាន (IT)', key: 'IT', color: '#1868DB', icon: Cpu },
    PUR: { name: 'Purchasing & Sourcing', nameKh: 'ផ្នែកលទ្ធកម្ម និងទិញទំនិញ', key: 'PUR', color: '#22A06B', icon: ShoppingCart },
    OPS: { name: 'Store Operations', nameKh: 'ផ្នែកប្រតិបត្តិការផ្សារ', key: 'OPS', color: '#CF9F02', icon: Store },
    FIN: { name: 'Finance & Accounting', nameKh: 'ផ្នែកហិរញ្ញវត្ថុ និងគណនេយ្យ', key: 'FIN', color: '#22A06B', icon: DollarSign },
    HR:  { name: 'Human Resources', nameKh: 'ផ្នែកធនធានមនុស្ស', key: 'HR', color: '#0C66E4', icon: Users }
  };

  const space = SPACES_INFO[activeSpace] || SPACES_INFO.MKT;
  const IconComponent = space.icon;

  const TABS = [
    { id: 'summary', label: 'Summary', labelKh: 'សង្ខេប', icon: BarChart3 },
    { id: 'list', label: 'List', labelKh: 'តារាង', icon: ListFilter },
    { id: 'board', label: 'Board', labelKh: 'ផ្ទាំងការងារ', icon: KanbanSquare },
    { id: 'forms', label: 'Forms', labelKh: 'ទម្រង់បែបបទ', icon: FileText },
    { id: 'timeline', label: 'Timeline', labelKh: 'បន្ទាត់ពេលវេលា', icon: Calendar },
    { id: 'development', label: 'Code', labelKh: 'កូដ', icon: Code2 },
    { id: 'docs', label: 'Pages', labelKh: 'ឯកសារ', icon: FileCode2 }
  ];

  return (
    <div className="bg-[#1E2837] border-b border-[#2E3D50] select-none text-white shadow-sm">
      {/* Breadcrumb row */}
      <div className="px-8 sm:px-10 pt-5">
        <div className="flex items-center gap-2 text-[13.5px] text-[#94A3B8] mb-2 font-medium">
          <span className="hover:text-[#77BC1F] hover:underline cursor-pointer transition-colors">Departments</span>
          <span className="text-[#4B5E76]">/</span>
          <span className="text-white font-bold flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shadow-[0_0_6px_rgba(119,188,31,0.8)]"
              style={{ backgroundColor: space.color || '#77BC1F' }}
            />
            {lang === 'kh' ? space.nameKh : space.name}
          </span>
        </div>

        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="text-[22px] font-black text-white tracking-tight"
            >
              {lang === 'kh' ? 'ផ្ទាំងការងារ' : 'SLA Kanban Board'}
            </h1>
            <button
              title="Star this project"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#FF9900] hover:bg-[#2A384A] transition-colors cursor-pointer"
            >
              <Star size={16} strokeWidth={1.8} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-colors cursor-pointer">
              <Zap size={16} strokeWidth={1.8} className="text-[#FF9900]" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-colors cursor-pointer">
              <MoreHorizontal size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-end gap-1 px-8 sm:px-10 mt-3 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 pb-3 pt-2 text-[13.5px] font-bold transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
                isActive
                  ? 'text-white bg-[#263445]/60'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#2A384A]/40'
              }`}
            >
              {Icon && <Icon size={15} strokeWidth={2} className={isActive ? 'text-[#77BC1F]' : 'text-[#64748B]'} />}
              <span>{lang === 'kh' ? tab.labelKh : tab.label}</span>

              {/* Active green underline glow */}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-[#77BC1F] shadow-[0_0_10px_rgba(119,188,31,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
