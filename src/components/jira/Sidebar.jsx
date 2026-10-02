import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Palette,
  Cpu,
  ShoppingCart,
  DollarSign,
  Store,
  Users,
  LayoutGrid,
  Rocket,
  Star,
  Clock,
  ChevronUp,
  Settings,
  Zap,
  FolderKanban
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({
  isOpen = true,
  currentSpace = 'MKT',
  onSelectSpace = () => {}
}) {
  const { lang } = useApp();
  const [hoveredItem, setHoveredItem] = useState(null);

  const SPACES = [
    {
      code: 'MKT',
      name: 'Marketing & Brand',
      nameKh: 'ផ្នែកទីផ្សារ និងម៉ាកសញ្ញា',
      icon: Palette,
      color: '#8777D9',
      key: 'MKT'
    },
    {
      code: 'IT',
      name: 'IT Service Desk',
      nameKh: 'ផ្នែកបច្ចេកវិទ្យាព័ត៌មាន (IT)',
      icon: Cpu,
      color: '#1868DB',
      key: 'IT'
    },
    {
      code: 'PUR',
      name: 'Purchasing & Sourcing',
      nameKh: 'ផ្នែកលទ្ធកម្ម និងទិញទំនិញ',
      icon: ShoppingCart,
      color: '#22A06B',
      key: 'PUR'
    },
    {
      code: 'OPS',
      name: 'Store Operations',
      nameKh: 'ផ្នែកប្រតិបត្តិការផ្សារ',
      icon: Store,
      color: '#CF9F02',
      key: 'OPS'
    },
    {
      code: 'FIN',
      name: 'Finance & Accounting',
      nameKh: 'ផ្នែកហិរញ្ញវត្ថុ និងគណនេយ្យ',
      icon: DollarSign,
      color: '#22A06B',
      key: 'FIN'
    },
    {
      code: 'HR',
      name: 'Human Resources',
      nameKh: 'ផ្នែកធនធានមនុស្ស',
      icon: Users,
      color: '#0C66E4',
      key: 'HR'
    }
  ];

  // Jira-like sidebar nav items
  const NAV_ITEMS = [
    { icon: Rocket, label: 'Your work', labelKh: 'ការងាររបស់អ្នក' },
    { icon: Clock, label: 'Recent', labelKh: 'ថ្មីៗ' },
    { icon: Star, label: 'Starred', labelKh: 'បានសម្គាល់ផ្កាយ' },
    { icon: LayoutGrid, label: 'Dashboards', labelKh: 'ផ្ទាំងគ្រប់គ្រង' }
  ];

  if (!isOpen) return null;

  return (
    <aside
      style={{ width: '240px', minWidth: '240px' }}
      className="h-full bg-[#1A232F] border-r border-[#2E3D50] flex flex-col select-none overflow-hidden text-white"
    >
      {/* Scrollable Nav Area */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* Top nav items */}
        <div className="px-2.5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 h-8.5 rounded-xl text-[13.5px] font-medium text-[#CBD5E1] hover:text-white hover:bg-[#2A384A] transition-all text-left cursor-pointer"
              >
                <Icon size={16} strokeWidth={1.8} className="text-[#94A3B8] shrink-0" />
                <span>{lang === 'kh' ? item.labelKh : item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Spaces / Projects Section */}
        <div className="mt-5 px-2.5">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider">
              Departments & Spaces
            </span>
            <button className="w-5 h-5 rounded-lg hover:bg-[#2A384A] flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer transition-colors">
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-1">
            {SPACES.map((space) => {
              const isActive = space.code === currentSpace;
              const Icon = space.icon;

              return (
                <button
                  key={space.code}
                  onClick={() => onSelectSpace(space.code)}
                  onMouseEnter={() => setHoveredItem(space.code)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-[13.5px] transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#77BC1F]/15 text-[#77BC1F] font-bold border border-[#77BC1F]/40 shadow-[0_0_12px_rgba(119,188,31,0.2)]'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#2A384A]'
                  }`}
                >
                  {/* Colored icon */}
                  <div
                    style={{ backgroundColor: space.color }}
                    className="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                  >
                    <Icon size={12} strokeWidth={2.5} />
                  </div>
                  <span className="truncate">
                    {lang === 'kh' ? space.nameKh : space.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-4 rounded-full bg-[#77BC1F] shadow-[0_0_8px_rgba(119,188,31,0.8)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom pinned */}
      <div className="p-2.5 border-t border-[#2E3D50] bg-[#141C26]/60">
        <button className="w-full flex items-center gap-2.5 px-3 h-8.5 rounded-xl text-[13px] font-medium text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-all text-left cursor-pointer">
          <Settings size={16} strokeWidth={1.8} className="text-[#77BC1F]" />
          <span>{lang === 'kh' ? 'កែសម្រួលរបារចំហៀង' : 'Project settings'}</span>
        </button>
      </div>
    </aside>
  );
}
