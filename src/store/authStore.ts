import { create } from 'zustand';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockUsers';
import { loginApi, changePasswordApi } from '../services/authService';
import { getStoredToken, removeStoredToken } from '../services/api';

interface AuthState {
  currentUser: User | null;
  pendingResetUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isPendingPasswordReset: boolean;
  loginError: string | null;
  isLoading: boolean;

  login: (
    usernameOrEmail: string,
    passwordText: string
  ) => Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }>;
  changePassword: (
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  cancelPasswordReset: () => void;
  logout: () => void;
  clearError: () => void;
}

// Default to the seeded administrator account (Heng)
const defaultUser = MOCK_USERS.find(u => u.role === 'ADMIN') || MOCK_USERS[0];

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: defaultUser,
  pendingResetUser: null,
  token: getStoredToken() || 'mock-jwt-token-bgroceries-sla-2026',
  isAuthenticated: true,
  isPendingPasswordReset: false,
  loginError: null,
  isLoading: false,

  login: async (usernameOrEmail: string, passwordText: string) => {
    set({ isLoading: true, loginError: null });

    try {
      // 1. Attempt Real Backend API Authentication
      const result = await loginApi(usernameOrEmail, passwordText);

      if (result.mustChangePassword) {
        // User MUST change password before being granted portal access
        set({
          currentUser: result.user,
          pendingResetUser: result.user,
          token: result.token,
          isAuthenticated: false, // Access blocked until password reset is completed
          isPendingPasswordReset: true,
          isLoading: false,
          loginError: null,
        });
        return { success: true, mustChangePassword: true };
      } else {
        // Normal direct access
        set({
          currentUser: result.user,
          pendingResetUser: null,
          token: result.token,
          isAuthenticated: true,
          isPendingPasswordReset: false,
          isLoading: false,
          loginError: null,
        });
        return { success: true, mustChangePassword: false };
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid credentials or login failed';

      // If backend is offline or network error, provide graceful fallback to mock users
      const isNetworkError =
        errorMessage.toLowerCase().includes('failed to fetch') ||
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('load failed');

      if (isNetworkError) {
        const mockAccount = MOCK_USERS.find(
          u =>
            (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
              u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
            u.passwordText === passwordText
        );

        if (mockAccount) {
          set({
            currentUser: mockAccount,
            pendingResetUser: null,
            token: `mock-jwt-${mockAccount.id}-${Date.now()}`,
            isAuthenticated: true,
            isPendingPasswordReset: false,
            isLoading: false,
            loginError: null,
          });
          return { success: true, mustChangePassword: false };
        }
      }

      set({
        loginError: errorMessage,
        isLoading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  changePassword: async (newPassword: string, confirmPassword: string) => {
    set({ isLoading: true, loginError: null });

    try {
      const targetUser = get().pendingResetUser || get().currentUser;
      const result = await changePasswordApi(
        newPassword,
        confirmPassword,
        targetUser?.username
      );

      // Successfully updated password, now grant full access
      set({
        currentUser: result.user,
        pendingResetUser: null,
        token: result.token,
        isAuthenticated: true,
        isPendingPasswordReset: false,
        isLoading: false,
        loginError: null,
      });

      return { success: true };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to change password. Please try again.';
      set({
        loginError: errorMsg,
        isLoading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  cancelPasswordReset: () => {
    removeStoredToken();
    set({
      currentUser: null,
      pendingResetUser: null,
      token: null,
      isAuthenticated: false,
      isPendingPasswordReset: false,
      loginError: null,
    });
  },

  logout: () => {
    removeStoredToken();
    set({
      currentUser: null,
      pendingResetUser: null,
      token: null,
      isAuthenticated: false,
      isPendingPasswordReset: false,
      loginError: null,
    });
  },

  clearError: () => set({ loginError: null }),
}));
