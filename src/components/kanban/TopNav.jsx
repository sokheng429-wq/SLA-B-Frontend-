import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  RefreshCw 
} from 'lucide-react';
import { useKanban } from '../../context/KanbanContext';

import { useApp } from '../../context/AppContext';
import { LogOut, ExternalLink, Settings } from 'lucide-react';

export default function TopNav() {
  const { 
    lang, 
    toggleLang, 
    t, 
    isBackendConnected, 
    pingBackend,
    setIsSettingsOpen
  } = useKanban();

  const { setCurrentPage, user, logout } = useApp();
  const [isPinging, setIsPinging] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    await pingBackend();
    setTimeout(() => setIsPinging(false), 500);
  };

  const handleGoToLogin = () => {
    setShowUserMenu(false);
    setCurrentPage('login');
  };

  return (
    <header 
      style={{ backgroundColor: '#1A232F' }}
      className="h-14 border-b border-[#2f3d50] px-6 flex items-center justify-between gap-4 select-none shrink-0"
    >
      {/* Global Search Bar */}
      <div className="relative w-80 max-w-full">
        <Search 
          size={15} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa0b4]" 
        />
        <input
          type="text"
          placeholder={t('searchGlobal')}
          className="w-full h-8 pl-9 pr-4 rounded-lg bg-[#141c27] border border-[#2f3d50] text-[13px] text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:border-transparent focus-visible:outline-none transition-all"
        />
      </div>

      {/* Right Controls: Backend Status, Language Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Backend Connection Status Pill */}
        <div 
          title="Spring Boot Backend Server (port 8082)"
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            isBackendConnected
              ? 'bg-[#77BC1F]/15 text-[#77BC1F] border-[#77BC1F]/30'
              : 'bg-[#232F3F] text-[#8fa0b4] border-[#2f3d50]'
          }`}
        >
          <span 
            className={`w-2 h-2 rounded-full ${
              isBackendConnected 
                ? 'bg-[#77BC1F] shadow-[0_0_8px_rgba(119,188,31,0.8)]' 
                : 'bg-amber-400/80 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
            }`} 
          />
          <span>{isBackendConnected ? t('backendConnected') : t('backendOffline')}</span>
          <button
            type="button"
            onClick={handlePing}
            title={t('reconnect')}
            className="hover:text-[#eef2f6] transition-colors p-0.5 cursor-pointer"
          >
            <RefreshCw size={11} className={`${isPinging ? 'animate-spin text-[#FF9900]' : ''}`} />
          </button>
        </div>

        {/* EN / ខ្មែរ Language Switcher */}
        <button
          type="button"
          onClick={toggleLang}
          title="Switch language between English and Khmer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#232F3F] hover:bg-[#2A384A] border border-[#2f3d50] text-[#eef2f6] text-[12px] font-bold cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
        >
          <Globe size={14} className="text-[#FF9900]" />
          <span>{lang === 'en' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#232F3F] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF9900] rounded-full shadow-[0_0_6px_rgba(255,153,0,0.8)]" />
        </button>

        {/* User Profile Avatar & Interactive Menu */}
        <div className="relative pl-2 border-l border-[#2f3d50]">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User Profile & Navigation"
            className="w-8 h-8 rounded-full bg-[#77BC1F] text-[#0B0F14] font-black text-xs flex items-center justify-center shadow-md select-none cursor-pointer hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
          >
            {user?.avatar || 'SM'}
          </button>

          {showUserMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#232F3F] border border-[#2f3d50] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="p-3 border-b border-[#2f3d50] bg-[#141c27] rounded-xl mb-1.5">
                <div className="font-bold text-xs text-[#eef2f6] truncate">
                  {user?.fullName || 'Sokha Meas'}
                </div>
                <div className="text-[11px] text-[#8fa0b4] truncate mt-0.5">
                  {user?.email || 'sokha.meas@bgroceries.com'}
                </div>
                <div className="inline-block px-2 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/30">
                  {user?.roleLabel || 'Creative Studio Lead'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] rounded-lg transition-colors text-left cursor-pointer"
              >
                <Settings size={14} className="text-[#FF9900]" />
                <span>SLA Governance Settings</span>
              </button>

              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#8fa0b4] hover:text-[#eef2f6] hover:bg-[#141c27] rounded-lg transition-colors text-left cursor-pointer"
              >
                <ExternalLink size={14} className="text-[#77BC1F]" />
                <span>Switch Account / Sign In Page</span>
              </button>

              <div className="pt-1 mt-1 border-t border-[#2f3d50]">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
