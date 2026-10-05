import { apiFetch } from './api';
import { BackendUserDto, mapBackendUserToFrontend } from './authService';
import { User, Role } from '../types';

export interface CreateUserPayload {
  username: string;
  fullName: string;
  fullNameKh?: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: Role;
  department?: string;
  sessionTimeout?: string;
  mustChangePassword?: boolean;
}

interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export async function fetchUsersApi(): Promise<User[]> {
  const res = await apiFetch<ApiResponseWrapper<BackendUserDto[]>>('/users');
  if (res && Array.isArray(res.data)) {
    return res.data.map(mapBackendUserToFrontend);
  }
  return [];
}

export async function createUserApi(payload: CreateUserPayload): Promise<User> {
  // Convert role if needed (EXECUTIVE -> GM)
  const roleForBackend = payload.role === 'EXECUTIVE' ? 'GM' : payload.role;

  const res = await apiFetch<ApiResponseWrapper<BackendUserDto>>('/users', {
    method: 'POST',
    body: JSON.stringify({
      username: payload.username.trim(),
      email: payload.email?.trim() || `${payload.username.trim()}@bgroceries.com`,
      phoneNumber: payload.phoneNumber?.trim() || undefined,
      fullName: payload.fullName.trim(),
      fullNameKh: payload.fullNameKh?.trim() || undefined,
      password: payload.password.trim(),
      role: roleForBackend,
      department: payload.department || 'Store Operations',
      sessionTimeout: payload.sessionTimeout || '15 min',
      mustChangePassword: payload.mustChangePassword ?? true, // Always true on Admin creation
    }),
  });

  return mapBackendUserToFrontend(res.data);
}

export async function toggleUserStatusApi(id: string | number): Promise<User> {
  const res = await apiFetch<ApiResponseWrapper<BackendUserDto>>(`/users/${id}/status`, {
    method: 'PUT',
  });
  return mapBackendUserToFrontend(res.data);
}

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: Role;
  department?: string;
  sessionTimeout?: string;
  active?: boolean;
}

export async function updateUserApi(id: string | number, payload: UpdateUserPayload): Promise<User> {
  const roleForBackend = payload.role === 'EXECUTIVE' ? 'GM' : payload.role;
  const res = await apiFetch<ApiResponseWrapper<BackendUserDto>>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phoneNumber: payload.phoneNumber?.trim() || undefined,
      role: roleForBackend,
      department: payload.department,
      sessionTimeout: payload.sessionTimeout,
      active: payload.active,
    }),
  });
  return mapBackendUserToFrontend(res.data);
}

export async function resetUserPasswordApi(
  id: string | number,
  temporaryPassword?: string
): Promise<User> {
  const res = await apiFetch<ApiResponseWrapper<BackendUserDto>>(
    `/users/${id}/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify(temporaryPassword ? { temporaryPassword } : {}),
    }
  );
  return mapBackendUserToFrontend(res.data);
}

export async function adminChangeUserPasswordApi(
  id: string | number,
  newPassword: string,
  forceResetOnLogin: boolean = false
): Promise<User> {
  const res = await apiFetch<ApiResponseWrapper<BackendUserDto>>(
    `/users/${id}/password`,
    {
      method: 'PUT',
      body: JSON.stringify({
        newPassword: newPassword.trim(),
        forceResetOnLogin,
      }),
    }
  );
  return mapBackendUserToFrontend(res.data);
}

export async function deleteUserApi(id: string | number): Promise<void> {
  await apiFetch<ApiResponseWrapper<void>>(`/users/${id}`, {
    method: 'DELETE',
  });
}
