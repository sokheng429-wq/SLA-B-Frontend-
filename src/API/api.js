/**
 * B-Groceries SLA Tracker - Backend API Client
 * Connects React Frontend with Spring Boot Backend (D:\1.BGroceries\SLA\SLA-Backend)
 * Endpoints:
 *   POST /api/auth/login   - Authenticate with username & password, returns JWT token & UserDto
 *   GET  /api/auth/me      - Retrieve current authenticated user profile
 *   GET  /api/auth/health  - Health check endpoint
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const TOKEN_STORAGE_KEY = 'sla_jwt_token';
export const USER_STORAGE_KEY = 'sla_auth_user';

export const authApi = {
  /**
   * Retrieve stored JWT token
   */
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Store JWT token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },

  /**
   * Clear JWT token and session
   */
  clearAuth() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Helper to construct authorization headers
   */
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  },

  /**
   * Health Check: Test connection to Spring Boot backend
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data?.status === 200 || data?.success === true;
    } catch {
      return false;
    }
  },

  /**
   * Login with username and password
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object, message: string}>}
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `Authentication failed (${response.status})`;
        throw new Error(errorMsg);
      }

      if (data?.token) {
        this.setToken(data.token);
      }

      // Map backend UserDto to frontend format
      const backendUser = data?.user || {};
      const words = (backendUser.fullName || backendUser.username || username).split(/[\s_.-]+/);
      const initials = words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : (backendUser.fullName || username).slice(0, 2).toUpperCase();

      const user = {
        id: backendUser.id,
        username: backendUser.username || username,
        email: backendUser.email || `${username}@bgroceries.com`,
        fullName: backendUser.fullName || username,
        role: backendUser.role || 'MARKETING_OPS',
        roleLabel: backendUser.role === 'ADMIN' ? 'System Administrator' :
                   backendUser.role === 'MARKETING_OPS' ? 'Marketing Operations & Creative Lead' :
                   backendUser.role === 'IT' ? 'IT Administrator' :
                   backendUser.role === 'MANAGER' ? 'Department Manager' :
                   backendUser.role === 'GM' ? 'General Manager' :
                   backendUser.role === 'ASSIGNEE' ? 'Creative Assignee' :
                   backendUser.role === 'REQUESTER' ? 'Department Requester' : backendUser.role,
        department: backendUser.department || 'Marketing & Brand',
        avatar: initials || 'SM'
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return {
        success: true,
        token: data.token,
        tokenType: data.tokenType || 'Bearer',
        expiresIn: data.expiresIn,
        user,
        message: data.message || 'Login successful'
      };
    } catch (err) {
      // If server refused connection, provide clear actionable message
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to Spring Boot backend API at http://localhost:8082. Please ensure the backend server is running.');
      }
      throw err;
    }
  },

  /**
   * Get current user profile using JWT token
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        this.clearAuth();
        return null;
      }

      if (!response.ok) return null;

      const data = await response.json();
      return data?.data || data?.user || null;
    } catch {
      return null;
    }
  }
};

export default authApi;
