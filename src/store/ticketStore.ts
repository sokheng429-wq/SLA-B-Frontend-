import { create } from 'zustand';
import { Ticket, WorkflowStatusKey, Priority, TicketComment, TicketAttachment } from '../types';
import { INITIAL_TICKETS } from '../data/initialTickets';
import { calculateSlaTarget } from '../utils/slaEngine';
import { useDepartmentStore } from './departmentStore';

interface CreateTicketInput {
  departmentId: string;
  serviceCatalogId: string;
  title: string;
  priority: Priority;
  isRush: boolean;
  rushGmApproved?: boolean;
  briefData: Record<string, any>;
  attachments?: File[];
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartmentId: string;
  requesterDepartmentName: string;
  parentTicketId?: string;
  isChangeRequest?: boolean;
}

interface TicketFilterState {
  searchQuery: string;
  assigneeFilter: string;
  priorityFilter: string;
  statusFilter: string;
  rushOnly: boolean;
}

interface TicketState {
  tickets: Ticket[];
  selectedTicketId: string | null;
  comments: Record<string, TicketComment[]>; // ticketId -> comments
  filters: TicketFilterState;
  
  // Actions
  setSelectedTicketId: (id: string | null) => void;
  setFilters: (newFilters: Partial<TicketFilterState>) => void;
  createTicket: (input: CreateTicketInput) => Ticket;
  updateTicketStatus: (
    ticketId: string, 
    newStatus: WorkflowStatusKey, 
    actor: { id: string; name: string; role: string },
    commentOrReason?: string
  ) => boolean;
  assignTicket: (ticketId: string, assigneeId: string, assigneeName: string, assigneeAvatar?: string) => void;
  addComment: (ticketId: string, author: { id: string; name: string; role: any; avatar?: string }, message: string, isInternal: boolean) => void;
  addAttachment: (ticketId: string, attachment: TicketAttachment) => void;
  submitCsat: (ticketId: string, score: number, feedback?: string) => void;
  getDepartmentRushUsageThisMonth: (requestingDeptId: string) => { used: number; quota: number; requiresGm: boolean };
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: INITIAL_TICKETS,
  selectedTicketId: null,
  comments: {
    't-01': [
      {
        id: 'c-1',
        ticketId: 't-01',
        userId: 'user-ops',
        userName: 'Sarah Chen (Marketing Ops)',
        userRole: 'MARKETING_OPS',
        message: 'Rejected: Brief lacks approved promotional pricing dates and packaging packshot. Please resubmit via formal ticket with files attached.',
        isInternal: false,
        createdAt: '2026-10-02T11:00:00+07:00'
      }
    ],
    't-03': [
      {
        id: 'c-2',
        ticketId: 't-03',
        userId: 'user-assignee-1',
        userName: 'Ramean Oeun',
        userRole: 'ASSIGNEE',
        message: 'Paused clock: Please provide the high-resolution Japanese Wagyu logo packshot from the importer before we can finalize the visual layout.',
        isInternal: false,
        createdAt: '2026-10-04T09:30:00+07:00'
      }
    ],
    't-07': [
      {
        id: 'c-3',
        ticketId: 't-07',
        userId: 'user-assignee-1',
        userName: 'Ramean Oeun',
        userRole: 'ASSIGNEE',
        message: 'Draft proof uploaded for all 12 pages. Please review within 24 hours (promotional pricing proof rule) to avoid automatic delivery sign-off.',
        isInternal: false,
        createdAt: '2026-10-04T16:00:00+07:00'
      }
    ]
  },
  filters: {
    searchQuery: '',
    assigneeFilter: 'ALL',
    priorityFilter: 'ALL',
    statusFilter: 'ALL',
    rushOnly: false,
  },

  setSelectedTicketId: (id) => set({ selectedTicketId: id }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  getDepartmentRushUsageThisMonth: (requestingDeptId: string) => {
    const currentMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-10"
    const count = get().tickets.filter(t => 
      t.requesterDepartmentId === requestingDeptId && 
      t.isRush &&
      t.submittedAt.startsWith(currentMonth)
    ).length;

    const quota = 3; // Rule 7: 3 per month
    return {
      used: count,
      quota,
      requiresGm: count >= quota
    };
  },

  createTicket: (input: CreateTicketInput) => {
    const deptStore = useDepartmentStore.getState();
    const dept = deptStore.departments.find(d => d.id === input.departmentId) || deptStore.departments[0];
    const service = deptStore.services.find(s => s.id === input.serviceCatalogId) || deptStore.services[0];
    const holidayDates = deptStore.holidays.map(h => h.holidayDate);

    // Compute Next Ticket Sequence
    const nextSeq = (dept.ticketSeqCurrent || 42) + 1;
    deptStore.updateDepartment({ ...dept, ticketSeqCurrent: nextSeq });

    const ticketNumber = `BGS-${dept.code}-${String(nextSeq).padStart(4, '0')}`;
    const now = new Date();

    // Check rush quota
    const rushStatus = get().getDepartmentRushUsageThisMonth(input.requesterDepartmentId);
    const requiresGm = input.isRush && rushStatus.requiresGm;

    // SLA Target Calculation (Rule 2: 3:00 PM cutoff, Rule 3: Business days)
    const { targetDeadline } = calculateSlaTarget(
      now,
      service.standardTatDays,
      input.isRush,
      service.rushTatHours,
      dept.dailyCutoffTime,
      dept.workDays,
      holidayDates,
      input.isChangeRequest
    );

    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticketNumber,
      departmentId: dept.id,
      serviceCatalogId: service.id,
      serviceCode: service.code,
      serviceNameEn: service.nameEn,
      serviceNameKh: service.nameKh,
      categoryEn: service.categoryEn,
      categoryKh: service.categoryKh,
      requesterId: input.requesterId,
      requesterName: input.requesterName,
      requesterEmail: input.requesterEmail,
      requesterDepartmentId: input.requesterDepartmentId,
      requesterDepartmentName: input.requesterDepartmentName,
      status: 'SUBMITTED',
      priority: input.priority,
      isRush: input.isRush,
      rushGmApproved: Boolean(input.rushGmApproved || !requiresGm),
      title: input.title,
      briefData: input.briefData,
      attachments: [],
      parentTicketId: input.parentTicketId,
      isChangeRequest: Boolean(input.isChangeRequest),
      revisionCount: 0,
      maxRevisionRounds: dept.maxRevisionRounds || 2,
      submittedAt: now.toISOString(),
      slaTargetAt: targetDeadline.toISOString(),
      isPaused: false,
      totalPausedMinutes: 0,
      escalationLevel: 0,
      commentsCount: 0,
      tags: [dept.code, service.code]
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets]
    }));

    return newTicket;
  },

  updateTicketStatus: (ticketId, newStatus, actor, commentOrReason) => {
    const ticket = get().tickets.find(t => t.id === ticketId);
    if (!ticket) return false;

    const deptStore = useDepartmentStore.getState();
    const dept = deptStore.departments.find(d => d.id === ticket.departmentId) || deptStore.departments[0];
    const service = deptStore.services.find(s => s.id === ticket.serviceCatalogId) || deptStore.services[0];
    const holidayDates = deptStore.holidays.map(h => h.holidayDate);

    const now = new Date();
    const updated: Partial<Ticket> = { status: newStatus };

    // RULE 1: No Brief = No Start
    if (newStatus === 'IN_PRODUCTION' && ticket.status === 'BRIEF_CHECK') {
      // Validate mandatory brief fields
      const mandatoryFields = service.briefSchema.filter(f => f.required);
      const isBriefValid = mandatoryFields.every(f => {
        const val = ticket.briefData[f.id];
        return val !== undefined && val !== null && String(val).trim() !== '';
      });

      if (!isBriefValid) {
        alert("Rule 1 Enforced: 'No Brief = No Start'. Mandatory brief specifications are incomplete!");
        return false;
      }

      // Start SLA clock
      updated.briefCheckedAt = now.toISOString();
      updated.slaStartAt = now.toISOString();

      const { targetDeadline } = calculateSlaTarget(
        now,
        service.standardTatDays,
        ticket.isRush,
        service.rushTatHours,
        dept.dailyCutoffTime,
        dept.workDays,
        holidayDates,
        ticket.isChangeRequest
      );
      updated.slaTargetAt = targetDeadline.toISOString();
      if (!ticket.firstResponseAt) {
        updated.firstResponseAt = now.toISOString();
      }
    }

    // RULE: Rejection of Brief
    if (newStatus === 'REJECTED') {
      if (!commentOrReason) {
        alert('A rejection reason is required to notify the requester.');
        return false;
      }
      // Log rejection comment
      get().addComment(ticketId, actor as any, `Brief Rejected: ${commentOrReason}`, false);
    }

    // RULE: Transition to IN_REVIEW
    if (newStatus === 'IN_REVIEW') {
      updated.reviewStartedAt = now.toISOString();
      // RULE 6: Auto-Approve (24h for promotional pricing proofs, 48h for general creative)
      const isPromoProof = ticket.serviceCode === 'MKT-DES-03' || ticket.serviceCode === 'MKT-DES-04';
      const autoApproveHours = isPromoProof ? (dept.autoApprovePromoHours || 24) : (dept.autoApproveHours || 48);
      const autoApproveTarget = new Date(now.getTime() + autoApproveHours * 60 * 60 * 1000);
      updated.autoApproveTargetAt = autoApproveTarget.toISOString();
    }

    // RULE 5: Revision Request (In Review -> In Production)
    if (ticket.status === 'IN_REVIEW' && newStatus === 'IN_PRODUCTION') {
      const newRevCount = ticket.revisionCount + 1;
      updated.revisionCount = newRevCount;

      if (newRevCount > ticket.maxRevisionRounds) {
        // Exceeded max 2 rounds! Triggers formal Change Request (+3 business days)
        updated.isChangeRequest = true;
        if (ticket.slaTargetAt) {
          const currentTarget = new Date(ticket.slaTargetAt);
          const extendedTarget = new Date(currentTarget.getTime() + 3 * 24 * 60 * 60 * 1000);
          updated.slaTargetAt = extendedTarget.toISOString();
        }
        alert(`Rule 5 Enforced: Revision cap of 2 rounds exceeded (Round ${newRevCount}). A formal Change Request has been generated, adding +3 business days to TAT!`);
      }
    }

    // RULE 8: SLA Clock Pause (Waiting for Requester)
    if (newStatus === 'WAITING_FOR_REQUESTER') {
      updated.isPaused = true;
      updated.currentPauseStartedAt = now.toISOString();
    } else if (ticket.isPaused) {
      // Resumed
      let addedPauseMinutes = 0;
      if (ticket.currentPauseStartedAt) {
        addedPauseMinutes = Math.max(0, Math.round((now.getTime() - new Date(ticket.currentPauseStartedAt).getTime()) / 60000));
      }
      updated.isPaused = false;
      updated.currentPauseStartedAt = undefined;
      updated.totalPausedMinutes = (ticket.totalPausedMinutes || 0) + addedPauseMinutes;

      // Extend target deadline by paused minutes
      if (ticket.slaTargetAt && addedPauseMinutes > 0) {
        const curTarget = new Date(ticket.slaTargetAt);
        const extended = new Date(curTarget.getTime() + addedPauseMinutes * 60000);
        updated.slaTargetAt = extended.toISOString();
      }
    }

    // Completed
    if (newStatus === 'APPROVED_DELIVERED') {
      updated.completedAt = now.toISOString();
      updated.isPaused = false;
    }

    if (commentOrReason && newStatus !== 'REJECTED') {
      get().addComment(ticketId, actor as any, commentOrReason, false);
    }

    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, ...updated } : t)
    }));

    return true;
  },

  assignTicket: (ticketId, assigneeId, assigneeName, assigneeAvatar) => {
    set((state) => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId 
          ? { ...t, assigneeId, assigneeName, assigneeAvatar }
          : t
      )
    }));
  },

  addComment: (ticketId, author, message, isInternal) => {
    const newComment: TicketComment = {
      id: `comm-${Date.now()}`,
      ticketId,
      userId: author.id,
      userName: author.name,
      userAvatar: author.avatar,
      userRole: author.role,
      message,
      isInternal,
      createdAt: new Date().toISOString()
    };

    set((state) => {
      const currentComments = state.comments[ticketId] || [];
      return {
        comments: {
          ...state.comments,
          [ticketId]: [...currentComments, newComment]
        },
        tickets: state.tickets.map(t => 
          t.id === ticketId 
            ? { ...t, commentsCount: (t.commentsCount || 0) + 1 }
            : t
        )
      };
    });
  },

  addAttachment: (ticketId, attachment) => {
    set((state) => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId 
          ? { ...t, attachments: [...t.attachments, attachment] }
          : t
      )
    }));
  },

  submitCsat: (ticketId, score, feedback) => {
    set((state) => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId 
          ? { 
              ...t, 
              csatScore: score, 
              csatComment: feedback, 
              csatSubmittedAt: new Date().toISOString() 
            }
          : t
      )
    }));
  }
}));
