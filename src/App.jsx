import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './page/LoginPage';
import ClayShowcasePage from './page/ClayShowcasePage';
import { Sparkles } from 'lucide-react';

import KanbanPage from './components/kanban/KanbanPage';
import { KanbanProvider } from './context/KanbanContext';

function ClayLauncher() {
  const { currentPage, setCurrentPage } = useApp();

  if (currentPage === 'clay-showcase') return null;

  return (
    <button
      onClick={() => setCurrentPage('clay-showcase')}
      title="Open B'Groceries High-Fidelity Design System Showcase"
      style={{ fontFamily: 'Nunito, sans-serif' }}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FF9900] to-[#E68A00] text-[#0B0F14] font-black text-xs shadow-[0_4px_24px_rgba(255,153,0,0.5)] hover:shadow-[0_6px_30px_rgba(255,153,0,0.7)] transition-all hover:-translate-y-1 active:scale-95 cursor-pointer border border-amber-300/50 select-none"
    >
      <Sparkles className="w-4 h-4 text-[#0B0F14]" />
      <span>Clay UI Showcase</span>
    </button>
  );
}

function AppContent() {
  const { currentPage } = useApp();

  return (
    <>
      {currentPage === 'clay-showcase' ? (
        <ClayShowcasePage />
      ) : currentPage === 'login' ? (
        <LoginPage />
      ) : (
        <KanbanProvider>
          <KanbanPage />
        </KanbanProvider>
      )}
      <ClayLauncher />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
