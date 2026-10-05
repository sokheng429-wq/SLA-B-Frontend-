import { create } from 'zustand';
import { RaciActivity, SlaPolicy, EscalationRule } from '../types';
import { INITIAL_RACI_ACTIVITIES } from '../data/raciData';
import { MOCK_USERS, SeededAccount } from '../data/mockUsers';

export const DEFAULT_SLA_POLICIES: SlaPolicy[] = [
  {
    id: 'pol-p1',
    departmentId: 'dept-mkt',
    priorityTier: 'P1',
    nameEn: 'Critical / Crisis',
    nameKh: 'បន្ទាន់បំផុត (វិបត្តិ/ច្បាប់)',
    initialResponseMinutes: 0,
    tatHours: 4,
    tatBusinessDays: 0,
    approverRole: 'EXECUTIVE',
    alertDelayThresholdHours: 2,
    alertRecipientRole: 'GM_EXECUTIVE'
  },
  {
    id: 'pol-p2',
    departmentId: 'dept-mkt',
    priorityTier: 'P2',
    nameEn: 'High Priority',
    nameKh: 'អាទិភាពខ្ពស់',
    initialResponseMinutes: 30,
    tatHours: 8,
    tatBusinessDays: 1,
    approverRole: 'MARKETING_DIRECTOR',
    alertDelayThresholdHours: 1,
    alertRecipientRole: 'MARKETING_DIRECTOR'
  },
  {
    id: 'pol-p3',
    departmentId: 'dept-mkt',
    priorityTier: 'P3',
    nameEn: 'Medium (Standard)',
    nameKh: 'អាទិភាពមធ្យម (ស្តង់ដារ)',
    initialResponseMinutes: 120,
    tatHours: 24,
    tatBusinessDays: 2,
    approverRole: 'MARKETING_MANAGER',
    alertDelayThresholdHours: 4,
    alertRecipientRole: 'MARKETING_LEAD'
  },
  {
    id: 'pol-p4',
    departmentId: 'dept-mkt',
    priorityTier: 'P4',
    nameEn: 'Low / Routine',
    nameKh: 'អាទិភាពទាប / ទម្លាប់ធម្មតា',
    initialResponseMinutes: 240,
    tatHours: 40,
    tatBusinessDays: 5,
    approverRole: 'LEAD',
    alertDelayThresholdHours: 24,
    alertRecipientRole: 'DEPARTMENT_LEAD'
  }
];

export const DEFAULT_ESCALATION_RULES: EscalationRule[] = [
  {
    level: 1,
    nameEn: 'Level 1: Minor Delay',
    nameKh: 'កម្រិត ១: យឺតយ៉ាវស្រាល (< ២៤ ម៉ោង)',
    triggerDelayHours: 0,
    targetRole: 'PRIMARY_RESOLVER',
    resolutionSlaHours: 24,
    actionRequiredEn: 'Notify primary assignee and line supervisor; check roadblock causes.',
    actionRequiredKh: 'ជូនដំណឹងដល់អ្នកអនុវត្តផ្ទាល់ និងប្រធានក្រុម ដើម្បីដោះស្រាយឧបសគ្គ។'
  },
  {
    level: 2,
    nameEn: 'Level 2: Moderate Delay',
    nameKh: 'កម្រិត ២: យឺតយ៉ាវមធ្យម (២៤ - ៤៨ ម៉ោង)',
    triggerDelayHours: 24,
    targetRole: 'CREATIVE_LEAD',
    resolutionSlaHours: 4,
    actionRequiredEn: 'Alert Creative Lead and Marketing Manager; reallocate queue or split task.',
    actionRequiredKh: 'ជូនដំណឹងដល់ Creative Lead និងប្រធានទីផ្សារ ដើម្បីបែងចែកការងារឡើងវិញ។'
  },
  {
    level: 3,
    nameEn: 'Level 3: Major Delay',
    nameKh: 'កម្រិត ៣: យឺតយ៉ាវធ្ងន់ធ្ងរ (> ៤៨ ម៉ោង)',
    triggerDelayHours: 48,
    targetRole: 'MARKETING_MANAGER',
    resolutionSlaHours: 8,
    actionRequiredEn: 'Emergency backlog meeting; assign backup specialist or activate overtime agency.',
    actionRequiredKh: 'ប្រជុំបន្ទាន់ ចាត់តាំងអ្នកជំនាញបម្រុង ឬផ្ទេរការងារទៅ Agency ក្រៅម៉ោង។'
  },
  {
    level: 4,
    nameEn: 'Level 4: Critical / Crisis Risk',
    nameKh: 'កម្រិត ៤: វិបត្តិធ្ងន់ធ្ងរ ឬប៉ះពាល់ការបើកសាខា',
    triggerDelayHours: 72,
    targetRole: 'GM_EXECUTIVE',
    resolutionSlaHours: 2,
    actionRequiredEn: 'Direct emergency executive intervention with General Manager and Operations Director.',
    actionRequiredKh: 'កិច្ចប្រជុំបន្ទាន់ភ្លាមៗជាមួយអគ្គនាយកប្រតិបត្តិ (GM) និងនាយកប្រតិបត្តិការផ្សារ។'
  }
];

interface AdminState {
  raciActivities: RaciActivity[];
  slaPolicies: SlaPolicy[];
  escalationRules: EscalationRule[];
  users: SeededAccount[];

  updateRaciRole: (activityId: number, roleKey: string, newCode: 'R' | 'A' | 'C' | 'I') => void;
  updateSlaPolicy: (updatedPolicy: SlaPolicy) => void;
  updateEscalationRule: (updatedRule: EscalationRule) => void;
  createUser: (user: SeededAccount) => void;
  toggleUserActive: (userId: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  raciActivities: INITIAL_RACI_ACTIVITIES,
  slaPolicies: DEFAULT_SLA_POLICIES,
  escalationRules: DEFAULT_ESCALATION_RULES,
  users: MOCK_USERS,

  updateRaciRole: (activityId, roleKey, newCode) => {
    set((state) => ({
      raciActivities: state.raciActivities.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            roles: {
              ...act.roles,
              [roleKey]: newCode
            }
          };
        }
        return act;
      })
    }));
  },

  updateSlaPolicy: (updatedPolicy) => {
    set((state) => ({
      slaPolicies: state.slaPolicies.map((p) => p.id === updatedPolicy.id ? updatedPolicy : p)
    }));
  },

  updateEscalationRule: (updatedRule) => {
    set((state) => ({
      escalationRules: state.escalationRules.map((r) => r.level === updatedRule.level ? updatedRule : r)
    }));
  },

  createUser: (newUser) => {
    set((state) => ({
      users: [...state.users, newUser]
    }));
  },

  toggleUserActive: (userId) => {
    set((state) => ({
      users: state.users.map((u) => u.id === userId ? { ...u, active: !u.sessionTimeout } : u)
    }));
  }
}));
