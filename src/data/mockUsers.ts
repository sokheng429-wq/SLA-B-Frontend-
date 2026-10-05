import { User } from '../types';

export interface SeededAccount extends User {
  passwordText: string;
}

/**
 * Default seeded account (offline fallback).
 * Only the default administrator exists: username "Heng" / password "012793921".
 * All other accounts must be created by the Admin from the Admin Settings page.
 */
export const MOCK_USERS: SeededAccount[] = [
  {
    id: 'user-heng',
    username: 'Heng',
    email: 'heng@bgroceries.com',
    phoneNumber: '+855 12 793 921',
    fullNameEn: 'Heng',
    fullNameKh: 'ហេង',
    role: 'ADMIN',
    departmentId: 'dept-it',
    departmentName: 'Information Technology',
    avatarUrl: '/assets/Heng.jpg',
    passwordText: '012793921',
    sessionTimeout: '60 min',
    mustChangePassword: false,
    active: true,
  },
];
