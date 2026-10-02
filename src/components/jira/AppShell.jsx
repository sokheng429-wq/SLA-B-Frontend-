import React, { useState } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import SpaceHeader from './SpaceHeader';
import BoardToolbar from './BoardToolbar';
import Board from './Board';
import ListView from './ListView';
import SummaryView from './SummaryView';
import TicketDetailPanel from './TicketDetailPanel';
import CreateModal from './CreateModal';
import { useApp } from '../../context/AppContext';

export default function AppShell() {
  const { lang } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSpace, setCurrentSpace] = useState('MKT');
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [boardSearchQuery, setBoardSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCardClick = (ticket) => setSelectedTicket(ticket);
  const handleCloseDetail = () => setSelectedTicket(null);
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0B0F14] text-white relative">
      {/* Subtle Ambient Background Mesh in Theme Colors (#77BC1F & #FF9900) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0 opacity-40">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(119, 188, 31, 0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(255, 153, 0, 0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[500px] h-[300px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(35, 47, 63, 0.6) 0%, transparent 70%)' }}
        />
      </div>

      {/* TOP NAVBAR (56px) */}
      <TopNav
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onCreateClick={handleOpenCreateModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* BODY: SIDEBAR + MAIN */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* LEFT SIDEBAR (240px) */}
        <Sidebar
          isOpen={isSidebarOpen}
          currentSpace={currentSpace}
          onSelectSpace={(code) => {
            setCurrentSpace(code);
            setActiveTab('board');
          }}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0F14]">
          {/* SPACE HEADER & TABS */}
          <SpaceHeader
            activeSpace={currentSpace}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* BOARD VIEW */}
          {activeTab === 'board' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <BoardToolbar
                searchQuery={boardSearchQuery}
                onSearchChange={setBoardSearchQuery}
                selectedAssignee={selectedAssignee}
                onSelectAssignee={setSelectedAssignee}
                selectedPriority={selectedPriority}
                onSelectPriority={setSelectedPriority}
                activeQuickFilter={activeQuickFilter}
                onQuickFilterChange={setActiveQuickFilter}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
              />
              <Board
                searchQuery={boardSearchQuery || searchQuery}
                selectedAssignee={selectedAssignee}
                selectedPriority={selectedPriority}
                activeQuickFilter={activeQuickFilter}
                groupBy={groupBy}
                onCardClick={handleCardClick}
                onCreateClick={handleOpenCreateModal}
              />
            </div>
          )}

          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <BoardToolbar
                searchQuery={boardSearchQuery}
                onSearchChange={setBoardSearchQuery}
                selectedAssignee={selectedAssignee}
                onSelectAssignee={setSelectedAssignee}
                selectedPriority={selectedPriority}
                onSelectPriority={setSelectedPriority}
                activeQuickFilter={activeQuickFilter}
                onQuickFilterChange={setActiveQuickFilter}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
              />
              <ListView
                searchQuery={boardSearchQuery || searchQuery}
                selectedAssignee={selectedAssignee}
                selectedPriority={selectedPriority}
                onCardClick={handleCardClick}
              />
            </div>
          )}

          {/* SUMMARY VIEW */}
          {activeTab === 'summary' && <SummaryView />}

          {/* FORMS TAB */}
          {activeTab === 'forms' && (
            <div className="flex-1 overflow-y-auto p-10 max-w-4xl space-y-6">
              <div className="border border-[#2E3E52] rounded-2xl p-6 bg-[#232F3F] shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2E3E52]">
                  <div>
                    <h3 className="text-[16px] font-bold text-white">
                      Service Catalog Intake Forms
                    </h3>
                    <p className="text-[14px] text-[#94A3B8] mt-0.5">
                      "No Brief = No Start" policy
                    </p>
                  </div>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF9900] to-[#E68A00] hover:from-[#FFA726] hover:to-[#FF9900] text-[#0B0F14] font-black rounded-xl text-[14px] shadow-[0_0_15px_rgba(255,153,0,0.35)] transition-all cursor-pointer"
                  >
                    Open Form
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {[
                    { name: 'POSM & Store Banners', tat: '3 Business Days', fields: 6 },
                    { name: 'Social Promo Posters', tat: '2 Business Days', fields: 4 },
                    { name: 'Video Commercial Reels', tat: '5 Business Days', fields: 4 }
                  ].map((cat) => (
                    <div key={cat.name} className="p-4 bg-[#1A232F] rounded-xl border border-[#2E3E52] hover:border-[#77BC1F]/40 transition-colors">
                      <div className="font-semibold text-white text-[14px] mb-1">{cat.name}</div>
                      <div className="text-[13px] text-[#94A3B8] mb-2">TAT: {cat.tat}</div>
                      <div className="text-[12px] text-[#77BC1F] font-bold">{cat.fields} required fields</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PLACEHOLDER TABS */}
          {['development', 'timeline', 'docs'].includes(activeTab) && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#94A3B8]">
              <h3 className="text-[18px] font-bold text-white mb-1 capitalize">
                {activeTab} View
              </h3>
              <p className="text-[14px] max-w-sm">
                This view is ready for integration.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* TICKET DETAIL PANEL */}
      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={handleCloseDetail}
        />
      )}

      {/* CREATE MODAL */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
}
