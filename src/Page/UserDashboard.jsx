import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  Grid, 
  Kanban, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bookmark, 
  CheckSquare, 
  CircleDot, 
  ChevronsUp, 
  ChevronUp, 
  Equal, 
  ChevronDown as ChevronDownIcon, 
  MoreHorizontal, 
  X, 
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  ShieldAlert,
  ArrowLeft,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  Zap,
  Building,
  FileText,
  MessageSquare,
  History,
  FileCheck,
  FileWarning,
  ExternalLink,
  Send,
  Lock
} from 'lucide-react';
import { 
  useApp, 
  DEPARTMENTS, 
  CATALOG_ITEMS, 
  CATALOG_BRIEF_FIELDS, 
  SLA_SETTINGS 
} from '../context/AppContext';
import logoImg from '../assets/Logo2.png';
import './UserDashboard.css';

export default function UserDashboard() {
  const { 
    theme, 
    toggleTheme, 
    lang, 
    toggleLang, 
    t, 
    user, 
    logout, 
    setCurrentPage,
    tickets, 
    moveTicket, 
    pauseTicket,
    resumeTicket,
    requestRevision,
    addComment,
    addTicket, 
    deleteTicket,
    rushQuotas 
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'my' | 'paused' | 'running' | 'p1-rush'
  const [selectedDept, setSelectedDept] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailTab, setDetailTab] = useState('brief'); // 'brief' | 'clock' | 'revisions' | 'approvals' | 'comments'
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('board');

  // Pause Clock Modal state
  const [pauseModalTicket, setPauseModalTicket] = useState(null);
  const [pauseReason, setPauseReason] = useState('MISSING_ASSETS');

  // Revision Form state in detail drawer
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Comment Form state in detail drawer
  const [commentBody, setCommentBody] = useState('');
  const [isCommentInternal, setIsCommentInternal] = useState(false);

  // Form state for creating new Marketing SLA Request
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    catalogCode: 'CAT-POSM',
    catalogName: 'POSM & Store Banners',
    department: 'Commercial & Purchasing',
    departmentCode: 'COM',
    priority: 'P2',
    is_rush: false,
    is_promo_pricing: false,
    tat_days: 3,
    assignee: 'Sokha Meas (Lead Designer)',
    brief_json: {}
  });

  // Calculate 3:00 PM cutoff status
  const cutoffInfo = useMemo(() => {
    const now = new Date();
    const isPast = now.getHours() >= 15;
    return {
      isPast,
      label: isPast 
        ? '⚠️ After 3:00 PM cutoff: Counted starting next business day'
        : '✅ Before 3:00 PM cutoff: Counted starting today'
    };
  }, []);

  // Department Rush Quota status
  const currentDeptQuota = rushQuotas[newRequest.departmentCode] || 0;
  const isOverQuota = newRequest.is_rush && currentDeptQuota >= SLA_SETTINGS.rush_quota_per_month;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search text query
      const matchesSearch = 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Department filter
      if (selectedDept !== 'all' && ticket.departmentCode !== selectedDept) {
        return false;
      }

      // Quick filters
      if (activeFilter === 'my') {
        return ticket.departmentCode === 'COM';
      }
      if (activeFilter === 'p1-rush') {
        return ticket.priority === 'P1' || ticket.is_rush;
      }
      if (activeFilter === 'paused') {
        return ticket.clock_state === 'PAUSED';
      }
      if (activeFilter === 'running') {
        return ticket.clock_state === 'RUNNING';
      }

      return true;
    });
  }, [tickets, searchQuery, selectedDept, activeFilter]);

  // SLA Stats calculation based on Marketing SLA policies
  const stats = useMemo(() => {
    const total = tickets.length;
    const delivered = tickets.filter(t => t.status === 'DELIVERED').length;
    const metCount = tickets.filter(t => t.sla_met).length;
    const rushCount = tickets.filter(t => t.is_rush).length;
    const pausedCount = tickets.filter(t => t.clock_state === 'PAUSED').length;
    const complianceRate = delivered > 0 ? ((metCount / delivered) * 100).toFixed(0) : '100';

    return { total, delivered, complianceRate, rushCount, pausedCount };
  }, [tickets]);

  // Handle Catalog Item selection in Create Modal
  const handleCatalogSelect = (catCode) => {
    const item = CATALOG_ITEMS.find(c => c.code === catCode) || CATALOG_ITEMS[0];
    setNewRequest(prev => ({
      ...prev,
      catalogCode: item.code,
      catalogName: item.name_en,
      tat_days: item.tat_business_days,
      priority: item.default_priority,
      is_rush: item.default_priority === 'P1',
      brief_json: {}
    }));
  };

  // Handle Dynamic Brief Field change
  const handleBriefFieldChange = (key, val) => {
    setNewRequest(prev => ({
      ...prev,
      brief_json: {
        ...prev.brief_json,
        [key]: val
      }
    }));
  };

  // Handle Create Request submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.title.trim()) return;

    addTicket({
      ...newRequest,
      slaTimeLeft: `${newRequest.tat_days} Business Days target`,
      due_date: '2026-10-04'
    });

    setIsCreateModalOpen(false);
    setNewRequest({
      title: '',
      description: '',
      catalogCode: 'CAT-POSM',
      catalogName: 'POSM & Store Banners',
      department: 'Commercial & Purchasing',
      departmentCode: 'COM',
      priority: 'P2',
      is_rush: false,
      is_promo_pricing: false,
      tat_days: 3,
      assignee: 'Sokha Meas (Lead Designer)',
      brief_json: {}
    });
  };

  // Helper for priority badge icon
  const renderPriorityBadge = (priority, isRush) => {
    if (isRush || priority === 'P1') {
      return (
        <span className="mkt-priority-pill p1" title="P1: Rush (GM Approval if > quota)">
          <Zap size={11} /> P1 RUSH
        </span>
      );
    }
    if (priority === 'P2') {
      return (
        <span className="mkt-priority-pill p2" title="P2: High Priority (3-day TAT)">
          <ChevronsUp size={12} /> P2
        </span>
      );
    }
    if (priority === 'P3') {
      return (
        <span className="mkt-priority-pill p3" title="P3: Standard Priority">
          <Equal size={12} /> P3
        </span>
      );
    }
    return (
      <span className="mkt-priority-pill p4" title="P4: Routine Request">
        <ChevronDownIcon size={12} /> P4
      </span>
    );
  };

  // Helper for clock state badge
  const renderClockBadge = (ticket) => {
    if (ticket.clock_state === 'PAUSED') {
      return (
        <div className="mkt-clock-badge paused" title={`Paused: ${ticket.pause_reason}`}>
          <PauseCircle size={12} />
          <span>PAUSED ({ticket.pause_reason === 'MISSING_ASSETS' ? 'Missing Assets' : ticket.pause_reason === 'MISSING_INFO' ? 'Missing Info' : 'Awaiting Requester'})</span>
        </div>
      );
    }
    if (ticket.clock_state === 'STOPPED' || ticket.status === 'DELIVERED') {
      return (
        <div className="mkt-clock-badge stopped" title="SLA Met: Asset Delivered">
          <CheckCircle size={12} />
          <span>SLA MET</span>
        </div>
      );
    }
    return (
      <div className="mkt-clock-badge running" title="SLA Clock Running">
        <PlayCircle size={12} />
        <span>CLOCK RUNNING</span>
      </div>
    );
  };

  // 4 Core Pipeline Columns from PostgreSQL ticket_status
  const columns = [
    { id: 'BRIEF_CHECK', title: t('colBriefCheck'), color: '#f59e0b', desc: 'No Brief = No Start' },
    { id: 'IN_PRODUCTION', title: t('colInProduction'), color: '#77BC1F', desc: 'Creative Work' },
    { id: 'IN_REVIEW', title: t('colInReview'), color: '#FF9900', desc: '48h Auto-Approve' },
    { id: 'DELIVERED', title: t('colDelivered'), color: '#10b981', desc: 'Assets Complete' },
  ];

  return (
    <div className="jira-layout">
      {/* ====================================================================
          Jira Top Navigation Bar (Brand Navy #232F3F)
         ==================================================================== */}
      <header className="jira-topbar">
        <div className="topbar-left">
          {/* App Switcher */}
          <button type="button" className="topbar-icon-btn app-switcher-btn" title="Atlassian Apps">
            <Grid size={18} />
          </button>

          {/* Logo2.png & Marketing SLA Name */}
          <div className="jira-brand" onClick={() => setCurrentPage('dashboard')}>
            <div className="jira-brand-logo-wrap">
              <img src={logoImg} alt="B-Groceries Logo" className="jira-brand-logo" />
            </div>
            <span className="jira-product-name">{t('jiraBoard')}</span>
          </div>

          {/* Navigation Links */}
          <nav className="topbar-nav-links">
            <div className="topbar-dropdown-link active">
              <span>{t('projects')}</span>
              <ChevronDown size={14} />
            </div>
            <div className="topbar-dropdown-link">
              <span>{t('filters')}</span>
              <ChevronDown size={14} />
            </div>
            <div className="topbar-dropdown-link">
              <span>{t('dashboards')}</span>
              <ChevronDown size={14} />
            </div>

            {/* + New Request Button (Primary Green #77BC1F) */}
            <button 
              type="button" 
              className="jira-create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} />
              <span>{t('createIssue')}</span>
            </button>
          </nav>
        </div>

        <div className="topbar-right">
          {/* Global Search Bar */}
          <div className="jira-search-bar">
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="jira-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Language Switcher Pill (ENG / KH) */}
          <button 
            type="button" 
            className="lang-switcher-pill"
            onClick={toggleLang}
            title={t('switchLang')}
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'ENG' : 'KHM'}</span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button 
            type="button" 
            className="topbar-icon-btn" 
            onClick={toggleTheme}
            title={t('switchTheme')}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <button type="button" className="topbar-icon-btn notification-btn" title={t('notifications')}>
            <Bell size={17} />
            <span className="notif-badge-dot"></span>
          </button>

          {/* User Profile Avatar with Dropdown */}
          <div className="user-profile-relative">
            <div 
              className="topbar-avatar" 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              title={`${user?.username || 'User'} (${user?.role || 'MARKETING_OPS'})`}
            >
              <span>{user?.avatar || 'SM'}</span>
            </div>

            {userDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <p className="user-dropdown-name">{user?.username || 'Sokha Meas'}</p>
                  <p className="user-dropdown-email">{user?.email || 'sokha.meas@bgroceries.com'}</p>
                  <span className="user-dropdown-role">{user?.roleLabel || 'Marketing Ops'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  type="button" 
                  className="user-menu-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setCurrentPage('login');
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Login View</span>
                </button>
                <button 
                  type="button" 
                  className="user-menu-item logout"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>{t('logOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================
          Jira Body: Sidebar & Marketing SLA Board
         ==================================================================== */}
      <div className="jira-body">
        {/* Collapsible Sidebar */}
        <aside className={`jira-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-project-header">
            <div className="project-avatar">
              <Layers size={18} />
            </div>
            {!isSidebarCollapsed && (
              <div className="project-meta">
                <h3 className="project-name">Marketing SLA</h3>
                <span className="project-category">{t('projectLead')}</span>
              </div>
            )}
          </div>

          <nav className="sidebar-menu">
            <div className="menu-group-label">{!isSidebarCollapsed && 'SLA PIPELINE'}</div>
            
            <button 
              type="button" 
              className={`sidebar-nav-item ${activeNav === 'board' ? 'active' : ''}`}
              onClick={() => setActiveNav('board')}
            >
              <Kanban size={18} />
              {!isSidebarCollapsed && <span>{t('kanbanBoard')}</span>}
            </button>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeNav === 'backlog' ? 'active' : ''}`}
              onClick={() => setActiveNav('backlog')}
            >
              <Bookmark size={18} />
              {!isSidebarCollapsed && <span>{t('backlog')}</span>}
            </button>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeNav === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveNav('reports')}
            >
              <BarChart3 size={18} />
              {!isSidebarCollapsed && <span>{t('slaReports')}</span>}
            </button>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeNav === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveNav('roadmap')}
            >
              <Calendar size={18} />
              {!isSidebarCollapsed && <span>{t('roadmap')}</span>}
            </button>

            <div className="menu-divider"></div>
            <div className="menu-group-label">{!isSidebarCollapsed && 'GOVERNANCE'}</div>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('settings')}
            >
              <Settings size={18} />
              {!isSidebarCollapsed && <span>{t('projectSettings')}</span>}
            </button>
          </nav>

          <button 
            type="button" 
            className="sidebar-collapse-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={t('collapseSidebar')}
          >
            <ChevronRight className={`collapse-arrow ${isSidebarCollapsed ? '' : 'reversed'}`} size={16} />
            {!isSidebarCollapsed && <span>{t('collapseSidebar')}</span>}
          </button>
        </aside>

        {/* Main Board View */}
        <main className="jira-main-content">
          {/* Breadcrumb Header */}
          <div className="board-breadcrumb-row">
            <span className="breadcrumb-part">B-Groceries</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-part">{t('projectSelect')}</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{t('kanbanBoard')}</span>
          </div>

          {/* Board Title & Top Actions */}
          <div className="board-header-row">
            <div className="board-title-group">
              <h1 className="board-title">{t('boardTitle')}</h1>
              <span className="sprint-status-tag">
                <Clock size={13} />
                {t('sprintTag')}
              </span>
            </div>

            <div className="board-actions-group">
              <button 
                type="button" 
                className="jira-secondary-btn"
                onClick={() => setCurrentPage('login')}
              >
                <ArrowLeft size={14} />
                <span>Return to Login</span>
              </button>
              <button 
                type="button" 
                className="jira-primary-btn"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={16} />
                <span>{t('createIssue')}</span>
              </button>
            </div>
          </div>

          {/* Marketing SLA Policies & Live Quota Banner */}
          <section className="sla-metrics-banner">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{t('slaMetRate')}</span>
                <span className="metric-badge success">{stats.complianceRate}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${stats.complianceRate}%`, backgroundColor: '#77BC1F' }}
                ></div>
              </div>
              <span className="metric-subtext">On-time SLA Asset Deliveries</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{t('rushQuotaTitle')}</span>
                <span className="metric-badge warning">
                  {rushQuotas['COM'] || 2} / {SLA_SETTINGS.rush_quota_per_month} Used
                </span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${((rushQuotas['COM'] || 2) / 3) * 100}%`, backgroundColor: '#FF9900' }}
                ></div>
              </div>
              <span className="metric-subtext">4th+ Rush requires GM sign-off</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Clock Paused (Waiting)</span>
                <span className="metric-badge neutral">{stats.pausedCount} Tickets</span>
              </div>
              <span className="metric-subtext">Clock paused during Missing Assets</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{t('totalTickets')}</span>
                <span className="metric-badge neutral">{stats.total} Total</span>
              </div>
              <span className="metric-subtext">Rule: 3:00 PM Intake Cutoff</span>
            </div>
          </section>

          {/* Quick Filter Bar */}
          <div className="jira-filter-bar">
            {/* Search Filter input */}
            <div className="filter-input-wrap">
              <Search size={14} className="filter-search-icon" />
              <input 
                type="text" 
                placeholder="Filter campaign or ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
            </div>

            {/* Quick Filter Chips */}
            <div className="filter-chips">
              <button 
                type="button" 
                className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {t('allIssues')}
              </button>
              <button 
                type="button" 
                className={`filter-chip ${activeFilter === 'p1-rush' ? 'active' : ''}`}
                onClick={() => setActiveFilter('p1-rush')}
              >
                {t('highPriority')}
              </button>
              <button 
                type="button" 
                className={`filter-chip ${activeFilter === 'paused' ? 'active' : ''}`}
                onClick={() => setActiveFilter('paused')}
              >
                ⏸️ Paused ({stats.pausedCount})
              </button>
              <button 
                type="button" 
                className={`filter-chip ${activeFilter === 'running' ? 'active' : ''}`}
                onClick={() => setActiveFilter('running')}
              >
                🟢 Clock Running
              </button>
            </div>

            {/* Department Filter Chips */}
            <div className="assignee-filter-group">
              <button
                type="button"
                className={`assignee-pill-all ${selectedDept === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedDept('all')}
                title="All Departments"
              >
                All Depts
              </button>
              {DEPARTMENTS.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  className={`assignee-pill-all ${selectedDept === d.code ? 'active' : ''}`}
                  onClick={() => setSelectedDept(selectedDept === d.code ? 'all' : d.code)}
                  title={lang === 'kh' ? d.name_km : d.name_en}
                >
                  {d.code}
                </button>
              ))}
            </div>
          </div>

          {/* ================================================================
              Kanban Board Columns (PostgreSQL ticket_status)
             ================================================================ */}
          <div className="kanban-board-container">
            {columns.map((col) => {
              const colTickets = filteredTickets.filter(t => t.status === col.id);

              return (
                <div key={col.id} className="kanban-column">
                  {/* Column Header */}
                  <div className="column-header">
                    <div className="column-title-group">
                      <span className="column-indicator-bar" style={{ backgroundColor: col.color }}></span>
                      <div>
                        <h2 className="column-title">{col.title}</h2>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{col.desc}</span>
                      </div>
                    </div>
                    <span className="column-count-badge">{colTickets.length}</span>
                  </div>

                  {/* Cards List */}
                  <div className="column-cards-list">
                    {colTickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="jira-card"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setDetailTab('brief');
                        }}
                      >
                        {/* Card Header: Ticket No, Priority, Clock State */}
                        <div className="card-top-row">
                          <div className="card-meta">
                            <span className="ticket-key">{ticket.id}</span>
                            {renderPriorityBadge(ticket.priority, ticket.is_rush)}
                          </div>
                          {renderClockBadge(ticket)}
                        </div>

                        {/* Card Title */}
                        <p className="card-title-text">{ticket.title}</p>

                        {/* Department & Catalog Item pill */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 700, 
                            color: '#77BC1F', 
                            background: 'rgba(119, 188, 31, 0.12)', 
                            padding: '2px 6px', 
                            borderRadius: 4 
                          }}>
                            {ticket.catalogName}
                          </span>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 600, 
                            color: '#FF9900', 
                            background: 'rgba(255, 153, 0, 0.12)', 
                            padding: '2px 6px', 
                            borderRadius: 4 
                          }}>
                            {ticket.departmentCode}
                          </span>
                          {ticket.revision_count > 0 && (
                            <span style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 700,
                              color: ticket.revision_count >= 3 ? '#FF9900' : 'var(--text-dim)',
                              background: ticket.revision_count >= 3 ? 'rgba(255, 153, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              {ticket.revision_count >= 3 ? `CR Rev #${ticket.revision_count} (+3d)` : `Rev #${ticket.revision_count}`}
                            </span>
                          )}
                          {ticket.is_promo_pricing && (
                            <span style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 700, 
                              color: '#ec4899', 
                              background: 'rgba(236, 72, 153, 0.12)', 
                              padding: '2px 6px', 
                              borderRadius: 4 
                            }}>
                              24h Promo
                            </span>
                          )}
                        </div>

                        {/* Card Clock Controls: Pause / Resume */}
                        <div className="card-clock-actions" onClick={(e) => e.stopPropagation()}>
                          {ticket.clock_state === 'RUNNING' && ticket.status !== 'DELIVERED' && (
                            <button
                              type="button"
                              className="btn-clock-action pause"
                              onClick={() => setPauseModalTicket(ticket)}
                              title="Pause SLA Clock"
                            >
                              <PauseCircle size={12} /> Pause Clock
                            </button>
                          )}
                          {ticket.clock_state === 'PAUSED' && (
                            <button
                              type="button"
                              className="btn-clock-action resume"
                              onClick={() => resumeTicket(ticket.id)}
                              title="Resume SLA Clock"
                            >
                              <PlayCircle size={12} /> Resume Clock
                            </button>
                          )}
                        </div>

                        {/* Card Footer: Due Date & Fast Status Mover */}
                        <div className="card-footer-row">
                          <div className="card-left-footer">
                            <Clock size={12} style={{ color: 'var(--text-dim)' }} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                              Due: {ticket.due_date}
                            </span>
                          </div>

                          <div className="card-right-footer" onClick={(e) => e.stopPropagation()}>
                            {/* Fast status switcher */}
                            <select
                              value={ticket.status}
                              onChange={(e) => moveTicket(ticket.id, e.target.value)}
                              className="status-dropdown-card"
                              title="Change Status"
                            >
                              <option value="BRIEF_CHECK">Brief Check</option>
                              <option value="IN_PRODUCTION">In Production</option>
                              <option value="IN_REVIEW">In Review</option>
                              <option value="DELIVERED">Delivered</option>
                            </select>

                            {/* Assignee Avatar */}
                            <div 
                              className="card-assignee-avatar" 
                              title={`Assignee: ${ticket.assignee}`}
                            >
                              {ticket.assigneeAvatar || 'SM'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Column Empty State */}
                    {colTickets.length === 0 && (
                      <div className="column-empty-state">
                        <CheckSquare size={24} className="empty-icon" />
                        <p className="empty-text">{t('noIssues')}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ====================================================================
          Create Ticket Modal (With Dynamic Brief Fields from catalog_brief_fields)
         ==================================================================== */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="jira-create-modal" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="jira-modal-header">
              <div className="modal-title-group">
                <Sparkles size={18} style={{ color: '#77BC1F' }} />
                <h3>{t('createIssue')}</h3>
              </div>
              <button 
                type="button" 
                className="jira-modal-close" 
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="jira-modal-form">
              {/* 3:00 PM Cutoff Rule Alert */}
              <div className="sla-rule-callout cutoff-info">
                <Clock size={16} style={{ color: '#77BC1F', flexShrink: 0 }} />
                <span>{cutoffInfo.label}</span>
              </div>

              {/* Department Rush Quota Notice if Rush */}
              {newRequest.is_rush && (
                <div className={`sla-rule-callout ${isOverQuota ? 'quota-warn' : 'cutoff-info'}`}>
                  <AlertTriangle size={16} style={{ color: isOverQuota ? '#FF9900' : '#77BC1F', flexShrink: 0 }} />
                  <span>
                    Monthly Rush Quota: {currentDeptQuota} / {SLA_SETTINGS.rush_quota_per_month} used for {newRequest.departmentCode}.
                    {isOverQuota && ' ⚠️ Exceeds quota: Requires GM Sign-Off (RUSH_GM_APPROVAL).'}
                  </span>
                </div>
              )}

              {/* Catalog Item & Department Select */}
              <div className="form-field-grid">
                <div className="jira-field-group">
                  <label>{t('issueType')} (Service Catalog) *</label>
                  <select 
                    value={newRequest.catalogCode} 
                    onChange={(e) => handleCatalogSelect(e.target.value)}
                    className="jira-select"
                  >
                    {CATALOG_ITEMS.map(item => (
                      <option key={item.code} value={item.code}>
                        {item.code} - {lang === 'kh' ? item.name_km : item.name_en} ({item.tat_business_days}d TAT)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="jira-field-group">
                  <label>{t('department')} *</label>
                  <select 
                    value={newRequest.departmentCode} 
                    onChange={(e) => {
                      const dept = DEPARTMENTS.find(d => d.code === e.target.value);
                      setNewRequest({
                        ...newRequest,
                        departmentCode: e.target.value,
                        department: dept ? dept.name_en : 'Commercial & Purchasing'
                      });
                    }}
                    className="jira-select"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.code} value={d.code}>
                        {d.code} - {lang === 'kh' ? d.name_km : d.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title / Campaign */}
              <div className="jira-field-group">
                <label>{t('summary')} *</label>
                <input 
                  type="text" 
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder={t('summaryPlaceholder')}
                  className="jira-input"
                  required
                />
              </div>

              {/* Brief Content */}
              <div className="jira-field-group">
                <label>{t('description')} *</label>
                <textarea 
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder={t('descriptionPlaceholder')}
                  rows={2}
                  className="jira-textarea"
                  required
                />
              </div>

              {/* ==============================================================
                  Dynamic Brief Fields ("No Brief = No Start" from catalog_brief_fields)
                 ============================================================== */}
              <div className="brief-fields-container">
                <div className="brief-fields-header">
                  <span className="brief-title">
                    <FileText size={15} />
                    Required Brief Specifications ({newRequest.catalogCode})
                  </span>
                  <span className="brief-tagline">No Brief = No Start</span>
                </div>

                <div className="brief-fields-grid">
                  {(CATALOG_BRIEF_FIELDS[newRequest.catalogCode] || []).map((field) => (
                    <div key={field.key} className="jira-field-group" style={{ gridColumn: field.type === 'LONG_TEXT' ? '1 / -1' : 'span 1' }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {lang === 'kh' && field.label_km ? field.label_km : field.label_en} {field.required && '*'}
                      </label>

                      {field.type === 'SELECT' ? (
                        <select
                          value={newRequest.brief_json[field.key] || ''}
                          onChange={(e) => handleBriefFieldChange(field.key, e.target.value)}
                          className="jira-select"
                          required={field.required}
                        >
                          <option value="">Select option...</option>
                          {(field.options || []).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'LONG_TEXT' ? (
                        <textarea
                          value={newRequest.brief_json[field.key] || ''}
                          onChange={(e) => handleBriefFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          rows={2}
                          className="jira-textarea"
                          required={field.required}
                        />
                      ) : (
                        <input
                          type={field.type === 'NUMBER' ? 'number' : field.type === 'DATE' ? 'date' : 'text'}
                          value={newRequest.brief_json[field.key] || ''}
                          onChange={(e) => handleBriefFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="jira-input"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority & Rush Checkbox */}
              <div className="form-field-grid">
                <div className="jira-field-group">
                  <label>{t('priority')}</label>
                  <select 
                    value={newRequest.priority} 
                    onChange={(e) => setNewRequest({ 
                      ...newRequest, 
                      priority: e.target.value, 
                      is_rush: e.target.value === 'P1',
                      tat_days: e.target.value === 'P1' ? 1 : newRequest.tat_days
                    })}
                    className="jira-select"
                  >
                    <option value="P1">P1 - Rush (1-day TAT, GM sign-off if &gt; 3/mo)</option>
                    <option value="P2">P2 - High Priority (3-day TAT)</option>
                    <option value="P3">P3 - Standard Priority (5-day TAT)</option>
                    <option value="P4">P4 - Routine (7-day TAT)</option>
                  </select>
                </div>

                <div className="jira-field-group">
                  <label>Assignee Lead</label>
                  <select 
                    value={newRequest.assignee} 
                    onChange={(e) => setNewRequest({ ...newRequest, assignee: e.target.value })}
                    className="jira-select"
                  >
                    <option value="Sokha Meas (Lead Designer)">Sokha Meas (Lead Designer)</option>
                    <option value="John Smith (Video Editor)">John Smith (Video Editor)</option>
                    <option value="Sarah Lee (Brand Designer)">Sarah Lee (Brand Designer)</option>
                    <option value="Bopha Chea (Marketing Ops)">Bopha Chea (Marketing Ops)</option>
                  </select>
                </div>
              </div>

              {/* Rush Quota & Promo flags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newRequest.is_rush} 
                    onChange={(e) => setNewRequest({ 
                      ...newRequest, 
                      is_rush: e.target.checked,
                      priority: e.target.checked ? 'P1' : 'P2',
                      tat_days: e.target.checked ? 1 : 3
                    })} 
                  />
                  <span>{t('isRushLabel')}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newRequest.is_promo_pricing} 
                    onChange={(e) => setNewRequest({ ...newRequest, is_promo_pricing: e.target.checked })} 
                  />
                  <span>{t('isPromoLabel')}</span>
                </label>
              </div>

              <div className="jira-modal-footer">
                <button 
                  type="button" 
                  className="jira-btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="jira-btn-submit"
                >
                  {t('submitCreate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          Pause SLA Clock Modal (PostgreSQL pause_reason enum)
         ==================================================================== */}
      {pauseModalTicket && (
        <div className="modal-overlay" onClick={() => setPauseModalTicket(null)}>
          <div className="pause-popover-card" style={{ maxWidth: 440, width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <PauseCircle size={22} style={{ color: '#FF9900' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Pause SLA Clock</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Ticket {pauseModalTicket.id}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 12 }}>
              Per B-Groceries SLA rules, pausing the clock freezes SLA countdown until the external dependency is resolved.
            </p>

            <div className="jira-field-group" style={{ marginBottom: 14 }}>
              <label>Select Pause Reason (PostgreSQL Enum) *</label>
              <select 
                value={pauseReason} 
                onChange={(e) => setPauseReason(e.target.value)}
                className="jira-select"
              >
                <option value="MISSING_ASSETS">MISSING_ASSETS - Missing high-res photos, packaging files, or brand assets</option>
                <option value="MISSING_INFO">MISSING_INFO - Missing product SKU, pricing, or size specifications</option>
                <option value="AWAITING_REQUESTER">AWAITING_REQUESTER - Awaiting requester feedback or confirmation</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                type="button" 
                className="jira-btn-cancel"
                onClick={() => setPauseModalTicket(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="jira-primary-btn"
                style={{ backgroundColor: '#FF9900', color: '#fff' }}
                onClick={() => {
                  pauseTicket(pauseModalTicket.id, pauseReason);
                  setPauseModalTicket(null);
                }}
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Ticket Detail Drawer (Tabs: Brief, SLA Clock, Revisions, Approvals, Comments)
         ==================================================================== */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-detail-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ticket-detail-header">
              <div className="ticket-detail-meta">
                <span className="ticket-detail-key">{selectedTicket.id}</span>
                {renderPriorityBadge(selectedTicket.priority, selectedTicket.is_rush)}
                {renderClockBadge(selectedTicket)}
              </div>
              <button 
                type="button" 
                className="jira-modal-close"
                onClick={() => setSelectedTicket(null)}
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="ticket-detail-title">{selectedTicket.title}</h2>
            <p className="ticket-detail-desc">{selectedTicket.description}</p>

            {/* Tab Navigation */}
            <div className="ticket-detail-tabs">
              <button 
                type="button" 
                className={`detail-tab-btn ${detailTab === 'brief' ? 'active' : ''}`}
                onClick={() => setDetailTab('brief')}
              >
                <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />
                Brief Specs
              </button>
              <button 
                type="button" 
                className={`detail-tab-btn ${detailTab === 'clock' ? 'active' : ''}`}
                onClick={() => setDetailTab('clock')}
              >
                <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
                SLA Clock & Pauses ({selectedTicket.ticket_pauses?.length || 0})
              </button>
              <button 
                type="button" 
                className={`detail-tab-btn ${detailTab === 'revisions' ? 'active' : ''}`}
                onClick={() => setDetailTab('revisions')}
              >
                <History size={13} style={{ display: 'inline', marginRight: 4 }} />
                Revisions ({selectedTicket.revision_count || 0})
              </button>
              <button 
                type="button" 
                className={`detail-tab-btn ${detailTab === 'approvals' ? 'active' : ''}`}
                onClick={() => setDetailTab('approvals')}
              >
                <FileCheck size={13} style={{ display: 'inline', marginRight: 4 }} />
                Approvals & Quota
              </button>
              <button 
                type="button" 
                className={`detail-tab-btn ${detailTab === 'comments' ? 'active' : ''}`}
                onClick={() => setDetailTab('comments')}
              >
                <MessageSquare size={13} style={{ display: 'inline', marginRight: 4 }} />
                Comments ({selectedTicket.comments?.length || 0})
              </button>
            </div>

            {/* TAB 1: BRIEF SPECIFICATIONS */}
            {detailTab === 'brief' && (
              <div className="ticket-attributes-grid">
                <div className="attribute-row">
                  <span className="attr-label">Status (Pipeline)</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => {
                      moveTicket(selectedTicket.id, e.target.value);
                      setSelectedTicket(prev => ({ ...prev, status: e.target.value }));
                    }}
                    className="status-quick-select"
                  >
                    <option value="BRIEF_CHECK">1. BRIEF CHECK</option>
                    <option value="IN_PRODUCTION">2. IN PRODUCTION</option>
                    <option value="IN_REVIEW">3. IN REVIEW</option>
                    <option value="DELIVERED">4. DELIVERED</option>
                  </select>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Department</span>
                  <span className="attr-value">{selectedTicket.department} ({selectedTicket.departmentCode})</span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Catalog Item</span>
                  <span className="attr-value">{selectedTicket.catalogName}</span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Assignee Lead</span>
                  <span className="attr-value">
                    <span className="mini-avatar">{selectedTicket.assigneeAvatar || 'SM'}</span>
                    {selectedTicket.assignee}
                  </span>
                </div>

                {/* Answers from brief_json */}
                <div style={{ marginTop: 10, borderTop: '1px dashed var(--jira-column-border)', paddingTop: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77BC1F', display: 'block', marginBottom: 8 }}>
                    Dynamic Brief Answers (brief_json):
                  </span>
                  {selectedTicket.brief_json && Object.keys(selectedTicket.brief_json).length > 0 ? (
                    Object.entries(selectedTicket.brief_json).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-dim)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-word' }}>
                          {String(v)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Standard brief submitted.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SLA CLOCK & PAUSES */}
            {detailTab === 'clock' && (
              <div className="ticket-attributes-grid">
                <div className="attribute-row">
                  <span className="attr-label">Live Clock State</span>
                  <span className="attr-value">{renderClockBadge(selectedTicket)}</span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Clock Controls</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selectedTicket.clock_state === 'RUNNING' && (
                      <button 
                        type="button" 
                        className="btn-clock-action pause"
                        onClick={() => setPauseModalTicket(selectedTicket)}
                      >
                        <PauseCircle size={13} /> Pause SLA Clock
                      </button>
                    )}
                    {selectedTicket.clock_state === 'PAUSED' && (
                      <button 
                        type="button" 
                        className="btn-clock-action resume"
                        onClick={() => {
                          resumeTicket(selectedTicket.id);
                          setSelectedTicket(prev => ({ ...prev, clock_state: 'RUNNING', pause_reason: null }));
                        }}
                      >
                        <PlayCircle size={13} /> Resume SLA Clock
                      </button>
                    )}
                  </div>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Submission Timestamp</span>
                  <span className="attr-value">{selectedTicket.submitted_at}</span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Counted From Date</span>
                  <span className="attr-value">{selectedTicket.counted_from_date}</span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Calculated Due Date</span>
                  <span className="attr-value">{selectedTicket.due_date} ({selectedTicket.slaTimeLeft})</span>
                </div>

                {/* Pause History List */}
                <div style={{ marginTop: 12, borderTop: '1px dashed var(--jira-column-border)', paddingTop: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF9900', display: 'block', marginBottom: 8 }}>
                    Clock Pause History (ticket_pauses):
                  </span>
                  {selectedTicket.ticket_pauses && selectedTicket.ticket_pauses.length > 0 ? (
                    selectedTicket.ticket_pauses.map((p, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 153, 0, 0.08)', padding: '8px 12px', borderRadius: 4, marginBottom: 6, fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>Reason: {p.reason}</span>
                          <span>{p.ended_at ? 'Resolved' : 'Active'}</span>
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.74rem', marginTop: 3 }}>
                          Started at {p.started_at} by {p.started_by} {p.ended_at && `• Resumed at ${p.ended_at}`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No pause events recorded.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: REVISIONS & CHANGE REQUESTS */}
            {detailTab === 'revisions' && (
              <div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: 10, borderRadius: 6, fontSize: '0.8rem', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#77BC1F' }}>Rules-as-Data Policy: </span>
                  Rounds 1 & 2 are standard. Round 3+ triggers a <strong>CHANGE_REQUEST</strong> with <strong>+3 business days</strong> added to the TAT.
                </div>

                {/* Revisions History List */}
                <div className="revisions-list">
                  {selectedTicket.revisions && selectedTicket.revisions.length > 0 ? (
                    selectedTicket.revisions.map((rev, idx) => (
                      <div key={idx} className={`revision-card-item ${rev.kind === 'CHANGE_REQUEST' ? 'change-request' : ''}`}>
                        <div className="revision-header">
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: rev.kind === 'CHANGE_REQUEST' ? '#FF9900' : '#77BC1F' }}>
                            Round #{rev.round_no} ({rev.kind})
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{rev.date}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', margin: '4px 0', color: 'var(--text-main)' }}>{rev.feedback}</p>
                        {rev.extra_days > 0 && (
                          <span style={{ fontSize: '0.74rem', color: '#FF9900', fontWeight: 600 }}>
                            +{rev.extra_days} Business Days added to deadline
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No revision requests yet (Round 0).</p>
                  )}
                </div>

                {/* Add Revision Form */}
                <div style={{ marginTop: 14, borderTop: '1px solid var(--jira-column-border)', paddingTop: 12 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Request Revision (Next: Round #{(selectedTicket.revision_count || 0) + 1})
                  </span>
                  <textarea 
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    placeholder="Enter creative feedback or adjustments needed..."
                    rows={2}
                    className="jira-textarea"
                  />
                  <button 
                    type="button" 
                    className="jira-primary-btn" 
                    style={{ marginTop: 8 }}
                    disabled={!revisionFeedback.trim()}
                    onClick={() => {
                      requestRevision(selectedTicket.id, revisionFeedback);
                      setRevisionFeedback('');
                      setSelectedTicket(prev => ({
                        ...prev,
                        revision_count: (prev.revision_count || 0) + 1
                      }));
                    }}
                  >
                    Submit Revision Feedback
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: APPROVALS & QUOTA */}
            {detailTab === 'approvals' && (
              <div className="ticket-attributes-grid">
                <div className="attribute-row">
                  <span className="attr-label">Requester Auto-Approve</span>
                  <span className="attr-value">
                    {selectedTicket.is_promo_pricing ? '24h Auto-Approve (Promo)' : '48h Auto-Approve (Standard)'}
                  </span>
                </div>

                <div className="attribute-row">
                  <span className="attr-label">Rush Status</span>
                  <span className="attr-value">
                    {selectedTicket.is_rush ? 'P1 Rush (1-Day TAT)' : 'Standard Pipeline'}
                  </span>
                </div>

                {/* Approvals list */}
                <div style={{ marginTop: 12, borderTop: '1px dashed var(--jira-column-border)', paddingTop: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77BC1F', display: 'block', marginBottom: 8 }}>
                    Governance Approvals (approvals):
                  </span>
                  {selectedTicket.approvals && selectedTicket.approvals.length > 0 ? (
                    selectedTicket.approvals.map((appr, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 6, marginBottom: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                          <span>{appr.kind}</span>
                          <span style={{ color: appr.result === 'APPROVED' ? '#77BC1F' : '#FF9900' }}>{appr.result}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '4px 0' }}>{appr.note}</p>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Standard department request within monthly quota.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: COMMENTS & ACTIVITY */}
            {detailTab === 'comments' && (
              <div>
                <div className="comments-list">
                  {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                    selectedTicket.comments.map((cmt, idx) => (
                      <div key={idx} className={`comment-bubble ${cmt.internal ? 'internal' : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cmt.author}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {cmt.internal && (
                              <span style={{ color: '#FF9900', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Lock size={10} /> Internal Note
                              </span>
                            )}
                            <span>{cmt.time}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-main)' }}>{cmt.body}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No comments posted yet.</p>
                  )}
                </div>

                {/* Add Comment Input */}
                <div style={{ borderTop: '1px solid var(--jira-column-border)', paddingTop: 10 }}>
                  <textarea 
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Add a comment or internal creative note..."
                    rows={2}
                    className="jira-textarea"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isCommentInternal} 
                        onChange={(e) => setIsCommentInternal(e.target.checked)} 
                      />
                      <span>Internal (Marketing Ops Only)</span>
                    </label>

                    <button 
                      type="button" 
                      className="jira-primary-btn"
                      disabled={!commentBody.trim()}
                      onClick={() => {
                        addComment(selectedTicket.id, commentBody, isCommentInternal);
                        setCommentBody('');
                      }}
                    >
                      <Send size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="ticket-detail-footer">
              <button 
                type="button" 
                className="delete-ticket-btn"
                onClick={() => {
                  deleteTicket(selectedTicket.id);
                  setSelectedTicket(null);
                }}
              >
                Delete Request
              </button>
              <button 
                type="button" 
                className="jira-primary-btn"
                onClick={() => setSelectedTicket(null)}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
