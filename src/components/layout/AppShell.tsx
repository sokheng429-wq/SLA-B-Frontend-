import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { JiraSidebar } from './JiraSidebar';
import { CreateTicketModal } from '../ticket/CreateTicketModal';
import { TicketDetailModal } from '../ticket/TicketDetailModal';
import { useTicketStore } from '../../store/ticketStore';
import { useThemeStore } from '../../store/themeStore';

export const AppShell: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { selectedTicketId, setSelectedTicketId } = useTicketStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? 'bg-[#0B1017] text-white selection:bg-[#77BC1F]/30 selection:text-white'
          : 'bg-[#F4F6F9] text-[#232F3F] selection:bg-[#77BC1F]/20 selection:text-[#232F3F]'
      }`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle at 10% 20%, rgba(119, 188, 31, 0.10) 0%, transparent 40%), radial-gradient(circle at 90% 85%, rgba(255, 153, 0, 0.07) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(35, 47, 63, 0.25) 0%, transparent 60%)'
          : 'radial-gradient(circle at 10% 20%, rgba(119, 188, 31, 0.08) 0%, transparent 35%), radial-gradient(circle at 90% 85%, rgba(255, 153, 0, 0.05) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(35, 47, 63, 0.03) 0%, transparent 50%)',
      }}
    >
      {/* Top Bar (Height 64px, Deep Navy #232F3F with Glassmorphic backdrop) */}
      <TopNav onOpenCreateModal={() => setCreateModalOpen(true)} />

      {/* Main Body: Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <JiraSidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      {createModalOpen && (
        <CreateTicketModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      )}

      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
};
