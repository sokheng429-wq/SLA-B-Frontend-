import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_ASSIGNEES, DEPARTMENTS, COLUMNS } from '../data/mockTickets';
import { backendApi } from '../services/backendApi';
import { kanbanTranslations } from '../i18n/kanbanTranslations';

const KanbanContext = createContext();

export function KanbanProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [assignees] = useState(INITIAL_ASSIGNEES);
  const [departments] = useState(DEPARTMENTS);
  const [columns] = useState(COLUMNS);

  const [activeDepartment, setActiveDepartment] = useState('mkt');
  const [activeTab, setActiveTab] = useState('Board');
  const [searchQuery, setSearchQuery] = useState('');
  const [rushOnly, setRushOnly] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [groupBy, setGroupBy] = useState('none');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [lang, setLang] = useState(() => localStorage.getItem('sla_lang') || 'en');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Language with DOM html attribute
  useEffect(() => {
    localStorage.setItem('sla_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'kh' : 'en'));
  }, []);

  const t = useCallback((key) => {
    return kanbanTranslations[lang]?.[key] || kanbanTranslations.en[key] || key;
  }, [lang]);

  // Load tickets on mount and monitor backend connection
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      const online = await backendApi.checkConnection();
      if (!isMounted) return;
      setIsBackendConnected(online);

      const data = await backendApi.getTickets();
      if (!isMounted) return;
      setTickets(data);
      setIsLoading(false);
    }

    loadData();

    const unsubscribe = backendApi.subscribe((online) => {
      if (isMounted) setIsBackendConnected(online);
    });

    // Periodic ping every 30s
    const interval = setInterval(() => {
      backendApi.checkConnection();
    }, 30000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const pingBackend = useCallback(async () => {
    const online = await backendApi.checkConnection();
    setIsBackendConnected(online);
    return online;
  }, []);

  // Drag & drop ticket move
  const moveTicket = useCallback((ticketId, targetColumnId) => {
    setTickets((prev) => {
      const target = prev.find((t) => t.id === ticketId);
      if (!target || target.columnId === targetColumnId) return prev;

      const isNowDone = targetColumnId === 'done';
      const updates = {
        columnId: targetColumnId,
        doneDate: isNowDone ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
        progress: isNowDone ? 100 : (target.progress === 100 ? 50 : target.progress)
      };

      // Persist via backendApi
      backendApi.updateTicket(ticketId, updates);

      return prev.map((t) => (t.id === ticketId ? { ...t, ...updates } : t));
    });

    // Update selectedTicket if open
    setSelectedTicket((prev) => {
      if (prev && prev.id === ticketId) {
        return { ...prev, columnId: targetColumnId };
      }
      return prev;
    });
  }, []);

  // Create ticket
  const addTicket = useCallback(async (ticketData) => {
    const created = await backendApi.createTicket(ticketData);
    setTickets((prev) => [created, ...prev]);
    return created;
  }, []);

  // Update ticket details
  const updateTicket = useCallback(async (ticketId, updates) => {
    const updated = await backendApi.updateTicket(ticketId, updates);
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, ...updates } : t)));
    setSelectedTicket((prev) => (prev?.id === ticketId ? { ...prev, ...updates } : prev));
    return updated;
  }, []);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filtered tickets
  const filteredTickets = tickets.filter((ticket) => {
    // Match department
    const ticketDept = ticket.deptId || 'mkt';
    if (activeDepartment && ticketDept !== activeDepartment) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        ticket.title.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (rushOnly && !ticket.is_rush) {
      return false;
    }

    if (selectedAssignee && ticket.assigneeId !== selectedAssignee) {
      return false;
    }

    return true;
  });

  return (
    <KanbanContext.Provider
      value={{
        tickets: filteredTickets,
        allTickets: tickets,
        assignees,
        departments,
        columns,
        activeDepartment,
        setActiveDepartment,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        rushOnly,
        setRushOnly,
        selectedAssignee,
        setSelectedAssignee,
        groupBy,
        setGroupBy,
        selectedTicket,
        setSelectedTicket,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        lang,
        toggleLang,
        t,
        isBackendConnected,
        pingBackend,
        moveTicket,
        addTicket,
        updateTicket,
        isLoading
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}

export default KanbanContext;
