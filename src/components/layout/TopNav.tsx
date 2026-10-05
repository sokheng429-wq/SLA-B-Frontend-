import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { useTicketStore } from '../../store/ticketStore';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { Avatar } from '../common/Avatar';
import { Search, Plus, Bell, ChevronDown, Check, LogOut, ShieldAlert, Sparkles, Building2, Briefcase, Settings, Users } from 'lucide-react';
import logoImg from '../../assets/Logo1.png';

interface TopNavProps {
  onOpenCreateModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenCreateModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { departments, currentDepartmentId, setCurrentDepartment, getCurrentDepartment } = useDepartmentStore();
  const { filters, setFilters } = useTicketStore();

  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const currentDept = getCurrentDepartment();

  return (
    <header className="h-16 bg-white/90 dark:bg-[#121924]/95 backdrop-blur-md text-[#232F3F] dark:text-white flex items-center justify-between px-5 sticky top-0 z-40 shadow-xs dark:shadow-lg border-b border-gray-200/80 dark:border-white/10 transition-colors duration-200">
      {/* Left: Brand + Department Selector + Create Button */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* Brand */}
        <div className="flex items-center gap-3.5 select-none">
          <div className="relative">
            <img
              src={logoImg}
              alt="SLA B' Groceries INTERNAL"
              className="h-10 md:h-11 w-auto object-contain p-1.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 shadow-xs dark:shadow-md dark:shadow-black/20 hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#77BC1F] ring-2 ring-white dark:ring-[#121924] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-base md:text-lg tracking-tight text-[#232F3F] dark:text-white leading-tight">
                SLA B' Groceries <span className="text-[#77BC1F]">INTERNAL</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#FF9900]/15 dark:bg-[#FF9900]/20 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/30">
                <Sparkles className="w-3 h-3" />
                Live Desk
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-[#8FA0B4] font-semibold leading-none tracking-wide mt-0.5">
              Service Desk & Governance Engine
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-gray-200 dark:bg-white/20 hidden md:block" />

        {/* Department Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDeptMenuOpen(!deptMenuOpen);
              setUserMenuOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold bg-white dark:bg-[#16202C] hover:bg-gray-100 dark:hover:bg-white/10 text-[#232F3F] dark:text-white transition-all border border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/30 cursor-pointer shadow-xs"
          >
            <Building2 className="w-4 h-4 text-[#77BC1F]" />
            <span className="max-w-[160px] truncate">{currentDept.nameEn} ({currentDept.code})</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#8FA0B4]" />
          </button>

          {deptMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-[#16202C] text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl border border-gray-200 dark:border-white/15 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span>Switch Department Desk</span>
                <span className="text-[10px] text-[#77BC1F] font-bold">Official Desks</span>
              </div>
              <div className="p-1 space-y-0.5">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setCurrentDepartment(dept.id);
                      setDeptMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg text-left transition-colors cursor-pointer ${
                      dept.id === currentDepartmentId
                        ? 'bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 font-bold text-[#558D14] dark:text-[#77BC1F]'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{dept.nameEn}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-khmer">{dept.nameKh}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {dept.code}
                      </span>
                      {dept.id === currentDepartmentId && <Check className="w-4 h-4 text-[#77BC1F] stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* "+ Create" Action Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4.5 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-[#77BC1F]/30 hover:scale-102 active:scale-98 cursor-pointer"
          id="btn-create-ticket"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('nav.create')}</span>
        </button>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-lg mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60" />
          <input
            type="text"
            placeholder={t('nav.search') + ' (Ticket key, title, assignee...)'}
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-100/90 dark:bg-white/10 hover:bg-gray-200/70 dark:hover:bg-white/15 focus:bg-white text-[#232F3F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/60 text-sm font-medium rounded-xl border border-gray-200 dark:border-white/20 focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/50 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right: Language, Dark Mode, Notifications, User Menu & Role Switcher */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Dark/Light Mode Switcher */}
        <ThemeToggle size="sm" />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
              setDeptMenuOpen(false);
            }}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white/90 relative transition-colors cursor-pointer border border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/30 shadow-xs"
            title="Notifications & SLA Warnings"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#121924] animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-88 bg-white dark:bg-[#16202C] text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl border border-gray-200 dark:border-white/15 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span>Recent SLA Alerts</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] font-bold">Active Engine</span>
              </div>
              <div className="py-2 flex flex-col gap-2.5 max-h-80 overflow-y-auto">
                <div className="p-3 rounded-lg bg-[#FF9900]/10 dark:bg-[#FF9900]/15 border border-[#FF9900]/30 dark:border-[#FF9900]/40 text-xs">
                  <div className="font-bold text-[#B26A00] dark:text-[#FF9900] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#FF9900]" />
                    <span>Auto-Approve Warning: BGS-MKT-0041</span>
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
                    Promotional pricing proof pending requester feedback. Will auto-approve in 8 hours.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#77BC1F]/10 dark:bg-[#77BC1F]/15 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 text-xs">
                  <div className="font-bold text-[#558D14] dark:text-[#77BC1F] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#77BC1F]" />
                    <span>3:00 PM Daily Cut-off Reminder</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                    Daily intake cut-off is 3:00 PM (Phnom Penh). Requests submitted after 3 PM count from next business day.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setDeptMenuOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/30 cursor-pointer shadow-xs"
          >
            <Avatar name={currentUser?.fullNameEn || 'User'} avatarUrl={currentUser?.avatarUrl} size="sm" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold leading-tight text-[#232F3F] dark:text-white">{currentUser?.fullNameEn}</span>
              <span className="text-xs text-gray-500 dark:text-[#8FA0B4] leading-tight font-medium">{currentUser?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#8FA0B4]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#16202C] text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl border border-gray-200 dark:border-white/15 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                <Avatar name={currentUser?.fullNameEn || 'User'} avatarUrl={currentUser?.avatarUrl} size="md" />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#232F3F] dark:text-white truncate">{currentUser?.fullNameEn}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.email}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 text-xs font-bold bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] rounded-md border border-[#77BC1F]/30">
                    {currentUser?.role}
                  </div>
                </div>
              </div>

              {/* Account Menu */}
              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    if (currentUser) setFilters({ assigneeFilter: currentUser.id });
                    setUserMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left cursor-pointer transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#77BC1F]" />
                  <span>My Work</span>
                </button>
                {currentUser?.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/users');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left cursor-pointer transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#77BC1F]" />
                    <span>Manage Users</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left cursor-pointer transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-white/10 pt-1 px-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-left cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
