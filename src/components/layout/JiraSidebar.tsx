import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDepartmentStore } from '../../store/departmentStore';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import {
  Kanban,
  ListTodo,
  BarChart3,
  BookOpen,
  Users2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  UserCog,
} from 'lucide-react';

export const JiraSidebar: React.FC = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { getCurrentDepartment } = useDepartmentStore();
  const { currentUser } = useAuthStore();
  const { getDepartmentRushUsageThisMonth } = useTicketStore();

  const currentDept = getCurrentDepartment();
  const userDeptId = currentUser?.departmentId || 'dept-ops';
  const rushUsage = getDepartmentRushUsageThisMonth(userDeptId);

  const navItems = [
    { to: '/', label: t('nav.board'), icon: Kanban },
    { to: '/list', label: t('nav.list'), icon: ListTodo },
    { to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { to: '/catalog', label: t('nav.catalog'), icon: BookOpen },
    { to: '/raci', label: t('nav.raci'), icon: Users2 },
    ...(currentUser?.role === 'ADMIN'
      ? [{ to: '/users', label: t('nav.users', 'Manage Users'), icon: UserCog }]
      : []),
    { to: '/admin', label: t('nav.admin'), icon: Settings },
  ];

  return (
    <aside
      className={`bg-white/70 dark:bg-[#121924]/80 backdrop-blur-md border-r border-gray-200/80 dark:border-white/10 flex flex-col justify-between transition-all duration-200 select-none shrink-0 relative ${
        collapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Top Header: Department Info */}
      <div className="p-4.5 border-b border-gray-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#232F3F] dark:bg-[#16202C] text-[#77BC1F] flex items-center justify-center font-black text-sm shrink-0 shadow-md border border-[#171F2A] dark:border-white/15 ring-2 ring-white/10">
            {currentDept.code}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm md:text-base text-[#232F3F] dark:text-white truncate">
                {currentDept.nameEn}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#77BC1F] animate-pulse" />
                <span>Cut-off: {currentDept.dailyCutoffTime.substring(0, 5)} PM</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#77BC1F]/15 dark:bg-[#77BC1F]/25 text-[#232F3F] dark:text-[#77BC1F] border-l-4 border-[#77BC1F] shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#232F3F] dark:hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section: Rush Quota & Collapse Button */}
      <div className="p-3.5 border-t border-gray-200/80 dark:border-white/10 space-y-3">
        {/* Monthly Rush Quota Indicator */}
        {!collapsed ? (
          <div className="p-4 rounded-2xl bg-[#FF9900]/10 dark:bg-[#FF9900]/15 border border-[#FF9900]/30 dark:border-[#FF9900]/40 text-xs shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-100">
              <span className="flex items-center gap-1.5 text-[#B26A00] dark:text-[#FF9900] font-black">
                <Zap className="w-4 h-4 fill-[#FF9900] text-[#FF9900]" />
                <span className="text-xs">Rush Quota</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                  rushUsage.used >= rushUsage.quota
                    ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                    : 'bg-[#FF9900]/25 dark:bg-[#FF9900]/30 text-[#995C00] dark:text-[#FFB347] border border-[#FF9900]/30 dark:border-[#FF9900]/50'
                }`}
              >
                {rushUsage.used} / {rushUsage.quota}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  rushUsage.used >= rushUsage.quota ? 'bg-red-500' : 'bg-[#FF9900]'
                }`}
                style={{ width: `${Math.min(100, (rushUsage.used / rushUsage.quota) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
              {rushUsage.used >= rushUsage.quota
                ? '⚠️ Quota limit reached! Next rush ticket requires GM approval.'
                : `${rushUsage.quota - rushUsage.used} standard rush tickets remaining this month.`}
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title={`Rush Quota: ${rushUsage.used}/${rushUsage.quota}`}>
            <span className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-[#FF9900] cursor-pointer">
              <Zap className="w-5 h-5 fill-[#FF9900]" />
            </span>
          </div>
        )}

        {/* Operational Cutoff Badge */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-white/5 rounded-xl border border-gray-200/60 dark:border-white/10">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <span>Intake Cut-off: <strong className="text-[#232F3F] dark:text-[#FF9900]">3:00 PM</strong></span>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors text-xs font-semibold cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
