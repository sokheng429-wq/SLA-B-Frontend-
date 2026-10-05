import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ThemeToggle } from '../components/common/ThemeToggle';
import logoImg from '../assets/Logo1.png';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  Flame,
  Globe2,
  KeyRound,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    login,
    changePassword,
    cancelPasswordReset,
    loginError,
    isLoading,
    isPendingPasswordReset,
    pendingResetUser,
    clearError,
  } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [loginTab, setLoginTab] = useState<'signin' | 'first_time'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Normal User Password Inputs (2 Textbox: Password & Confirm Password)
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // Live Phnom Penh Local Time (UTC+7)
  const [currentTime, setCurrentTime] = useState(() => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Phnom_Penh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Phnom_Penh',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date())
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetError(null);
    setResetSuccess(false);

    const result = await login(username, password);
    if (result.success) {
      if (result.mustChangePassword) {
        setNewPassword('');
        setConfirmPassword('');
      } else {
        navigate('/');
      }
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Password and Confirm Password do not match.');
      return;
    }

    setIsResetSubmitting(true);
    const result = await changePassword(newPassword, confirmPassword);
    setIsResetSubmitting(false);

    if (result.success) {
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setResetError(result.error || 'Failed to update password. Please try again.');
    }
  };

  const handleFirstTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetError(null);
    setResetSuccess(false);

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Password and Confirm Password do not match.');
      return;
    }

    setIsResetSubmitting(true);
    const loginResult = await login(username, tempPassword);
    if (!loginResult.success) {
      setIsResetSubmitting(false);
      setResetError(loginResult.error || 'Initial credentials invalid. Please check your username and temporary password provided by your Admin.');
      return;
    }

    const changeResult = await changePassword(newPassword, confirmPassword);
    setIsResetSubmitting(false);

    if (changeResult.success) {
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setResetError(changeResult.error || 'Failed to set password. Please try again.');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        isDark
          ? 'bg-[#0B1017] text-white selection:bg-[#77BC1F]/30 selection:text-white'
          : 'bg-[#F4F6F9] text-[#232F3F] selection:bg-[#77BC1F]/20 selection:text-[#232F3F]'
      }`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle at 10% 20%, rgba(119, 188, 31, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 85%, rgba(255, 153, 0, 0.08) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(35, 47, 63, 0.3) 0%, transparent 60%)'
          : 'radial-gradient(circle at 10% 20%, rgba(119, 188, 31, 0.08) 0%, transparent 35%), radial-gradient(circle at 90% 85%, rgba(255, 153, 0, 0.06) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(35, 47, 63, 0.03) 0%, transparent 50%)',
      }}
    >
      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 border-b border-inherit/10 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={logoImg}
                alt="SLA B' Groceries INTERNAL"
                className={`h-11 w-auto object-contain p-1.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/20 shadow-md shadow-black/30'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#77BC1F] ring-2 ring-[#0B1017] animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`font-black text-lg md:text-xl tracking-tight transition-colors ${
                    isDark ? 'text-white' : 'text-[#232F3F]'
                  }`}
                >
                  SLA B' Groceries{' '}
                  <span className="text-[#77BC1F] font-black">INTERNAL</span>
                </span>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                    isDark
                      ? 'bg-[#FF9900]/15 text-[#FF9900] border-[#FF9900]/30'
                      : 'bg-[#FF9900]/10 text-[#C77700] border-[#FF9900]/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Hyperstore Portal
                </span>
              </div>
              <span
                className={`text-xs font-semibold tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Service Desk & SLA Governance Engine
              </span>
            </div>
          </div>

          {/* Controls: Dark/Light Mode Button & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* Prominent Dark/Light Mode Toggle Button */}
            <div className="flex items-center">
              <ThemeToggle size="md" showLabel={true} />
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: System Overview & Live SLA Governance Showcase */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-colors bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
              <span>LIVE SLA SYSTEM • PHNOM PENH (UTC+7)</span>
            </div>

            {/* Primary Headline */}
            <div>
              <h1
                className={`text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight transition-colors ${
                  isDark ? 'text-white' : 'text-[#232F3F]'
                }`}
              >
                Hyperstore Operations & <br />
                <span className="text-[#77BC1F]">Turnaround Governance</span>
              </h1>
              <p
                className={`mt-4 text-base sm:text-lg font-medium leading-relaxed max-w-2xl ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Official internal intake and turnaround platform for B'Groceries departments:
                Marketing, IT, Store Operations, Purchasing, Finance, and Human Resources.
              </p>
            </div>

            {/* Live Cut-Off & Realtime Clock Pill */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#151D29]/90 border-white/10 shadow-lg'
                  : 'bg-white border-gray-200/90 shadow-md'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center border border-[#FF9900]/30 shrink-0">
                    <Clock className="w-5 h-5 text-[#FF9900]" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      3:00 PM ICT Daily Cut-Off Rule
                    </div>
                    <div
                      className={`text-sm sm:text-base font-extrabold ${
                        isDark ? 'text-white' : 'text-[#232F3F]'
                      }`}
                    >
                      Current Server Time:{' '}
                      <span className="text-[#FF9900] font-mono">{currentTime}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border ${
                    isDark
                      ? 'bg-[#77BC1F]/15 text-[#77BC1F] border-[#77BC1F]/30'
                      : 'bg-[#77BC1F]/10 text-[#558D14] border-[#77BC1F]/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submissions Active</span>
                </div>
              </div>
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#121924]/80 border-white/10 hover:border-[#77BC1F]/40'
                    : 'bg-white/80 border-gray-200 hover:border-[#77BC1F]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Zap className="w-5 h-5 text-[#77BC1F]" />
                  <span
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-[#232F3F]'
                    }`}
                  >
                    Automated TAT Engine
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Excludes Sundays and Cambodian national holidays from SLA deadline clocks.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#121924]/80 border-white/10 hover:border-[#FF9900]/40'
                    : 'bg-white/80 border-gray-200 hover:border-[#FF9900]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Flame className="w-5 h-5 text-[#FF9900]" />
                  <span
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-[#232F3F]'
                    }`}
                  >
                    Department Rush Quota
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Enforces 3 rush requests/month limit with automated GM escalation.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#121924]/80 border-white/10 hover:border-[#77BC1F]/40'
                    : 'bg-white/80 border-gray-200 hover:border-[#77BC1F]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#77BC1F]" />
                  <span
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-[#232F3F]'
                    }`}
                  >
                    RACI Governance
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Formalized 48h / 24h auto-approval safeguards and 2-round revision limits.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#121924]/80 border-white/10 hover:border-[#FF9900]/40'
                    : 'bg-white/80 border-gray-200 hover:border-[#FF9900]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Globe2 className="w-5 h-5 text-[#FF9900]" />
                  <span
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-[#232F3F]'
                    }`}
                  >
                    Bilingual Khmer & English
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Kantumruy Pro and Montserrat typography for all operational teams.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sign-in Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div
              className={`rounded-2xl p-7 sm:p-9 border transition-all duration-300 ${
                isDark
                  ? 'bg-[#16202C]/95 border-white/15 shadow-2xl shadow-black/60 backdrop-blur-xl'
                  : 'bg-white border-gray-200 shadow-2xl shadow-slate-300/40'
              }`}
            >
              {isPendingPasswordReset ? (
                /* MANDATORY PASSWORD RESET VIEW (2 TEXTBOX INPUTS: PASSWORD & CONFIRM PASSWORD) */
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  {/* Password Reset Header */}
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center mx-auto mb-3 border border-[#FF9900]/30 shadow-xs">
                      <KeyRound className="w-7 h-7 text-[#FF9900]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/30 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Security Verification Required</span>
                    </div>
                    <h2
                      className={`text-2xl font-black tracking-tight ${
                        isDark ? 'text-white' : 'text-[#232F3F]'
                      }`}
                    >
                      Set Your Account Password
                    </h2>
                    <p
                      className={`text-xs mt-1.5 font-medium leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Your account was provisioned by an Administrator. Please enter and confirm your password below to activate your account.
                    </p>
                  </div>

                  {/* User info preview badge */}
                  {pendingResetUser && (
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isDark
                          ? 'bg-[#0E1520] border-white/10 text-gray-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-lg bg-[#77BC1F]/20 text-[#77BC1F] font-black flex items-center justify-center text-xs">
                          {pendingResetUser.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-sm text-[#232F3F] dark:text-white truncate">
                            {pendingResetUser.fullNameEn}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                            @{pendingResetUser.username} • {pendingResetUser.departmentName}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 uppercase shrink-0">
                        {pendingResetUser.role}
                      </span>
                    </div>
                  )}

                  {/* Reset Error Alert */}
                  {resetError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-2.5 text-xs font-semibold">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {/* Reset Success Alert */}
                  {resetSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 text-xs font-bold">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                      <span>Password changed successfully! Redirecting to SLA portal...</span>
                    </div>
                  )}

                  {/* 2-Textbox Password Reset Form */}
                  <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                    {/* Textbox 1: Password */}
                    <div>
                      <label
                        className={`block font-bold text-xs mb-1.5 ${
                          isDark ? 'text-gray-200' : 'text-[#232F3F]'
                        }`}
                      >
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          placeholder="Enter password (minimum 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium border transition-all ${
                            isDark
                              ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                              : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Textbox 2: Confirm Password */}
                    <div>
                      <label
                        className={`block font-bold text-xs mb-1.5 ${
                          isDark ? 'text-gray-200' : 'text-[#232F3F]'
                        }`}
                      >
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium border transition-all ${
                            isDark
                              ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                              : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Criteria checklist */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        {newPassword.length >= 6 ? (
                          <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">•</span>
                        )}
                        <span className={newPassword.length >= 6 ? 'text-[#77BC1F] font-bold' : 'text-gray-400'}>
                          At least 6 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {confirmPassword.length > 0 && newPassword === confirmPassword ? (
                          <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">•</span>
                        )}
                        <span
                          className={
                            confirmPassword.length > 0 && newPassword === confirmPassword
                              ? 'text-[#77BC1F] font-bold'
                              : 'text-gray-400'
                          }
                        >
                          Passwords match
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2.5 pt-2">
                      <button
                        type="submit"
                        disabled={
                          isResetSubmitting ||
                          resetSuccess ||
                          newPassword.length < 6 ||
                          newPassword !== confirmPassword
                        }
                        className="w-full py-3.5 bg-[#77BC1F] hover:bg-[#66A31A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#77BC1F]/30 transition-all cursor-pointer glow-green"
                      >
                        {isResetSubmitting ? (
                          <span>Updating Password...</span>
                        ) : (
                          <>
                            <span>Save Password & Enter Portal</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={cancelPasswordReset}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isDark
                            ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                            : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        Cancel / Back to Sign In
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Card Header & Login Tabs */
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#77BC1F]/15 text-[#558D14] flex items-center justify-center mx-auto mb-3.5 border border-[#77BC1F]/30 shadow-xs">
                      <Lock className="w-7 h-7 text-[#77BC1F]" />
                    </div>
                    <h2
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        isDark ? 'text-white' : 'text-[#232F3F]'
                      }`}
                    >
                      Sign In to Portal
                    </h2>
                    <p
                      className={`text-sm mt-1.5 font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      SLA B' Groceries INTERNAL Service Governance
                    </p>
                  </div>

                  {/* Mode Tabs: Standard Sign In vs First-Time Setup */}
                  <div className="flex rounded-xl p-1 bg-gray-100 dark:bg-[#0E1520] mb-5 border border-gray-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginTab('signin');
                        clearError();
                        setResetError(null);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        loginTab === 'signin'
                          ? 'bg-[#77BC1F] text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Standard Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginTab('first_time');
                        clearError();
                        setResetError(null);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        loginTab === 'first_time'
                          ? 'bg-[#77BC1F] text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      First-Time / Set Password
                    </button>
                  </div>

                  {/* Login or Reset Error Alert */}
                  {(loginError || resetError) && (
                    <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                      <span>{loginError || resetError}</span>
                    </div>
                  )}

                  {loginTab === 'signin' ? (
                    /* TAB 1: Standard Credentials Form */
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div>
                        <label
                          className={`block font-bold text-xs sm:text-sm mb-1.5 ${
                            isDark ? 'text-gray-200' : 'text-[#232F3F]'
                          }`}
                        >
                          Username or Corporate Email
                        </label>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            className={`block font-bold text-xs sm:text-sm ${
                              isDark ? 'text-gray-200' : 'text-[#232F3F]'
                            }`}
                          >
                            Password
                          </label>
                          <span
                            className={`text-xs font-semibold ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Authorized Staff
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full pl-11 pr-11 py-3 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4.5 h-4.5" />
                            ) : (
                              <Eye className="w-4.5 h-4.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Session checkbox */}
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded text-[#77BC1F] focus:ring-[#77BC1F] accent-[#77BC1F]"
                          />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            Keep session active
                          </span>
                        </label>
                        <span
                          className={`font-semibold text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          IT Policy 2026
                        </span>
                      </div>

                      {/* Submit Sign In Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#77BC1F] hover:bg-[#66A31A] disabled:opacity-50 text-white font-extrabold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#77BC1F]/30 transition-all active:scale-[0.98] cursor-pointer glow-green"
                      >
                        {isLoading ? (
                          <span>Authenticating...</span>
                        ) : (
                          <>
                            <span>Sign In to SLA Portal</span>
                            <ArrowRight className="w-4.5 h-4.5 stroke-[3]" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* TAB 2: Normal User First-Time Setup with 2 Textbox Inputs (Password & Confirm Password) */
                    <form onSubmit={handleFirstTimeSubmit} className="space-y-4">
                      <div className="p-3 bg-[#77BC1F]/10 border border-[#77BC1F]/30 rounded-xl text-xs text-[#232F3F] dark:text-gray-200 leading-relaxed flex items-start gap-2">
                        <KeyRound className="w-4 h-4 text-[#77BC1F] shrink-0 mt-0.5" />
                        <span>
                          <strong>First-Time Account Activation:</strong> Enter your temporary credentials provided by Admin, then choose your permanent Password and Confirm Password below.
                        </span>
                      </div>

                      <div>
                        <label
                          className={`block font-bold text-xs mb-1.5 ${
                            isDark ? 'text-gray-200' : 'text-[#232F3F]'
                          }`}
                        >
                          Username or Corporate Email *
                        </label>
                        <div className="relative">
                          <User className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. sokha_meas or username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block font-bold text-xs mb-1.5 ${
                            isDark ? 'text-gray-200' : 'text-[#232F3F]'
                          }`}
                        >
                          Temporary / Initial Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showTempPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter initial password given by Admin"
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowTempPassword(!showTempPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                          >
                            {showTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Textbox 1: Password */}
                      <div>
                        <label
                          className={`block font-bold text-xs mb-1.5 ${
                            isDark ? 'text-gray-200' : 'text-[#232F3F]'
                          }`}
                        >
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="Enter password (minimum 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Textbox 2: Confirm Password */}
                      <div>
                        <label
                          className={`block font-bold text-xs mb-1.5 ${
                            isDark ? 'text-gray-200' : 'text-[#232F3F]'
                          }`}
                        >
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              isDark
                                ? 'bg-[#0E1520] border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/30'
                                : 'bg-gray-50 border-gray-300 text-[#232F3F] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Criteria checklist */}
                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          {newPassword.length >= 6 ? (
                            <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">•</span>
                          )}
                          <span className={newPassword.length >= 6 ? 'text-[#77BC1F] font-bold' : 'text-gray-400'}>
                            At least 6 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {confirmPassword.length > 0 && newPassword === confirmPassword ? (
                            <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">•</span>
                          )}
                          <span
                            className={
                              confirmPassword.length > 0 && newPassword === confirmPassword
                                ? 'text-[#77BC1F] font-bold'
                                : 'text-gray-400'
                            }
                          >
                            Passwords match
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          isResetSubmitting ||
                          resetSuccess ||
                          newPassword.length < 6 ||
                          newPassword !== confirmPassword ||
                          !username ||
                          !tempPassword
                        }
                        className="w-full py-3.5 bg-[#77BC1F] hover:bg-[#66A31A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#77BC1F]/30 transition-all cursor-pointer glow-green"
                      >
                        {isResetSubmitting ? (
                          <span>Activating Account...</span>
                        ) : (
                          <>
                            <span>Save Password & Sign In</span>
                            <ArrowRight className="w-4.5 h-4.5 stroke-[3]" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* Corporate Security Notice */}
              <div
                className={`mt-6 pt-4 border-t text-center text-xs ${
                  isDark
                    ? 'border-white/10 text-gray-400'
                    : 'border-gray-100 text-gray-500'
                }`}
              >
                <div
                  className={`flex items-center justify-center gap-1.5 font-bold mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#77BC1F]" />
                  <span>Internal Hyperstore Governance</span>
                </div>
                <p className="leading-relaxed text-[11px] font-medium">
                  Public user self-registration is disabled. Access accounts are restricted
                  to authorized Hyperstore personnel only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-inherit/10 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium">
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            © 2026 SLA B' Groceries INTERNAL — Hyperstore (Cambodia). SLA v2.0 Operational
            Framework.
          </div>
          <div
            className={`flex items-center gap-4 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <span>Turnaround Standards</span>
            <span>•</span>
            <span>RACI Matrix</span>
            <span>•</span>
            <span>Phnom Penh Ops</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
