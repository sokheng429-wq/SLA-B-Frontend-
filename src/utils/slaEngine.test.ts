import { describe, it, expect } from 'vitest';
import {
  isAfterCutoff,
  isWorkingDay,
  calculateSlaTarget,
  getLiveSlaClock,
  DEFAULT_CAMBODIAN_HOLIDAYS,
} from './slaEngine';
import { Ticket } from '../types';

describe('SLA Business Logic Engine', () => {
  const holidayDates = DEFAULT_CAMBODIAN_HOLIDAYS.map(h => h.holidayDate);

  describe('Rule 2: Daily 3:00 PM Cut-Off Check', () => {
    it('should identify times before 15:00:00 as before cut-off', () => {
      const morningTime = new Date('2026-10-05T14:59:00');
      expect(isAfterCutoff(morningTime, '15:00:00')).toBe(false);
    });

    it('should identify 15:00:00 and later as after cut-off', () => {
      const onCutoff = new Date('2026-10-05T15:00:00');
      const eveningTime = new Date('2026-10-05T16:30:00');

      expect(isAfterCutoff(onCutoff, '15:00:00')).toBe(true);
      expect(isAfterCutoff(eveningTime, '15:00:00')).toBe(true);
    });
  });

  describe('Rule 3: Working Days & Holiday Calendar', () => {
    it('should identify Sunday as non-working day under MON-SAT schedule', () => {
      // 2026-10-04 is a Sunday
      const sunday = new Date('2026-10-04T10:00:00');
      expect(isWorkingDay(sunday, 'MON,TUE,WED,THU,FRI,SAT', holidayDates)).toBe(false);
    });

    it('should identify Monday through Saturday as working days', () => {
      // 2026-10-05 is a Monday
      const monday = new Date('2026-10-05T10:00:00');
      expect(isWorkingDay(monday, 'MON,TUE,WED,THU,FRI,SAT', holidayDates)).toBe(true);

      // 2026-10-10 is a Saturday (but check if it is Pchum Ben holiday)
      // 2026-10-17 is a standard Saturday
      const saturday = new Date('2026-10-17T10:00:00');
      expect(isWorkingDay(saturday, 'MON,TUE,WED,THU,FRI,SAT', holidayDates)).toBe(true);
    });

    it('should exclude official Cambodian public holidays', () => {
      // 2026-01-01 is New Year Day (in holiday calendar)
      const holiday = new Date('2026-01-01T10:00:00');
      expect(isWorkingDay(holiday, 'MON,TUE,WED,THU,FRI,SAT', holidayDates)).toBe(false);
    });
  });

  describe('Turnaround Time (TAT) Calculation & 3PM Cut-Off Advancement', () => {
    it('should start next business day at 08:00 AM if submitted after 3:00 PM', () => {
      // Monday 2026-10-05 at 15:30 (after 3PM)
      const lateSubmission = new Date('2026-10-05T15:30:00');
      const result = calculateSlaTarget(
        lateSubmission,
        2, // 2 business days standard
        false,
        24,
        '15:00:00',
        'MON,TUE,WED,THU,FRI,SAT',
        holidayDates
      );

      expect(result.cutoffApplied).toBe(true);
      // Effective start should be Tuesday 2026-10-06 at 08:00 AM
      expect(result.effectiveStart.getDate()).toBe(6);
      expect(result.effectiveStart.getHours()).toBe(8);
    });

    it('should add +3 business days when Change Request flag is set (Rule 5)', () => {
      const morningSubmission = new Date('2026-10-05T09:00:00');
      const normalResult = calculateSlaTarget(
        morningSubmission,
        2, // standard 2 days
        false,
        24,
        '15:00:00',
        'MON,TUE,WED,THU,FRI,SAT',
        holidayDates,
        false
      );

      const changeRequestResult = calculateSlaTarget(
        morningSubmission,
        2, // standard 2 days + 3 days CR = 5 business days
        false,
        24,
        '15:00:00',
        'MON,TUE,WED,THU,FRI,SAT',
        holidayDates,
        true
      );

      const diffMs = changeRequestResult.targetDeadline.getTime() - normalResult.targetDeadline.getTime();
      const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
      expect(diffDays).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Rule 8: SLA Clock States & Pause / Resume Behavior', () => {
    const baseTicket: Ticket = {
      id: 'test-1',
      ticketNumber: 'BGS-MKT-9999',
      departmentId: 'dept-mkt',
      serviceCatalogId: 'srv-01',
      serviceCode: 'MKT-DES-01',
      serviceNameEn: 'Static Graphic',
      serviceNameKh: 'រូបភាពទោល',
      categoryEn: 'Creative',
      categoryKh: 'រចនា',
      requesterId: 'u-1',
      requesterName: 'Tester',
      requesterEmail: 'test@bgroceries.com',
      requesterDepartmentId: 'dept-ops',
      requesterDepartmentName: 'Store Ops',
      status: 'IN_PRODUCTION',
      priority: 'P3',
      isRush: false,
      rushGmApproved: false,
      title: 'Test Ticket',
      briefData: {},
      attachments: [],
      isChangeRequest: false,
      revisionCount: 0,
      maxRevisionRounds: 2,
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      slaStartAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      slaTargetAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
      isPaused: false,
      totalPausedMinutes: 0,
      escalationLevel: 0,
      commentsCount: 0,
    };

    it('should return RUNNING status and Green/Amber countdown when active', () => {
      const clock = getLiveSlaClock(baseTicket, holidayDates);
      expect(clock.status).toBe('RUNNING');
      expect(clock.isBreached).toBe(false);
      expect(clock.remainingMinutes).toBeGreaterThan(0);
    });

    it('should return PAUSED status when status is WAITING_FOR_REQUESTER', () => {
      const pausedTicket: Ticket = {
        ...baseTicket,
        status: 'WAITING_FOR_REQUESTER',
        isPaused: true,
        currentPauseStartedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      };

      const clock = getLiveSlaClock(pausedTicket, holidayDates);
      expect(clock.status).toBe('PAUSED');
      expect(clock.countdownText).toContain('Paused');
    });

    it('should return BREACHED status and escalation level when deadline is passed', () => {
      const breachedTicket: Ticket = {
        ...baseTicket,
        // Target was 25 hours ago
        slaTargetAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      };

      const clock = getLiveSlaClock(breachedTicket, holidayDates);
      expect(clock.status).toBe('BREACHED');
      expect(clock.isBreached).toBe(true);
      expect(clock.escalationLevel).toBeGreaterThanOrEqual(1);
    });

    it('should return COMPLETED status when ticket is APPROVED_DELIVERED', () => {
      const deliveredTicket: Ticket = {
        ...baseTicket,
        status: 'APPROVED_DELIVERED',
        completedAt: new Date().toISOString(),
      };

      const clock = getLiveSlaClock(deliveredTicket, holidayDates);
      expect(clock.status).toBe('COMPLETED');
      expect(clock.countdownText).toBe('Delivered');
    });
  });
});
