import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  Grid3X3,
  Search,
  Plus,
  Bell,
  HelpCircle,
  Settings,
  Languages,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export default function TopNav({
  isSidebarOpen = true,
  onToggleSidebar = () => {},
  onCreateClick = () => {},
  searchQuery = '',
  onSearchChange = () => {}
}) {
  const { user, lang, toggleLang, logout, setCurrentPage } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      style={{ height: '56px', minHeight: '56px' }}
      className="bg-[#232F3F] border-b border-[#2E3D50] flex items-center justify-between px-3 z-30 select-none shadow-md"
    >
      {/* LEFT: Sidebar Toggle + App Switcher + Brand */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] active:bg-[#1A232F] transition-colors cursor-pointer"
        >
          <PanelLeft size={19} strokeWidth={1.8} />
        </button>

        {/* 9-Dot App Switcher */}
        <button
          title="B'Groceries Hub"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-colors cursor-pointer"
        >
          <Grid3X3 size={19} strokeWidth={1.8} />
        </button>

        {/* Brand */}
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-[#2A384A] cursor-pointer transition-all ml-0.5 group"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#0B0F14] font-black text-sm shadow-[0_0_12px_rgba(119,188,31,0.45)] group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #77BC1F, #90E026)' }}
          >
            B'
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="font-extrabold text-white text-[15px] tracking-tight"
            >
              B'Groceries
            </span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/30">
              SLA
            </span>
          </div>
        </div>

        {/* Main Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 ml-2">
          {['Your work', 'Projects', 'Filters', 'Dashboards', 'Teams'].map(
            (item) => (
              <button
                key={item}
                className="h-8 px-2.5 rounded-lg text-[13.5px] font-semibold text-[#CBD5E1] hover:text-white hover:bg-[#2A384A] flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>{item}</span>
                <ChevronDown size={14} strokeWidth={1.8} className="text-[#94A3B8]" />
              </button>
            )
          )}
        </nav>

        {/* Primary Create Button (Radiant Orange #FF9900) */}
        <button
          onClick={onCreateClick}
          style={{ fontFamily: 'Nunito, sans-serif' }}
          className="h-8 px-3.5 ml-2 bg-gradient-to-r from-[#FF9900] to-[#E68A00] hover:from-[#FFA726] hover:to-[#FF9900] active:scale-95 text-[#0B0F14] font-black text-[13.5px] rounded-xl flex items-center gap-1.5 shadow-[0_2px_14px_rgba(255,153,0,0.35)] hover:shadow-[0_4px_18px_rgba(255,153,0,0.5)] transition-all shrink-0 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create</span>
        </button>
      </div>

      {/* RIGHT: Search + Notification + Help + Settings + Lang + Profile */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Search Input */}
        <div className="relative hidden lg:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
              <Search size={15} strokeWidth={1.8} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search SLA tickets..."
              className="w-[190px] h-8 pl-8 pr-3 text-[13px] bg-[#141C26] border border-[#2E3D50] hover:border-[#3D4F66] focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30 focus:w-[280px] rounded-xl transition-all placeholder:text-[#64748B] text-white outline-none"
            />
          </div>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-colors cursor-pointer"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF9900] shadow-[0_0_8px_rgba(255,153,0,0.8)]" />
        </button>

        {/* Settings */}
        <button
          title="Settings"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2A384A] transition-colors cursor-pointer"
        >
          <Settings size={18} strokeWidth={1.8} />
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          title="Switch Language"
          className="h-8 px-2.5 rounded-lg text-[12px] font-bold text-[#CBD5E1] bg-[#1A232F] border border-[#2E3D50] hover:border-[#77BC1F]/60 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Languages size={15} strokeWidth={1.8} className="text-[#77BC1F]" />
          <span>{lang === 'kh' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-[#77BC1F] transition-all"
          >
            <Avatar
              name={user?.fullName || user?.username || 'User'}
              size={30}
              className="border-2 border-[#2E3D50]"
            />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-11 w-60 bg-[#232F3F] rounded-2xl border border-[#2E3D50] z-50 text-[14px] py-1 shadow-2xl animate-fadeIn"
            >
              <div className="px-4 py-3 border-b border-[#2E3D50]">
                <div className="font-bold text-white truncate text-[14px]">
                  {user?.fullName || user?.username || 'User'}
                </div>
                <div className="text-[12px] text-[#94A3B8] truncate mt-0.5">
                  {user?.email || 'user@bgroceries.com'}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentPage('login');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#2A384A] text-left text-[13.5px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
                >
                  <UserIcon size={16} className="text-[#77BC1F]" />
                  <span>Switch User</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-900/30 text-left text-[13.5px] text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut size={16} className="text-rose-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
