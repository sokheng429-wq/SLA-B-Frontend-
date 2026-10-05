import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDepartmentStore } from '../store/departmentStore';
import { useThemeStore } from '../store/themeStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CheckCircle2, AlertTriangle, RefreshCw, Star, Zap, Clock, ShieldCheck } from 'lucide-react';

const Q4_MONTHLY_DATA = [
  { month: 'Oct 2026', total: 96, onTime: 92, delayed: 4, compliance: 95.8, csat: 4.7 },
  { month: 'Nov 2026', total: 104, onTime: 100, delayed: 4, compliance: 96.2, csat: 4.8 },
  { month: 'Dec 2026', total: 87, onTime: 83, delayed: 4, compliance: 95.4, csat: 4.75 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Creative & Design', value: 124, color: '#77BC1F' }, // Primary Green
  { name: 'Multimedia & Video', value: 68, color: '#232F3F' }, // Navy
  { name: 'Digital & CRM', value: 52, color: '#FF9900' }, // Accent Orange
  { name: 'Campaigns & Trade', value: 31, color: '#558D14' },
  { name: 'PR & Crisis', value: 12, color: '#DE350B' },
];

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { getCurrentDepartment } = useDepartmentStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const dept = getCurrentDepartment();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Live Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>SLA PERFORMANCE GOVERNANCE • Q4 2026 LIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">
            {t('nav.dashboard')} — {dept.nameEn}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Real-time compliance tracking across all service tiers and Cambodian calendar rules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-5 py-2.5 rounded-2xl bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] text-xs md:text-sm font-extrabold flex items-center gap-2.5 border border-[#77BC1F]/40 shadow-sm backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-[#77BC1F]" />
            <span>Overall SLA Status: COMPLIANT (95.8%)</span>
          </span>
        </div>
      </div>

      {/* 6 Core KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Overall SLA Compliance */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#77BC1F] backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Overall SLA</span>
            <div className="w-8 h-8 rounded-lg bg-[#77BC1F]/15 text-[#77BC1F] flex items-center justify-center border border-[#77BC1F]/30">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">95.8%</div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-[#77BC1F]/10 px-2 py-0.5 rounded-md border border-[#77BC1F]/20 inline-block">
              Target: &ge; 95.0% ✅
            </div>
          </div>
        </div>

        {/* KPI 2: Brief Quality (Rejection Rate) */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#FF9900] backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Brief Rejections</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center border border-[#FF9900]/30">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">3.8%</div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
              Target: &le; 5.0% ✅
            </div>
          </div>
        </div>

        {/* KPI 3: Revision Efficiency */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#232F3F] dark:border-t-slate-400 backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Avg Revisions</span>
            <div className="w-8 h-8 rounded-lg bg-[#232F3F]/10 dark:bg-white/10 text-[#232F3F] dark:text-gray-200 flex items-center justify-center border border-[#232F3F]/15 dark:border-white/15">
              <RefreshCw className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">1.4</div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
              Target: &le; 2.0 Rounds ✅
            </div>
          </div>
        </div>

        {/* KPI 4: Initial Response */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#77BC1F] backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Initial Response</span>
            <div className="w-8 h-8 rounded-lg bg-[#77BC1F]/15 text-[#77BC1F] flex items-center justify-center border border-[#77BC1F]/30">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">98.6%</div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-[#77BC1F]/10 px-2 py-0.5 rounded-md border border-[#77BC1F]/20 inline-block">
              Target: &ge; 98.0% ✅
            </div>
          </div>
        </div>

        {/* KPI 5: Stakeholder CSAT */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#FF9900] backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Stakeholder CSAT</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center border border-[#FF9900]/30">
              <Star className="w-4.5 h-4.5 fill-[#FF9900]" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">
              4.75 <span className="text-sm text-gray-400 font-semibold">/ 5.0</span>
            </div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
              Target: &ge; 4.5 ✅
            </div>
          </div>
        </div>

        {/* KPI 6: Rush SLA Compliance */}
        <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:shadow-black/15 transition-all flex flex-col justify-between border-t-4 border-t-[#77BC1F] backdrop-blur-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs md:text-sm font-bold mb-3">
            <span>Rush SLA</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center border border-[#FF9900]/30">
              <Zap className="w-4.5 h-4.5 fill-[#FF9900]" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight">92.5%</div>
            <div className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold mt-1.5 bg-[#77BC1F]/10 px-2 py-0.5 rounded-md border border-[#77BC1F]/20 inline-block">
              Target: &ge; 90.0% ✅
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-Time Delivery vs Delays Bar Chart */}
        <div className="lg:col-span-2 p-7 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm space-y-4 backdrop-blur-xs">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <h3 className="font-black text-[#232F3F] dark:text-white text-base md:text-lg">Monthly On-Time Deliveries vs Breaches</h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">Q4 Actual Performance Metrics across SLA tiers</p>
            </div>
            <span className="text-xs md:text-sm font-extrabold px-3.5 py-1.5 rounded-xl bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 shadow-2xs">
              287 Total Requests
            </span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Q4_MONTHLY_DATA} margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'} />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: isDark ? '#E2E8F0' : '#232F3F', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 13, fill: isDark ? '#94A3B8' : '#6B778C', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#DFE1E6',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: isDark ? '#FFFFFF' : '#232F3F',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    fontWeight: 600,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingTop: '12px' }} />
                <Bar dataKey="onTime" name="Delivered On-Time" fill="#77BC1F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed / Breached" fill="#DE350B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deliverable Volume by Category */}
        <div className="p-7 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm space-y-4 backdrop-blur-xs">
          <div className="border-b border-gray-100 dark:border-white/10 pb-4">
            <h3 className="font-black text-[#232F3F] dark:text-white text-base md:text-lg">Volume by Deliverable Category</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">Creative vs Video vs Digital Breakdown</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#16202C' : '#FFFFFF'} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#DFE1E6',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: isDark ? '#FFFFFF' : '#232F3F',
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-200 font-semibold pt-1">
            {CATEGORY_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center gap-2 truncate">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
