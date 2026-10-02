import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  Send
} from 'lucide-react';
import PriorityIcon from './PriorityIcon';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export default function TicketDetailPanel({
  ticket,
  onClose = () => {}
}) {
  const {
    pauseTicket,
    resumeTicket,
    requestRevision,
    addComment
  } = useApp();

  const [activeTab, setActiveTab] = useState('comments');
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('MISSING_INFO');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Early return placed AFTER all React Hook calls
  if (!ticket) return null;

  const isPaused = ticket.clock_state === 'PAUSED';
  const isDelivered = ticket.status === 'DELIVERED';
  const revisionCount = ticket.revision_count || 0;

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ticket.id, commentText, isInternalComment);
    setCommentText('');
  };

  const handleConfirmPause = () => {
    pauseTicket(ticket.id, pauseReason);
    setShowPauseModal(false);
  };

  const handleConfirmRevision = () => {
    if (!revisionFeedback.trim()) return;
    requestRevision(ticket.id, revisionFeedback);
    setRevisionFeedback('');
    setShowRevisionModal(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[580px] lg:w-[680px] bg-[#1E2837] text-white border-l border-[#2E3D50] shadow-2xl z-50 flex flex-col select-none">
      {/* Top Header Bar */}
      <div className="h-14 px-6 border-b border-[#2E3D50] flex items-center justify-between shrink-0 bg-[#141C26]">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-mono font-bold text-[#77BC1F] hover:underline cursor-pointer">
            {ticket.id}
          </span>
          <span className="text-[#4B5E76]">/</span>
          <StatusBadge status={ticket.status} />
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl hover:bg-[#2A384A] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Title */}
        <div>
          <h2
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-[20px] font-black text-white leading-snug tracking-tight"
          >
            {ticket.title}
          </h2>
          <div className="text-[12px] text-[#94A3B8] mt-1 font-medium">
            Submitted: {ticket.submitted_at || 'Today'}
          </div>
        </div>

        {/* SLA Status / Clock Controls Banner */}
        <div
          className={`p-4 rounded-xl border ${
            isPaused
              ? 'bg-amber-950/40 border-amber-600/60 text-[#FF9900]'
              : isDelivered
              ? 'bg-emerald-950/40 border-emerald-600/60 text-[#77BC1F]'
              : 'bg-[#141C26] border-[#2E3D50] text-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-bold text-[13px]">
              {isPaused ? (
                <PauseCircle size={18} className="animate-pulse text-[#FF9900]" />
              ) : isDelivered ? (
                <CheckCircle2 size={18} className="text-[#77BC1F]" />
              ) : (
                <Clock size={18} className="text-[#FF9900]" />
              )}
              <span>
                {isPaused
                  ? `SLA Paused (${ticket.pause_reason || 'Waiting for Requester'})`
                  : isDelivered
                  ? 'Delivered (SLA Completed)'
                  : ticket.slaTimeLeft || `${ticket.tat_days || 3} Business Days TAT`}
              </span>
            </div>

            {/* SLA Clock Action Buttons */}
            {!isDelivered && (
              <div className="flex items-center gap-2">
                {isPaused ? (
                  <button
                    onClick={() => resumeTicket(ticket.id)}
                    className="px-3 py-1.5 bg-[#77BC1F] hover:bg-[#65A319] text-[#0B0F14] font-black rounded-lg text-[12px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <PlayCircle size={13} />
                    <span>Resume Clock</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPauseModal(true)}
                    className="px-3 py-1.5 bg-[#1A232F] hover:bg-[#2A384A] text-[#FF9900] border border-[#FF9900]/50 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <PauseCircle size={13} />
                    <span>Pause Clock</span>
                  </button>
                )}

                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-3 py-1.5 bg-[#1A232F] hover:bg-[#2A384A] text-[#CBD5E1] border border-[#2E3D50] rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Revision (R{revisionCount})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Properties Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-3 border-t border-[#2E3D50] text-[13px]">
          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Status
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Priority
            </div>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <PriorityIcon priority={ticket.priority} size={15} />
              <span>Priority {ticket.priority || 'P3'}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Assignee
            </div>
            <div className="flex items-center gap-2">
              <Avatar name={ticket.assignee || 'Unassigned'} size={24} />
              <span className="font-semibold text-white">
                {ticket.assignee || 'Unassigned'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Reporter
            </div>
            <div className="flex items-center gap-2">
              <Avatar name={ticket.requester || 'Requester'} size={24} bgColor="#505258" />
              <span className="font-semibold text-white">
                {ticket.requester || 'Requester'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Service Catalog
            </div>
            <div className="font-semibold text-white">
              {ticket.catalogName || 'Creative Graphic'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Due Date
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Calendar size={14} className="text-[#FF9900]" />
              <span>{ticket.due_date || '30 Sept 2026'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Brief Details */}
        {ticket.brief_json && Object.keys(ticket.brief_json).length > 0 && (
          <div className="p-4 bg-[#141C26] rounded-xl border border-[#2E3D50] space-y-2">
            <div className="text-[12px] font-black text-[#77BC1F] uppercase tracking-wider mb-2">
              Mandatory Brief Data (No Brief = No Start)
            </div>
            {Object.entries(ticket.brief_json).map(([key, val]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start text-[13px] py-1 border-b border-[#2E3D50]/40 last:border-0">
                <span className="w-40 text-[#94A3B8] font-semibold shrink-0 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-white break-all font-medium">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Activity & Comments Tabs */}
        <div className="pt-2 border-t border-[#2E3D50]">
          <div className="flex items-center gap-4 border-b border-[#2E3D50] mb-4 text-[13px] font-bold">
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === 'comments'
                  ? 'text-white'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Comments ({ticket.comments?.length || 0})
              {activeTab === 'comments' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#77BC1F] rounded-full shadow-[0_0_8px_rgba(119,188,31,0.8)]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === 'history'
                  ? 'text-white'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              History ({ticket.ticket_pauses?.length || 0})
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#77BC1F] rounded-full shadow-[0_0_8px_rgba(119,188,31,0.8)]" />
              )}
            </button>
          </div>

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Existing Comments */}
              <div className="space-y-3">
                {ticket.comments?.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border ${
                      c.internal
                        ? 'bg-amber-950/20 border-amber-600/40'
                        : 'bg-[#141C26] border-[#2E3D50]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[12px]">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <Avatar name={c.author} size={18} />
                        <span>{c.author}</span>
                        {c.internal && (
                          <span className="text-[10px] font-black uppercase bg-[#FF9900]/20 text-[#FF9900] px-1.5 py-0.5 rounded border border-[#FF9900]/40">
                            Internal
                          </span>
                        )}
                      </div>
                      <span className="text-[#94A3B8] text-xs">{c.time}</span>
                    </div>
                    <p className="text-[13.5px] text-[#CBD5E1] leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleSendComment} className="space-y-2.5 pt-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment or internal work note..."
                  rows={3}
                  className="w-full p-3 text-[13px] bg-[#141C26] border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl text-white placeholder:text-[#64748B] outline-none"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[12px] text-[#CBD5E1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="rounded text-[#FF9900] accent-[#FF9900] cursor-pointer"
                    />
                    <span>Internal note (Marketing team only)</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-[#FF9900] to-[#E68A00] hover:from-[#FFA726] hover:to-[#FF9900] text-[#0B0F14] font-black rounded-xl text-[13px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,153,0,0.35)] transition-all cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-2 text-[12px]">
              <div className="p-3 bg-[#141C26] rounded-xl border border-[#2E3D50] text-[#CBD5E1]">
                Ticket created and entered <strong className="text-white">{ticket.status}</strong> on{' '}
                {ticket.submitted_at}
              </div>
              {ticket.ticket_pauses?.map((p) => (
                <div key={p.id} className="p-3 bg-amber-950/30 rounded-xl border border-amber-800 text-[#FF9900]">
                  SLA Paused ({p.reason}) by {p.started_by} at {p.started_at}
                </div>
              ))}
              {ticket.revisions?.map((r) => (
                <div key={r.id} className="p-3 bg-purple-950/30 rounded-xl border border-purple-800 text-purple-300">
                  Revision Round {r.round_no} requested by {r.requested_by}: "{r.feedback}"
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-[#232F3F] text-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#2E3D50] space-y-4">
            <h3 className="text-[17px] font-black text-white">
              Pause SLA Clock
            </h3>
            <p className="text-[13px] text-[#94A3B8]">
              Pausing stops the SLA turnaround timer until requester info is provided.
            </p>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#94A3B8]">
                Reason
              </label>
              <select
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-[#141C26] border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl text-white text-[13px] outline-none"
              >
                <option value="MISSING_INFO" className="bg-[#141C26]">Missing Required Brief Info</option>
                <option value="MISSING_ASSETS" className="bg-[#141C26]">Missing High-Res Assets / Logos</option>
                <option value="AWAITING_REQUESTER" className="bg-[#141C26]">Awaiting Requester Feedback</option>
              </select>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 text-[13px] font-bold text-[#CBD5E1] bg-[#1A232F] hover:bg-[#2A384A] border border-[#2E3D50] rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPause}
                className="px-4 py-2 text-[13px] font-black bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all cursor-pointer"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-[#232F3F] text-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#2E3D50] space-y-4">
            <h3 className="text-[17px] font-black text-white">
              Request Revision (Round {revisionCount + 1})
            </h3>
            <p className="text-[13px] text-[#94A3B8]">
              {revisionCount + 1 >= 3
                ? 'Notice: Round 3+ triggers a formal Change Request and adds +3 business days to TAT.'
                : 'Enter specific corrections required.'}
            </p>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="Explain the required revisions clearly..."
              rows={3}
              className="w-full p-3 bg-[#141C26] border border-[#2E3D50] focus:border-[#77BC1F] rounded-xl text-white text-[13px] outline-none"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-[13px] font-bold text-[#CBD5E1] bg-[#1A232F] hover:bg-[#2A384A] border border-[#2E3D50] rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-4 py-2 text-[13px] font-black bg-gradient-to-r from-[#FF9900] to-[#E68A00] text-[#0B0F14] rounded-xl shadow-[0_0_12px_rgba(255,153,0,0.35)] transition-all cursor-pointer"
              >
                Submit Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
