import { Ticket, Holiday } from '../types';

export const CAMBODIA_TIMEZONE = 'Asia/Phnom_Penh';

// Pre-seeded Cambodian holidays for 2026/2027
export const DEFAULT_CAMBODIAN_HOLIDAYS: Holiday[] = [
  { id: 'h1', holidayDate: '2026-01-01', nameEn: 'International New Year Day', nameKh: 'ទិវាចូលឆ្នាំសកល', isRecurring: true },
  { id: 'h2', holidayDate: '2026-01-07', nameEn: 'Victory over Genocide Day', nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍', isRecurring: true },
  { id: 'h3', holidayDate: '2026-03-08', nameEn: 'International Women Day', nameKh: 'ទិវាអន្តរជាតិនារី', isRecurring: true },
  { id: 'h4', holidayDate: '2026-04-14', nameEn: 'Khmer New Year Day 1', nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ ថ្ងៃទី១', isRecurring: false },
  { id: 'h5', holidayDate: '2026-04-15', nameEn: 'Khmer New Year Day 2', nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ ថ្ងៃទី២', isRecurring: false },
  { id: 'h6', holidayDate: '2026-04-16', nameEn: 'Khmer New Year Day 3', nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ ថ្ងៃទី៣', isRecurring: false },
  { id: 'h7', holidayDate: '2026-05-01', nameEn: 'International Labor Day', nameKh: 'ទិវាពលកម្មអន្តរជាតិ', isRecurring: true },
  { id: 'h8', holidayDate: '2026-05-14', nameEn: 'King Sihamoni Birthday', nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ', isRecurring: true },
  { id: 'h9', holidayDate: '2026-09-24', nameEn: 'Constitutional Day', nameKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ', isRecurring: true },
  { id: 'h10', holidayDate: '2026-10-10', nameEn: 'Pchum Ben Day 1', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី១', isRecurring: false },
  { id: 'h11', holidayDate: '2026-10-11', nameEn: 'Pchum Ben Day 2', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី២', isRecurring: false },
  { id: 'h12', holidayDate: '2026-10-12', nameEn: 'Pchum Ben Day 3', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី៣', isRecurring: false },
  { id: 'h13', holidayDate: '2026-10-29', nameEn: 'King Coronation Day', nameKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ', isRecurring: true },
  { id: 'h14', holidayDate: '2026-11-09', nameEn: 'National Independence Day', nameKh: 'ទិវាបុណ្យឯករាជ្យជាតិ', isRecurring: true },
  { id: 'h15', holidayDate: '2026-11-23', nameEn: 'Water Festival Day 1', nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក ថ្ងៃទី១', isRecurring: false },
  { id: 'h16', holidayDate: '2026-11-24', nameEn: 'Water Festival Day 2', nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក ថ្ងៃទី២', isRecurring: false },
  { id: 'h17', holidayDate: '2026-11-25', nameEn: 'Water Festival Day 3', nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក ថ្ងៃទី៣', isRecurring: false },
];

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks whether a given Date is a working day for the department
 */
export function isWorkingDay(date: Date, workDaysStr = 'MON,TUE,WED,THU,FRI,SAT', holidayDates: string[] = []): boolean {
  const daysMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = daysMap[date.getDay()];
  
  const allowedDays = workDaysStr.split(',').map(s => s.trim().toUpperCase());
  if (!allowedDays.includes(dayName)) {
    return false;
  }
  
  const ymd = formatDateYmd(date);
  if (holidayDates.includes(ymd)) {
    return false;
  }
  
  return true;
}

/**
 * Checks if a given timestamp is after the 3:00 PM cut-off
 */
export function isAfterCutoff(time: Date, cutoffTimeStr = '15:00:00'): boolean {
  const [cutoffHours, cutoffMinutes] = cutoffTimeStr.split(':').map(Number);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  
  return hours > cutoffHours || (hours === cutoffHours && minutes >= cutoffMinutes);
}

/**
 * Advance a date to the next valid working business day at 08:00 AM
 */
export function getNextBusinessDayStart(date: Date, workDaysStr: string, holidayDates: string[]): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  next.setHours(8, 0, 0, 0);
  
  while (!isWorkingDay(next, workDaysStr, holidayDates)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

/**
 * Add N business days according to the department's working schedule and holidays
 */
export function addBusinessDays(startDate: Date, days: number, workDaysStr: string, holidayDates: string[]): Date {
  const current = new Date(startDate);
  let added = 0;
  
  while (added < days) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current, workDaysStr, holidayDates)) {
      added++;
    }
  }
  return current;
}

/**
 * Calculate the SLA target deadline based on:
 * - 3:00 PM cut-off
 * - Rush TAT (hours) vs Standard TAT (business days)
 * - Revision round change requests (+3 business days)
 */
export function calculateSlaTarget(
  submittedDate: Date,
  standardTatDays: number,
  isRush: boolean,
  rushTatHours: number,
  cutoffTimeStr = '15:00:00',
  workDaysStr = 'MON,TUE,WED,THU,FRI,SAT',
  holidayDates: string[] = [],
  isChangeRequest = false
): { effectiveStart: Date; targetDeadline: Date; cutoffApplied: boolean } {
  let effectiveStart = new Date(submittedDate);
  let cutoffApplied = false;

  // Rule 2: Submissions after 3:00 PM count from the next business day at 08:00 AM
  if (isAfterCutoff(submittedDate, cutoffTimeStr)) {
    effectiveStart = getNextBusinessDayStart(submittedDate, workDaysStr, holidayDates);
    cutoffApplied = true;
  } else if (!isWorkingDay(submittedDate, workDaysStr, holidayDates)) {
    effectiveStart = getNextBusinessDayStart(submittedDate, workDaysStr, holidayDates);
  }

  let targetDeadline: Date;

  if (isRush) {
    // Rush TAT in hours
    targetDeadline = new Date(effectiveStart.getTime() + rushTatHours * 60 * 60 * 1000);
  } else {
    let tatDays = standardTatDays;
    // Rule 5: Change Request adds +3 business days
    if (isChangeRequest) {
      tatDays += 3;
    }
    targetDeadline = addBusinessDays(effectiveStart, tatDays, workDaysStr, holidayDates);
    targetDeadline.setHours(17, 0, 0, 0); // End of business day
  }

  return { effectiveStart, targetDeadline, cutoffApplied };
}

export interface SlaClockState {
  status: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'BREACHED';
  totalMinutes: number;
  remainingMinutes: number;
  elapsedMinutes: number;
  progressPercent: number;
  color: 'green' | 'amber' | 'red' | 'gray';
  countdownText: string;
  isBreached: boolean;
  escalationLevel: number; // 0, 1, 2, 3, 4
}

/**
 * Compute the live SLA clock state for a ticket
 */
export function getLiveSlaClock(ticket: Ticket, _holidayDates: string[] = []): SlaClockState {
  // Terminal states
  if (ticket.status === 'APPROVED_DELIVERED') {
    return {
      status: 'COMPLETED',
      totalMinutes: 0,
      remainingMinutes: 0,
      elapsedMinutes: 0,
      progressPercent: 100,
      color: 'gray',
      countdownText: 'Delivered',
      isBreached: false,
      escalationLevel: 0
    };
  }

  if (ticket.status === 'REJECTED') {
    return {
      status: 'NOT_STARTED',
      totalMinutes: 0,
      remainingMinutes: 0,
      elapsedMinutes: 0,
      progressPercent: 0,
      color: 'gray',
      countdownText: 'Brief Rejected',
      isBreached: false,
      escalationLevel: 0
    };
  }

  // Not started yet (Submitted or Brief Check before approval)
  if (ticket.status === 'SUBMITTED' || ticket.status === 'BRIEF_CHECK' || !ticket.slaStartAt || !ticket.slaTargetAt) {
    return {
      status: 'NOT_STARTED',
      totalMinutes: 0,
      remainingMinutes: 0,
      elapsedMinutes: 0,
      progressPercent: 0,
      color: 'gray',
      countdownText: 'Pending Brief',
      isBreached: false,
      escalationLevel: 0
    };
  }

  const now = new Date();
  const startTime = new Date(ticket.slaStartAt);
  const targetTime = new Date(ticket.slaTargetAt);

  const totalDurationMs = Math.max(1, targetTime.getTime() - startTime.getTime());
  const pausedOffsetMs = (ticket.totalPausedMinutes || 0) * 60 * 1000;

  // If paused
  if (ticket.isPaused || ticket.status === 'WAITING_FOR_REQUESTER') {
    const pauseStart = ticket.currentPauseStartedAt ? new Date(ticket.currentPauseStartedAt).getTime() : now.getTime();
    const elapsedBeforePause = Math.max(0, pauseStart - startTime.getTime() - pausedOffsetMs);
    const remainingMs = Math.max(0, totalDurationMs - elapsedBeforePause);
    const progress = Math.min(100, Math.round((elapsedBeforePause / totalDurationMs) * 100));

    return {
      status: 'PAUSED',
      totalMinutes: Math.round(totalDurationMs / 60000),
      remainingMinutes: Math.round(remainingMs / 60000),
      elapsedMinutes: Math.round(elapsedBeforePause / 60000),
      progressPercent: progress,
      color: 'amber',
      countdownText: 'Paused (Waiting)',
      isBreached: false,
      escalationLevel: ticket.escalationLevel || 0
    };
  }

  // Live running
  const elapsedMs = Math.max(0, now.getTime() - startTime.getTime() - pausedOffsetMs);
  const remainingMs = totalDurationMs - elapsedMs;
  const remainingMinutes = Math.round(remainingMs / 60000);
  const elapsedMinutes = Math.round(elapsedMs / 60000);
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));

  const isBreached = remainingMs <= 0;

  // Determine Escalation Level based on hours overdue
  let escalationLevel = 0;
  if (isBreached) {
    const overdueHours = Math.abs(remainingMinutes) / 60;
    if (overdueHours >= 72 || ticket.priority === 'P1') escalationLevel = 4;
    else if (overdueHours >= 48) escalationLevel = 3;
    else if (overdueHours >= 24) escalationLevel = 2;
    else escalationLevel = 1;
  }

  let color: 'green' | 'amber' | 'red' = 'green';
  if (isBreached) {
    color = 'red';
  } else if (progressPercent >= 75) {
    color = 'amber';
  }

  // Format text
  let countdownText = '';
  if (isBreached) {
    const overdueMinutes = Math.abs(remainingMinutes);
    const hrs = Math.floor(overdueMinutes / 60);
    const mins = overdueMinutes % 60;
    countdownText = hrs > 0 ? `Breached: +${hrs}h ${mins}m` : `Breached: +${mins}m`;
  } else {
    const hrs = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    const days = Math.floor(hrs / 8); // business days approximation
    if (days >= 1) {
      const remHrs = hrs % 8;
      countdownText = `${days}d ${remHrs}h left`;
    } else if (hrs > 0) {
      countdownText = `${hrs}h ${mins}m left`;
    } else {
      countdownText = `${mins}m left`;
    }
  }

  return {
    status: isBreached ? 'BREACHED' : 'RUNNING',
    totalMinutes: Math.round(totalDurationMs / 60000),
    remainingMinutes,
    elapsedMinutes,
    progressPercent,
    color,
    countdownText,
    isBreached,
    escalationLevel
  };
}
