import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '../store/adminStore';
import { useAuthStore } from '../store/authStore';
import { Users2, Edit3 } from 'lucide-react';

export const RaciMatrixPage: React.FC = () => {
  const { t } = useTranslation();
  const { raciActivities, updateRaciRole } = useAdminStore();
  const { currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'ADMIN';

  const roleColumns = [
    { key: 'ceo', label: 'CEO / Exec' },
    { key: 'opsManager', label: 'Ops & Cost Mgr' },
    { key: 'storeManager', label: 'Store Mgr' },
    { key: 'financeSupervisor', label: 'Finance Sup' },
    { key: 'purchasingOfficer', label: 'Purchasing Off' },
    { key: 'graphicDesigner', label: 'Graphic Des' },
    { key: 'webDeveloper', label: 'Web Dev' },
    { key: 'digitalMarketingOfficer', label: 'Digital Mktg' },
  ];

  const getRaciBadge = (code: 'R' | 'A' | 'C' | 'I') => {
    switch (code) {
      case 'R':
        return 'bg-[#77BC1F]/20 text-[#558D14] border-[#77BC1F]/50 font-black';
      case 'A':
        return 'bg-red-100 text-red-800 border-red-300 font-black ring-2 ring-red-400/50';
      case 'C':
        return 'bg-[#FF9900]/20 text-[#B26A00] border-[#FF9900]/50 font-black';
      case 'I':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 font-bold';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>CROSS-FUNCTIONAL GOVERNANCE • RACI MATRIX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight flex items-center gap-3">
            <Users2 className="w-8 h-8 text-[#77BC1F]" />
            <span>{t('nav.raci')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Responsibility Assignment Matrix across 13 Cross-Functional Deliverable Workflows
          </p>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 text-xs md:text-sm font-extrabold text-[#558D14] dark:text-[#77BC1F] shadow-xs">
            <Edit3 className="w-4 h-4 text-[#77BC1F]" />
            <span>Admin Edit Mode Active</span>
          </div>
        ) : (
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic font-medium">
            (Read-only view for your role)
          </div>
        )}
      </div>

      {/* RACI Legend Banner */}
      <div className="p-5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-sm shadow-sm backdrop-blur-xs">
        <span className="font-black text-[#232F3F] dark:text-white text-base">Governance Legend:</span>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg border flex items-center justify-center font-black bg-[#77BC1F]/20 dark:bg-[#77BC1F]/25 text-[#558D14] dark:text-[#77BC1F] border-[#77BC1F]/40 text-sm shadow-2xs">
              R
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs md:text-sm">Responsible (អ្នកអនុវត្ត)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg border flex items-center justify-center font-black bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 ring-2 ring-red-400/50 text-sm shadow-2xs">
              A
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs md:text-sm">Accountable (អ្នកទទួលខុសត្រូវខ្ពស់/សម្រេច)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg border flex items-center justify-center font-black bg-[#FF9900]/20 dark:bg-[#FF9900]/25 text-[#B26A00] dark:text-[#FF9900] border-[#FF9900]/40 text-sm shadow-2xs">
              C
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs md:text-sm">Consulted (អ្នកផ្តល់យោបល់)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/15 text-sm shadow-2xs">
              I
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs md:text-sm">Informed (អ្នកទទួលដំណឹង)</span>
          </div>
        </div>
      </div>

      {/* RACI Table */}
      <div className="bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-[#121924] border-b border-gray-200 dark:border-white/10 text-[#232F3F] dark:text-gray-200 font-bold uppercase text-xs tracking-wider">
                <th className="py-4 px-3 w-12 text-center">#</th>
                <th className="py-4 px-4 w-44">Category</th>
                <th className="py-4 px-5 min-w-[280px]">Key Workflow Activity</th>
                {roleColumns.map((col) => (
                  <th key={col.key} className="py-4 px-2 text-center w-28">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {raciActivities.map((act) => (
                <tr key={act.id} className="hover:bg-[#77BC1F]/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-gray-500 dark:text-gray-400 text-center">
                    {act.id}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-[#232F3F] dark:text-white block">{act.categoryEn}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-khmer mt-0.5">{act.categoryKh}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#232F3F] dark:text-gray-100 leading-snug">{act.activityNameEn}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-khmer mt-1">{act.activityNameKh}</div>
                  </td>
                  {roleColumns.map((col) => {
                    const code = (act.roles as any)[col.key] as 'R' | 'A' | 'C' | 'I';
                    return (
                      <td key={col.key} className="py-4 px-2 text-center">
                        {isAdmin ? (
                          <select
                            value={code}
                            onChange={(e) =>
                              updateRaciRole(act.id, col.key, e.target.value as 'R' | 'A' | 'C' | 'I')
                            }
                            className={`w-9 h-8 text-center rounded-lg border font-black text-sm focus:outline-none cursor-pointer ${getRaciBadge(
                              code
                            )}`}
                          >
                            <option value="R">R</option>
                            <option value="A">A</option>
                            <option value="C">C</option>
                            <option value="I">I</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-black ${getRaciBadge(
                              code
                            )}`}
                          >
                            {code}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
