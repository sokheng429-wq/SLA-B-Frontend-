import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  Globe,
  Kanban,
  Server,
  AlertTriangle
} from 'lucide-react';
import AdminContactModal from '../components/AdminContactModal';
import Toast from '../components/Toast';
import { useApp } from '../context/AppContext';
import { authApi } from '../API/api';
import logoImg from '../assets/Logo2.png';
import './LoginPage.css';

export default function LoginPage() {
  const {
    theme,
    toggleTheme,
    lang,
    toggleLang,
    t,
    login,
    loginOffline
  } = useApp();

  const [username, setUsername] = useState('admin_staff');
  const [password, setPassword] = useState('SecureSLA#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null); // null = checking, true = up, false = down
  const [authError, setAuthError] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    let isMounted = true;
    const testHealth = async () => {
      const isUp = await authApi.checkHealth();
      if (isMounted) {
        setBackendOnline(isUp);
      }
    };
    testHealth();
    const interval = setInterval(testHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setAuthError(null);

    if (!username.trim()) {
      showToast(lang === 'kh' ? 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល' : 'Please enter your username or employee ID.', 'warning');
      return;
    }

    if (!password.trim()) {
      showToast(lang === 'kh' ? 'សូមបញ្ចូលពាក្យសម្ងាត់' : 'Please enter your password.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate with Spring Boot backend (/api/auth/login)
      const result = await login(username, password);
      showToast(
        lang === 'kh'
          ? `ចូលប្រព័ន្ធបានជោគជ័យ! សូមស្វាគមន៍ ${result.user?.fullName || username}`
          : `JWT Authenticated! Welcome, ${result.user?.fullName || username}`,
        'success'
      );
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.message || 'Login failed. Please verify credentials.';
      setAuthError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  // Seeded Demo Account Presets from backend DataInitializer.java
  const handleSelectPreset = (u, p) => {
    setUsername(u);
    setPassword(p);
    setAuthError(null);
    showToast(`Filled credentials for: ${u}`, 'info');
  };

  return (
    <main className="login-page-wrapper">
      {/* Background Animated Ambient Mesh and Glowing Orbs */}
      <div className="bg-mesh-container" aria-hidden="true">
        <div className="ambient-orb orb-primary"></div>
        <div className="ambient-orb orb-cyan"></div>
        <div className="ambient-orb orb-violet"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navigation / Brand Bar */}
      <header className="login-header-nav">
        <div className="brand-badge">
          {/* Logo2.png from assets */}
          <div className="brand-logo-container">
            <img src={logoImg} alt="B-Groceries Logo" className="brand-logo-img" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">{t('brandName')}</span>
          </div>
        </div>

        {/* Header Controls: Language switcher, Theme toggle, System Status */}
        <div className="header-controls-group">
          {/* Backend API Health Status Pill */}
          <div
            className="header-status-pill"
            title={backendOnline ? "Spring Boot Backend (:8082) is online and reachable" : "Backend (:8082) not responding. Start backend with start-backend.bat"}
            style={{
              background: backendOnline ? 'rgba(119, 188, 31, 0.15)' : 'rgba(255, 153, 0, 0.15)',
              borderColor: backendOnline ? '#77BC1F' : '#FF9900'
            }}
          >
            <Server size={14} style={{ color: backendOnline ? '#77BC1F' : '#FF9900' }} />
            <span style={{ color: backendOnline ? '#77BC1F' : '#FF9900', fontWeight: 600 }}>
              {backendOnline === null ? 'Checking Backend...' : backendOnline ? 'API :8082 Connected' : 'API :8082 Offline'}
            </span>
          </div>

          {/* Direct jump to Jira Dashboard preview */}
          <button
            type="button"
            className="explore-dashboard-pill"
            onClick={() => {
              loginOffline(username || 'admin_staff');
            }}
            title="Open User Dashboard directly (Offline Mode)"
          >
            <Kanban size={15} />
            <span>{t('exploreDashboard')}</span>
          </button>

          {/* Language Switcher Button (ENG / KH) */}
          <button
            type="button"
            className="login-lang-pill"
            onClick={toggleLang}
            title={lang === 'en' ? 'ប្តូរទៅភាសាខ្មែរ (Switch to Khmer)' : 'Switch to English'}
          >
            <Globe size={15} />
            <span className="lang-text">{lang === 'en' ? 'ENG' : 'KH (ខ្មែរ)'}</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            className="login-theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Login Card Section */}
      <section className="login-card-container">
        <div className="login-card">
          {/* Card Header with Logo2.png */}
          <div className="card-header">
            <div className="card-brand-logo-wrap">
              <img src={logoImg} alt="B-Groceries Logo" className="card-brand-logo" />
            </div>
            <h1 className="card-title">{t('signIn')}</h1>
            <p className="card-subtitle">{t('signInSubtitle')}</p>
          </div>

          {/* Seeded Demo Account Presets from Backend DataInitializer */}
          <div className="demo-pill-banner" style={{ flexDirection: 'column', gap: 6, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                <Sparkles size={13} style={{ display: 'inline', marginRight: 4, color: '#77BC1F' }} />
                Spring Boot Demo Accounts:
              </span>
              <span style={{ fontSize: '0.72rem', color: '#FF9900' }}>JWT Auth Enabled</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="demo-pill-btn"
                style={{ flex: 1, textAlign: 'center', padding: '4px 8px', fontSize: '0.74rem' }}
                onClick={() => handleSelectPreset('admin_staff', 'SecureSLA#2026')}
                title="Marketing Ops: admin_staff / SecureSLA#2026"
              >
                Marketing Ops
              </button>
              <button
                type="button"
                className="demo-pill-btn"
                style={{ flex: 1, textAlign: 'center', padding: '4px 8px', fontSize: '0.74rem' }}
                onClick={() => handleSelectPreset('admin', 'admin')}
                title="Super Admin: admin / admin"
              >
                Super Admin
              </button>
              <button
                type="button"
                className="demo-pill-btn"
                style={{ flex: 1, textAlign: 'center', padding: '4px 8px', fontSize: '0.74rem' }}
                onClick={() => handleSelectPreset('sokha_meas', 'password123')}
                title="Requester: sokha_meas / password123"
              >
                Requester
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form" noValidate>
            {/* Error Message Box if auth failed */}
            {authError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '0.82rem',
                color: '#fb7185',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 10
              }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <span>{authError}</span>
                  {authError.includes('Cannot connect') && (
                    <div style={{ marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={() => loginOffline(username)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#77BC1F',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          padding: 0
                        }}
                      >
                        Click here to proceed in Demo / Offline Mode &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username-input" className="form-label">
                {t('usernameLabel')}
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <User size={18} />
                </span>
                <input
                  id="username-input"
                  type="text"
                  autoComplete="username"
                  className="form-input"
                  placeholder={t('usernamePlaceholder')}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setAuthError(null);
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password-input" className="form-label">
                {t('passwordLabel')}
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-input"
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(null);
                  }}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Action */}
            <div className="form-options-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <span className="checkbox-label">{t('rememberMe')}</span>
              </label>

              {/* Forgot Password Button - Triggers Popup Modal */}
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
                aria-haspopup="dialog"
              >
                {t('forgotPassword')}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true"></span>
                  <span>Verifying with Spring Boot Backend...</span>
                </>
              ) : (
                <>
                  <span>{t('signInButton')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security Badge Footer */}
          <div className="card-footer">
            <div className="security-badge">
              <ShieldCheck size={16} style={{ color: '#77BC1F' }} />
              <span>JWT Authentication &bull; Spring Security 6 &bull; {t('portalEncrypted')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Page Footer */}
      <footer className="login-page-footer">
        <span>&copy; {new Date().getFullYear()} {t('copyright')}</span>
        <div className="footer-links">
          <button
            type="button"
            className="footer-link"
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <HelpCircle size={14} /> {t('needHelp')}
          </button>
          <span className="footer-link">{t('privacyPolicy')}</span>
          <span className="footer-link">{t('termsOfService')}</span>
        </div>
      </footer>

      {/* Contact Admin Popup Modal */}
      <AdminContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowToast={showToast}
        defaultUsername={username}
      />
    </main>
  );
}
