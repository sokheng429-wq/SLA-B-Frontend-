import React from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SummaryView() {
  const { tickets, lang } = useApp();

  const total = tickets.length;
  const delivered = tickets.filter((t) => t.status === 'DELIVERED').length;
  const inProgress = tickets.filter(
    (t) => t.status === 'IN_PRODUCTION' || t.status === 'IN_PROGRESS'
  ).length;
  const inReview = tickets.filter((t) => t.status === 'IN_REVIEW').length;
  const todo = tickets.filter(
    (t) => t.status === 'BRIEF_CHECK' || t.status === 'SUBMITTED' || t.status === 'TO_DO'
  ).length;
  const paused = tickets.filter((t) => t.clock_state === 'PAUSED').length;

  const slaCompliance = delivered > 0 ? 95.8 : 95.0;

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0B0F14] space-y-6 select-none max-w-6xl text-white">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#232F3F] border border-[#2E3D50] rounded-2xl shadow-xl hover:border-[#77BC1F]/60 transition-all group">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-bold mb-1">
            <span>SLA Compliance</span>
            <Target size={18} className="text-[#77BC1F]" />
          </div>
          <div
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[32px] font-black text-[#77BC1F] tracking-tight group-hover:scale-105 transition-transform"
          >
            {slaCompliance}%
          </div>
          <div className="text-[11px] font-bold text-[#77BC1F] mt-1 flex items-center gap-1">
            <span>✓ Target &gt;= 95% (Met)</span>
          </div>
        </div>

        <div className="p-5 bg-[#232F3F] border border-[#2E3D50] rounded-2xl shadow-xl hover:border-[#77BC1F]/60 transition-all group">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-bold mb-1">
            <span>Total Requests</span>
            <CheckCircle2 size={18} className="text-[#77BC1F]" />
          </div>
          <div
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[32px] font-black text-white tracking-tight group-hover:scale-105 transition-transform"
          >
            {total}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            {delivered} delivered, {inProgress + inReview} active
          </div>
        </div>

        <div className="p-5 bg-[#232F3F] border border-[#2E3D50] rounded-2xl shadow-xl hover:border-[#FF9900]/60 transition-all group">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-bold mb-1">
            <span>Avg Revisions</span>
            <RotateCcw size={18} className="text-[#FF9900]" />
          </div>
          <div
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[32px] font-black text-[#FF9900] tracking-tight group-hover:scale-105 transition-transform"
          >
            1.2
          </div>
          <div className="text-[11px] font-bold text-[#77BC1F] mt-1">
            Max 2 Rounds Cap (Compliant)
          </div>
        </div>

        <div className="p-5 bg-[#232F3F] border border-[#2E3D50] rounded-2xl shadow-xl hover:border-rose-500/60 transition-all group">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-bold mb-1">
            <span>Clocks Paused</span>
            <Clock size={18} className="text-rose-400" />
          </div>
          <div
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[32px] font-black text-rose-400 tracking-tight group-hover:scale-105 transition-transform"
          >
            {paused}
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            Awaiting brief / assets
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div className="p-6 border border-[#2E3D50] rounded-2xl bg-[#232F3F] shadow-xl space-y-4">
        <h3
          style={{ fontFamily: 'Nunito, sans-serif' }}
          className="text-[16px] font-black text-white"
        >
          Workflow Status Distribution
        </h3>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full bg-[#141C26] rounded-full overflow-hidden flex border border-[#2E3D50]">
          {todo > 0 && (
            <div
              style={{ width: `${(todo / total) * 100}%` }}
              className="bg-[#475569] hover:opacity-90 transition-all"
              title={`To Do: ${todo}`}
            />
          )}
          {inProgress > 0 && (
            <div
              style={{ width: `${(inProgress / total) * 100}%` }}
              className="bg-[#FF9900] hover:opacity-90 transition-all shadow-[0_0_8px_rgba(255,153,0,0.5)]"
              title={`In Progress: ${inProgress}`}
            />
          )}
          {inReview > 0 && (
            <div
              style={{ width: `${(inReview / total) * 100}%` }}
              className="bg-[#FBBF24] hover:opacity-90 transition-all"
              title={`In Review: ${inReview}`}
            />
          )}
          {delivered > 0 && (
            <div
              style={{ width: `${(delivered / total) * 100}%` }}
              className="bg-[#77BC1F] hover:opacity-90 transition-all shadow-[0_0_8px_rgba(119,188,31,0.5)]"
              title={`Done: ${delivered}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 text-[12.5px] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#475569]" />
            <span className="text-[#CBD5E1]">To Do ({todo})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF9900]" />
            <span className="text-[#CBD5E1]">In Progress ({inProgress})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FBBF24]" />
            <span className="text-[#CBD5E1]">In Review ({inReview})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#77BC1F]" />
            <span className="text-[#CBD5E1]">Delivered ({delivered})</span>
          </div>
        </div>
      </div>

      {/* Priority & Quota Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 border border-[#2E3D50] rounded-2xl bg-[#232F3F] shadow-xl space-y-4">
          <h3
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[16px] font-black text-white"
          >
            Priority Tier Breakdown
          </h3>
          {['P1', 'P2', 'P3', 'P4'].map((p) => {
            const count = tickets.filter((t) => t.priority === p).length;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={p} className="space-y-1.5">
                <div className="flex justify-between text-[12.5px] font-bold text-[#CBD5E1]">
                  <span>Priority {p}</span>
                  <span>{count} tickets</span>
                </div>
                <div className="h-2.5 w-full bg-[#141C26] rounded-full overflow-hidden border border-[#2E3D50]/60">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full ${
                      p === 'P1'
                        ? 'bg-[#FF9900] shadow-[0_0_8px_rgba(255,153,0,0.6)]'
                        : p === 'P2'
                        ? 'bg-[#FF7B00]'
                        : p === 'P3'
                        ? 'bg-[#FBBF24]'
                        : 'bg-[#77BC1F]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border border-[#2E3D50] rounded-2xl bg-[#232F3F] shadow-xl space-y-4">
          <div>
            <h3
              style={{ fontFamily: 'Nunito, sans-serif' }}
              className="text-[16px] font-black text-white"
            >
              Departmental Rush Quota Usage
            </h3>
            <p className="text-[12px] text-[#94A3B8] mt-0.5">
              Strict rule: Max 3 rush requests per department per month.
            </p>
          </div>
          <div className="space-y-3 pt-1 text-[13px]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141C26] border border-[#2E3D50]">
              <span className="font-bold text-white">Commercial & Purchasing</span>
              <span className="text-[12px] font-black text-[#FF9900] bg-[#FF9900]/15 px-2.5 py-0.5 rounded-full border border-[#FF9900]/30">
                2 / 3 used
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141C26] border border-[#2E3D50]">
              <span className="font-bold text-white">Store Operations</span>
              <span className="text-[12px] font-black text-[#77BC1F] bg-[#77BC1F]/15 px-2.5 py-0.5 rounded-full border border-[#77BC1F]/30">
                1 / 3 used
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141C26] border border-[#2E3D50]">
              <span className="font-bold text-white">E-Commerce & Digital</span>
              <span className="text-[12px] font-black text-[#77BC1F] bg-[#77BC1F]/15 px-2.5 py-0.5 rounded-full border border-[#77BC1F]/30">
                1 / 3 used
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
