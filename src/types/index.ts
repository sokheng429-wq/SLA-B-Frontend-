export type Role = 'ADMIN' | 'MARKETING_OPS' | 'REQUESTER' | 'ASSIGNEE' | 'MANAGER' | 'EXECUTIVE';

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  fullNameEn: string;
  fullNameKh: string;
  role: Role;
  departmentId: string;
  departmentName: string;
  avatarUrl?: string;
  sessionTimeout?: string;
  mustChangePassword?: boolean;
  active?: boolean;
}

export interface Department {
  id: string;
  code: string; // MKT, IT, PUR, FIN, HR, OPS
  nameEn: string;
  nameKh: string;
  descriptionEn: string;
  descriptionKh: string;
  icon: string;
  leadUserId?: string;
  operatingHoursStart: string; // e.g. "08:00:00"
  operatingHoursEnd: string;   // e.g. "17:00:00"
  dailyCutoffTime: string;     // e.g. "15:00:00"
  workDays: string;            // e.g. "MON,TUE,WED,THU,FRI,SAT"
  monthlyRushQuota: number;    // 3
  autoApproveHours: number;    // 48
  autoApprovePromoHours: number; // 24
  maxRevisionRounds: number;   // 2
  changeRequestTatDays: number; // 3
  ticketSeqCurrent: number;
  isActive: boolean;
}

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface BriefFieldSchema {
  id: string;
  labelEn: string;
  labelKh: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'file';
  required: boolean;
  options?: string[];
  placeholderEn?: string;
  placeholderKh?: string;
}

export interface ServiceCatalogItem {
  id: string;
  departmentId: string;
  code: string; // MKT-DES-01
  nameEn: string;
  nameKh: string;
  categoryEn: string;
  categoryKh: string;
  standardTatDays: number;
  standardTatHours?: number;
  rushTatHours: number;
  reviewSlaHours: number;
  deliverableSpecsEn: string;
  deliverableSpecsKh: string;
  defaultPriority: Priority;
  briefRequirementsEn: string;
  briefRequirementsKh: string;
  briefSchema: BriefFieldSchema[];
  responsibleLeadTitleEn: string;
  responsibleLeadTitleKh: string;
  sortOrder: number;
  isActive: boolean;
}

export type WorkflowStatusKey = 
  | 'SUBMITTED' 
  | 'BRIEF_CHECK' 
  | 'IN_PRODUCTION' 
  | 'IN_REVIEW' 
  | 'APPROVED_DELIVERED' 
  | 'WAITING_FOR_REQUESTER' 
  | 'REJECTED';

export interface WorkflowStatus {
  key: WorkflowStatusKey;
  nameEn: string;
  nameKh: string;
  stepOrder: number;
  isTimerRunning: boolean;
  isReviewStage: boolean;
  isTerminal: boolean;
  badgeColor: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  versionRound: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: Role;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketSlaLog {
  id: string;
  ticketId: string;
  action: 'SUBMITTED' | 'BRIEF_CHECKED' | 'BRIEF_REJECTED' | 'SLA_STARTED' | 'PAUSED' | 'RESUMED' | 'REVISION_REQUESTED' | 'AUTO_APPROVED' | 'ESCALATED' | 'COMPLETED' | 'COMMENT';
  fromStatus?: WorkflowStatusKey;
  toStatus?: WorkflowStatusKey;
  actorId: string;
  actorName: string;
  actorRole: string;
  pausedMinutes?: number;
  reason?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // BGS-MKT-0001
  departmentId: string;
  serviceCatalogId: string;
  serviceCode: string;
  serviceNameEn: string;
  serviceNameKh: string;
  categoryEn: string;
  categoryKh: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartmentId: string;
  requesterDepartmentName: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  assigneeTitle?: string;
  status: WorkflowStatusKey;
  priority: Priority;
  isRush: boolean;
  rushGmApproved: boolean;
  title: string;
  briefData: Record<string, any>;
  attachments: TicketAttachment[];
  parentTicketId?: string;
  isChangeRequest: boolean;
  revisionCount: number; // 0, 1, 2...
  maxRevisionRounds: number; // default 2
  
  // Timestamps
  submittedAt: string;
  briefCheckedAt?: string;
  slaStartAt?: string;
  slaTargetAt?: string;
  firstResponseAt?: string;
  reviewStartedAt?: string;
  autoApproveTargetAt?: string;
  completedAt?: string;
  
  // Pause & Escalation
  isPaused: boolean;
  currentPauseStartedAt?: string;
  totalPausedMinutes: number;
  escalationLevel: number; // 0, 1, 2, 3, 4
  
  // Final Asset & CSAT
  finalAssetUrl?: string;
  csatScore?: number; // 1-5
  csatComment?: string;
  csatSubmittedAt?: string;

  commentsCount: number;
  tags?: string[];
}

export interface SlaPolicy {
  id: string;
  departmentId: string;
  priorityTier: Priority;
  nameEn: string;
  nameKh: string;
  initialResponseMinutes: number;
  tatHours?: number;
  tatBusinessDays: number;
  approverRole: string;
  alertDelayThresholdHours: number;
  alertRecipientRole: string;
}

export interface EscalationRule {
  level: number; // 1, 2, 3, 4
  nameEn: string;
  nameKh: string;
  triggerDelayHours: number;
  targetRole: string;
  resolutionSlaHours: number;
  actionRequiredEn: string;
  actionRequiredKh: string;
}

export interface Holiday {
  id: string;
  holidayDate: string; // YYYY-MM-DD
  nameEn: string;
  nameKh: string;
  isRecurring: boolean;
}

export interface InAppNotification {
  id: string;
  userId: string;
  ticketId?: string;
  ticketNumber?: string;
  titleEn: string;
  titleKh: string;
  messageEn: string;
  messageKh: string;
  type: 'SLA_WARNING' | 'ESCALATION' | 'ASSIGNED' | 'BRIEF_REJECTED' | 'AUTO_APPROVED' | 'COMMENT';
  isRead: boolean;
  createdAt: string;
}

export interface RaciActivity {
  id: number;
  categoryEn: string;
  categoryKh: string;
  activityNameEn: string;
  activityNameKh: string;
  roles: {
    ceo: 'R' | 'A' | 'C' | 'I';
    opsManager: 'R' | 'A' | 'C' | 'I';
    storeManager: 'R' | 'A' | 'C' | 'I';
    financeSupervisor: 'R' | 'A' | 'C' | 'I';
    purchasingOfficer: 'R' | 'A' | 'C' | 'I';
    graphicDesigner: 'R' | 'A' | 'C' | 'I';
    webDeveloper: 'R' | 'A' | 'C' | 'I';
    digitalMarketingOfficer: 'R' | 'A' | 'C' | 'I';
  };
}
