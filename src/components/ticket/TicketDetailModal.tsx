import React, { useState } from 'react';
import { useTicketStore } from '../../store/ticketStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { useAuthStore } from '../../store/authStore';
import { WorkflowStatusKey } from '../../types';
import { getLiveSlaClock } from '../../utils/slaEngine';
import { PriorityIcon } from '../common/PriorityIcon';
import { Avatar } from '../common/Avatar';
import { MOCK_USERS } from '../../data/mockUsers';
import {
  X,
  Clock,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Paperclip,
  MessageSquare,
  Lock,
  Star,
  Zap,
  RefreshCw,
  FolderArchive,
  Send
} from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: string;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticketId, onClose }) => {
  const { tickets, comments, updateTicketStatus, assignTicket, addComment, submitCsat } = useTicketStore();
  const { getCurrentDepartment } = useDepartmentStore();
  const { currentUser } = useAuthStore();

  const ticket = tickets.find((t) => t.id === ticketId);
  const ticketComments = (ticket && comments[ticket.id]) || [];

  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [damUrlInput, setDamUrlInput] = useState(ticket?.finalAssetUrl || '');
  const [csatRating, setCsatRating] = useState<number>(ticket?.csatScore || 0);
  const [csatFeedback, setCsatFeedback] = useState(ticket?.csatComment || '');

  if (!ticket) return null;

  const currentDept = getCurrentDepartment();
  const clock = getLiveSlaClock(ticket);

  const actor = {
    id: currentUser?.id || 'unknown',
    name: currentUser?.fullNameEn || 'System User',
    role: currentUser?.role || 'REQUESTER',
    avatar: currentUser?.avatarUrl,
  };

  const handleStatusChange = (newStatus: WorkflowStatusKey) => {
    let reason: string | undefined = undefined;
    if (newStatus === 'REJECTED') {
      const input = prompt("Please provide a rejection reason for the brief ('No Brief = No Start'):");
      if (!input || !input.trim()) return;
      reason = input.trim();
    }
    updateTicketStatus(ticket.id, newStatus, actor, reason);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(ticket.id, actor, newComment.trim(), isInternalComment);
    setNewComment('');
  };

  const handleSaveDamUrl = () => {
    if (!damUrlInput.trim()) return;
    updateTicketStatus(ticket.id, 'APPROVED_DELIVERED', actor, `Final assets uploaded to DAM: ${damUrlInput.trim()}`);
    alert('Final asset link recorded in DAM archive successfully.');
  };

  const handleCsatSubmit = () => {
    if (csatRating === 0) {
      alert('Please select a rating from 1 to 5 stars.');
      return;
    }
    submitCsat(ticket.id, csatRating, csatFeedback.trim());
    alert('Thank you for submitting your service rating (CSAT)!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16202C] rounded-2xl shadow-2xl border border-gray-300 dark:border-white/15 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header / Breadcrumb */}
        <div className="px-6 py-4.5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-[#121924] text-[#232F3F] dark:text-white">
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-semibold flex-wrap">
            <span className="text-[#558D14] dark:text-[#77BC1F] font-black">{currentDept.nameEn}</span>
            <span className="text-gray-300 dark:text-white/40">/</span>
            <span className="font-mono font-black text-[#232F3F] dark:text-white">{ticket.ticketNumber}</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/90 border border-gray-200 dark:border-white/20">
              {ticket.serviceCode}
            </span>
            {ticket.isRush && (
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#FF9900]/15 dark:bg-[#FF9900]/25 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/40 flex items-center gap-1 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
                <span>RUSH</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 dark:text-white/70 hover:text-[#232F3F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-sm">
          {/* LEFT COLUMN: Summary, Workflow Quick Actions, Brief, Attachments, Comments */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 border-r border-gray-200 dark:border-white/10">
            {/* Title */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#232F3F] dark:text-white leading-snug">
                {ticket.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                Requested by <strong className="text-gray-900 dark:text-white">{ticket.requesterName}</strong> from{' '}
                <span className="text-[#558D14] dark:text-[#77BC1F] font-bold">{ticket.requesterDepartmentName}</span> on{' '}
                {new Date(ticket.submittedAt).toLocaleDateString()} at{' '}
                {new Date(ticket.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Quick Status Transition Action Buttons */}
            <div className="p-4 bg-gray-50 dark:bg-[#121924] rounded-xl border border-gray-200 dark:border-white/10 flex flex-wrap items-center gap-2.5 shadow-2xs">
              <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">Quick Actions:</span>

              {ticket.status === 'SUBMITTED' && (
                <button
                  onClick={() => handleStatusChange('BRIEF_CHECK')}
                  className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold text-xs md:text-sm rounded-lg shadow-xs cursor-pointer transition-all"
                >
                  Start Brief Check
                </button>
              )}

              {ticket.status === 'BRIEF_CHECK' && (
                <>
                  <button
                    onClick={() => handleStatusChange('IN_PRODUCTION')}
                    className="px-4 py-2 bg-[#232F3F] hover:bg-[#171F2A] dark:bg-[#77BC1F] dark:hover:bg-[#66A31A] text-white dark:text-[#121924] font-bold text-xs md:text-sm rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    Approve Brief & Start Production
                  </button>
                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    Reject Brief (Incomplete)
                  </button>
                </>
              )}

              {ticket.status === 'IN_PRODUCTION' && (
                <>
                  <button
                    onClick={() => handleStatusChange('IN_REVIEW')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    Submit for Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('WAITING_FOR_REQUESTER')}
                    className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold text-xs md:text-sm rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>Pause Clock (Wait Info)</span>
                  </button>
                </>
              )}

              {ticket.status === 'WAITING_FOR_REQUESTER' && (
                <button
                  onClick={() => handleStatusChange('IN_PRODUCTION')}
                  className="px-4 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-bold text-xs md:text-sm rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Production</span>
                </button>
              )}

              {ticket.status === 'IN_REVIEW' && (
                <>
                  <button
                    onClick={() => handleStatusChange('APPROVED_DELIVERED')}
                    className="px-4 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-bold text-xs md:text-sm rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    Approve & Deliver
                  </button>
                  <button
                    onClick={() => handleStatusChange('IN_PRODUCTION')}
                    className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold text-xs md:text-sm rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Request Revision</span>
                  </button>
                </>
              )}

              {ticket.status === 'REJECTED' && (
                <span className="text-rose-600 dark:text-rose-400 font-bold text-xs md:text-sm">
                  Brief Rejected. SLA Timer stopped.
                </span>
              )}

              {ticket.status === 'APPROVED_DELIVERED' && (
                <span className="text-[#558D14] dark:text-[#77BC1F] font-bold text-xs md:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#77BC1F]" />
                  <span>Ticket Completed & Delivered (SLA Met)</span>
                </span>
              )}
            </div>

            {/* Brief Specification Details */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-[#232F3F] dark:text-white text-xs md:text-sm uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-1.5">
                Creative Brief Specifications
              </h3>
              <div className="bg-gray-50/80 dark:bg-[#121924] p-4.5 rounded-xl border border-gray-200/90 dark:border-white/10 space-y-3">
                {Object.keys(ticket.briefData).length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 italic">No specific brief details recorded.</p>
                ) : (
                  Object.entries(ticket.briefData).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 gap-3">
                      <span className="font-bold text-gray-700 dark:text-gray-300 capitalize text-xs md:text-sm">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="col-span-2 text-gray-900 dark:text-gray-100 font-medium whitespace-pre-wrap text-xs md:text-sm">
                        {String(val)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-[#232F3F] dark:text-white text-xs md:text-sm uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-1.5 flex items-center justify-between">
                <span>Supporting Assets & Proofs ({ticket.attachments.length})</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">Google Drive / DAM Linked</span>
              </h3>
              {ticket.attachments.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-gray-200 dark:border-white/15 rounded-xl text-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                  No attachments uploaded.
                </div>
              ) : (
                <div className="space-y-2">
                  {ticket.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-gray-50 dark:bg-[#121924] rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Paperclip className="w-4 h-4 text-[#77BC1F] shrink-0" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate text-xs md:text-sm">{att.fileName}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F]">
                          Round {att.versionRound}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 font-medium">
                        {(att.fileSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Final DAM Archiving Gate (Rule 10) */}
            {ticket.status === 'APPROVED_DELIVERED' && (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                  <FolderArchive className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>Rule 10: Master Asset Archiving (DAM / Google Drive)</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/80 leading-relaxed font-medium">
                  All master source files (.AI, .PSD, Figma, 4K video) must be archived within 24 hours of delivery.
                </p>
                <div className="flex items-center gap-2.5">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={damUrlInput}
                    onChange={(e) => setDamUrlInput(e.target.value)}
                    className="flex-1 p-2.5 bg-white dark:bg-[#121924] border border-emerald-300 dark:border-emerald-500/40 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77BC1F] font-mono text-xs"
                  />
                  <button
                    onClick={handleSaveDamUrl}
                    className="px-4 py-2.5 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-bold rounded-lg shrink-0 shadow-xs cursor-pointer text-xs md:text-sm"
                  >
                    Save Asset URL
                  </button>
                </div>
              </div>
            )}

            {/* CSAT Survey (Post Delivery Feedback) */}
            {ticket.status === 'APPROVED_DELIVERED' && (
              <div className="p-5 bg-[#77BC1F]/10 dark:bg-[#77BC1F]/15 border border-[#77BC1F]/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#232F3F] dark:text-white text-sm flex items-center gap-2">
                    <Star className="w-5 h-5 fill-[#FF9900] text-[#FF9900]" />
                    <span>Stakeholder Satisfaction Survey (CSAT)</span>
                  </span>
                  <span className="text-xs text-[#558D14] dark:text-[#77BC1F] font-bold">Target: &ge; 4.5 / 5.0</span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCsatRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= csatRating
                            ? 'fill-[#FF9900] text-[#FF9900]'
                            : 'text-gray-300 dark:text-gray-600 hover:text-[#FF9900]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 font-bold text-sm text-[#232F3F] dark:text-white">
                    {csatRating > 0 ? `${csatRating} / 5 Stars` : 'Not rated yet'}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Optional stakeholder comments on quality, speed, or communication..."
                  value={csatFeedback}
                  onChange={(e) => setCsatFeedback(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-[#121924] border border-gray-300 dark:border-white/15 dark:text-white rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#77BC1F]"
                />

                <button
                  onClick={handleCsatSubmit}
                  className="px-4 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-bold rounded-lg text-xs md:text-sm shadow-xs cursor-pointer"
                >
                  Submit CSAT Rating
                </button>
              </div>
            )}

            {/* Activity Stream & Comments */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="font-extrabold text-[#232F3F] dark:text-white text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>Activity & Comments ({ticketComments.length})</span>
              </h3>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="p-4 bg-gray-50 dark:bg-[#121924] rounded-xl border border-gray-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Add Comment</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 dark:text-gray-400 select-none">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="rounded text-[#77BC1F] focus:ring-[#77BC1F] cursor-pointer"
                    />
                    <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                      <Lock className="w-3.5 h-3.5 text-[#FF9900]" />
                      <span>Internal Team Note Only</span>
                    </span>
                  </label>
                </div>

                <textarea
                  rows={2}
                  placeholder={
                    isInternalComment
                      ? 'Private internal note for Marketing Ops & Assignee only...'
                      : 'Type a message to requester or stakeholders...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#77BC1F] text-xs md:text-sm dark:text-white ${
                    isInternalComment
                      ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/30'
                      : 'bg-white dark:bg-[#16202C] border-gray-300 dark:border-white/15'
                  }`}
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white font-bold rounded-lg text-xs md:text-sm shadow-xs cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3">
                {ticketComments.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-3.5 rounded-xl border ${
                      comm.isInternal
                        ? 'bg-[#FF9900]/10 dark:bg-[#FF9900]/15 border-[#FF9900]/30'
                        : 'bg-white dark:bg-[#121924] border-gray-200 dark:border-white/10 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={comm.userName} avatarUrl={comm.userAvatar} size="xs" />
                        <span className="font-bold text-gray-900 dark:text-white text-xs md:text-sm">{comm.userName}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                          {comm.userRole}
                        </span>
                        {comm.isInternal && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FF9900]/25 text-[#995C00] dark:text-[#FF9900] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Internal</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 pl-8.5 whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
                      {comm.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live SLA Clock Widget, Status, Assignee, Priority, Revision Limit */}
          <div className="w-full md:w-96 bg-[#FAFBFC] dark:bg-[#101722] p-6 md:p-7 space-y-6 shrink-0 overflow-y-auto">
            {/* LIVE SLA CLOCK WIDGET */}
            <div className="p-5 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                <span className="font-extrabold text-[#232F3F] dark:text-white text-xs md:text-sm flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-[#77BC1F]" />
                  <span>SLA Timer Clock</span>
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                    clock.status === 'RUNNING'
                      ? 'bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] animate-pulse border border-[#77BC1F]/40'
                      : clock.status === 'PAUSED'
                      ? 'bg-[#FF9900]/20 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/40'
                      : clock.status === 'BREACHED'
                      ? 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/30'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {clock.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-gray-500 dark:text-gray-400">SLA Progress</span>
                  <span className="text-gray-900 dark:text-white">{clock.progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      clock.isBreached
                        ? 'bg-red-600'
                        : clock.progressPercent >= 75
                        ? 'bg-[#FF9900]'
                        : 'bg-[#77BC1F]'
                    }`}
                    style={{ width: `${clock.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Countdown Metric Box */}
              <div
                className={`p-3.5 rounded-xl text-center border font-mono font-black text-sm md:text-base shadow-2xs ${
                  clock.isBreached
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30'
                    : clock.status === 'PAUSED'
                    ? 'bg-[#FF9900]/15 text-[#B26A00] dark:text-[#FF9900] border-[#FF9900]/40'
                    : 'bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border-[#77BC1F]/40'
                }`}
              >
                {clock.countdownText}
              </div>

              <div className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 pt-1 font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Target TAT:</span>
                  <span className="font-bold text-[#232F3F] dark:text-white">
                    {ticket.isRush ? 'Emergency 24 Hours' : 'Standard Business Days'}
                  </span>
                </div>
                {ticket.slaTargetAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 font-bold">Deadline:</span>
                    <span className="font-bold text-[#232F3F] dark:text-white">
                      {new Date(ticket.slaTargetAt).toLocaleDateString()} 17:00
                    </span>
                  </div>
                )}
                {ticket.totalPausedMinutes > 0 && (
                  <div className="flex justify-between text-[#B26A00] dark:text-[#FF9900] font-bold">
                    <span>Total Paused:</span>
                    <span>{ticket.totalPausedMinutes} minutes</span>
                  </div>
                )}
                {clock.escalationLevel > 0 && (
                  <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-300 font-bold text-center mt-2">
                    Escalation Level {clock.escalationLevel} Triggered!
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Status Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs md:text-sm text-gray-700 dark:text-gray-300">Workflow Status</label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as WorkflowStatusKey)}
                className="w-full p-2.5 bg-white dark:bg-[#16202C] border border-gray-300 dark:border-white/15 rounded-xl font-bold text-xs md:text-sm text-[#232F3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77BC1F] cursor-pointer"
              >
                <option value="SUBMITTED">1. Submitted (បានដាក់ស្នើ)</option>
                <option value="BRIEF_CHECK">2. Brief Check (ត្រួតពិនិត្យ Brief)</option>
                <option value="IN_PRODUCTION">3. In Production (កំពុងផលិត)</option>
                <option value="IN_REVIEW">4. In Review (ត្រួតពិនិត្យផ្ទៀងផ្ទាត់)</option>
                <option value="APPROVED_DELIVERED">5. Approved / Delivered (បានអនុម័ត)</option>
                <option value="WAITING_FOR_REQUESTER">⏸ Waiting for Requester (Clock Paused)</option>
                <option value="REJECTED">❌ Rejected (Brief Incomplete)</option>
              </select>
            </div>

            {/* Assignee Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs md:text-sm text-gray-700 dark:text-gray-300">Assignee</label>
              <select
                value={ticket.assigneeId || ''}
                onChange={(e) => {
                  const selUser = MOCK_USERS.find((u) => u.id === e.target.value);
                  if (selUser) {
                    assignTicket(ticket.id, selUser.id, selUser.fullNameEn, selUser.avatarUrl);
                  }
                }}
                className="w-full p-2.5 bg-white dark:bg-[#16202C] border border-gray-300 dark:border-white/15 rounded-xl font-bold text-xs md:text-sm text-[#232F3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77BC1F] cursor-pointer"
              >
                <option value="">-- Unassigned --</option>
                {MOCK_USERS.filter((u) => u.role === 'ASSIGNEE' || u.role === 'MARKETING_OPS').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullNameEn} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs md:text-sm text-gray-700 dark:text-gray-300">Priority Tier</label>
              <div className="p-2.5 bg-white dark:bg-[#16202C] border border-gray-300 dark:border-white/15 rounded-xl flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#232F3F] dark:text-white">{ticket.priority}</span>
                <PriorityIcon priority={ticket.priority} showLabel size="md" />
              </div>
            </div>

            {/* Revision Round Counter (Rule 5: Max 2 rounds) */}
            <div className="p-4 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 text-xs md:text-sm">
                  <RefreshCw className="w-4 h-4 text-[#77BC1F]" />
                  <span>Revision Rounds</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                    ticket.revisionCount > ticket.maxRevisionRounds
                      ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300'
                      : 'bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F]'
                  }`}
                >
                  Round {ticket.revisionCount} / {ticket.maxRevisionRounds}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {ticket.revisionCount >= ticket.maxRevisionRounds
                  ? '⚠️ Exceeded maximum 2 revision rounds. Formal Change Request applied (+3 business days).'
                  : 'Max 2 revision rounds allowed under standard SLA.'}
              </p>
            </div>

            {/* Requester Profile Snapshot */}
            <div className="p-4 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 space-y-1.5 text-xs shadow-2xs">
              <span className="font-bold text-[#232F3F] dark:text-white block mb-1 text-xs md:text-sm">Requester Profile</span>
              <div className="text-gray-900 dark:text-white font-bold text-xs md:text-sm">{ticket.requesterName}</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">{ticket.requesterEmail}</div>
              <div className="text-[#558D14] dark:text-[#77BC1F] font-bold mt-1">{ticket.requesterDepartmentName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
