import { apiFetch, setStoredToken, removeStoredToken } from './api';
import { User, Role } from '../types';

export interface BackendUserDto {
  id: number | string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  fullName: string;
  role: string;
  department?: string | null;
  sessionTimeout?: string | null;
  active: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
}

export interface AuthResponsePayload {
  status: number;
  message: string;
  token: string;
  tokenType: string;
  expiresIn: number;
  user: BackendUserDto;
}

export function mapBackendUserToFrontend(bUser: BackendUserDto): User {
  // Map backend GM to frontend EXECUTIVE if necessary
  const roleMapped: Role = (bUser.role === 'GM' ? 'EXECUTIVE' : bUser.role) as Role;

  // Department mapping helper
  let deptId = 'dept-ops';
  const deptLower = (bUser.department || '').toLowerCase();
  if (deptLower.includes('market') || deptLower.includes('mkt')) {
    deptId = 'dept-mkt';
  } else if (deptLower.includes('it') || deptLower.includes('tech')) {
    deptId = 'dept-it';
  } else if (deptLower.includes('purchas') || deptLower.includes('pur')) {
    deptId = 'dept-pur';
  } else if (deptLower.includes('fin')) {
    deptId = 'dept-fin';
  } else if (deptLower.includes('hr')) {
    deptId = 'dept-hr';
  }

  return {
    id: String(bUser.id),
    username: bUser.username,
    email: bUser.email,
    phoneNumber: bUser.phoneNumber || undefined,
    fullNameEn: bUser.fullName || bUser.username,
    fullNameKh: bUser.fullName || bUser.username,
    role: roleMapped,
    departmentId: deptId,
    departmentName: bUser.department || 'Store Operations',
    sessionTimeout: bUser.sessionTimeout || '15 min',
    avatarUrl: '/assets/Profile.avif',
    mustChangePassword: Boolean(bUser.mustChangePassword),
    active: Boolean(bUser.active),
  };
}

export async function loginApi(
  usernameOrEmail: string,
  passwordText: string
): Promise<{ user: User; token: string; mustChangePassword: boolean }> {
  const payload = await apiFetch<AuthResponsePayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: usernameOrEmail.trim(),
      password: passwordText.trim(),
    }),
  });

  if (payload.token) {
    setStoredToken(payload.token);
  }

  const user = mapBackendUserToFrontend(payload.user);
  return {
    user,
    token: payload.token,
    mustChangePassword: user.mustChangePassword ?? false,
  };
}

export async function changePasswordApi(
  newPassword: string,
  confirmPassword: string,
  username?: string,
  currentPassword?: string
): Promise<{ user: User; token: string }> {
  const payload = await apiFetch<AuthResponsePayload>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      username,
      currentPassword,
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim(),
    }),
  });

  if (payload.token) {
    setStoredToken(payload.token);
  }

  const user = mapBackendUserToFrontend(payload.user);
  return {
    user,
    token: payload.token,
  };
}

export async function getCurrentUserApi(): Promise<User | null> {
  try {
    const res = await apiFetch<{ status: number; message: string; data: BackendUserDto }>('/auth/me');
    if (res && res.data) {
      return mapBackendUserToFrontend(res.data);
    }
    return null;
  } catch {
    removeStoredToken();
    return null;
  }
}
