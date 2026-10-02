/**
 * Backend API Connector & Syncer for B'Groceries SLA System
 * Connects frontend with Spring Boot backend (http://localhost:8082 / /api)
 * Automatically falls back to localStorage/mock when the backend is offline.
 */
import { INITIAL_TICKETS } from '../data/mockTickets';
import { authApi } from '../API/api';

const STORAGE_KEY = 'bgroceries_sla_tickets_v1';
export const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class BackendApiService {
  constructor() {
    this.isBackendOnline = false;
    this.lastHealthCheck = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.isBackendOnline));
  }

  /**
   * Health check to detect whether Spring Boot backend is reachable
   */
  async checkConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_BASE_URL}/auth/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const online = res.ok;
      if (this.isBackendOnline !== online) {
        this.isBackendOnline = online;
        this.notify();
      }
      this.lastHealthCheck = Date.now();
      return online;
    } catch {
      if (this.isBackendOnline !== false) {
        this.isBackendOnline = false;
        this.notify();
      }
      this.lastHealthCheck = Date.now();
      return false;
    }
  }

  /**
   * Get all tickets: tries backend API, falls back to persistent localStorage / mock
   */
  async getTickets() {
    const isOnline = await this.checkConnection();

    if (isOnline) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/tickets`, {
          headers: authApi.getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend /api/tickets request failed, falling back to local data:', err);
      }
    }

    // LocalStorage Fallback
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed reading localStorage tickets:', err);
    }

    // Default Initial Mock Data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
    return [...INITIAL_TICKETS];
  }

  /**
   * Save a newly created ticket
   */
  async createTicket(ticketData) {
    const newTicket = {
      id: ticketData.id || `MKT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      commentsCount: 0,
      progress: ticketData.progress || 0,
      ...ticketData
    };

    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/tickets`, {
          method: 'POST',
          headers: authApi.getAuthHeaders(),
          body: JSON.stringify(newTicket)
        });
        if (res.ok) {
          const saved = await res.json();
          this.updateLocalTicket(saved);
          return saved;
        }
      } catch (err) {
        console.warn('POST /api/tickets failed, persisting locally:', err);
      }
    }

    this.updateLocalTicket(newTicket);
    return newTicket;
  }

  /**
   * Update an existing ticket (move column, update progress, etc.)
   */
  async updateTicket(ticketId, updates) {
    let updatedItem = null;

    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/tickets/${ticketId}`, {
          method: 'PATCH',
          headers: authApi.getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          updatedItem = await res.json();
        }
      } catch (err) {
        console.warn('PATCH /api/tickets failed, syncing locally:', err);
      }
    }

    // Always update local cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let tickets = cached ? JSON.parse(cached) : INITIAL_TICKETS;
      tickets = tickets.map((t) => (t.id === ticketId ? { ...t, ...updates, ...updatedItem } : t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return tickets.find((t) => t.id === ticketId);
    } catch {
      return null;
    }
  }

  /**
   * Helper to persist ticket to localStorage
   */
  updateLocalTicket(ticket) {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let tickets = cached ? JSON.parse(cached) : INITIAL_TICKETS;
      const index = tickets.findIndex((t) => t.id === ticket.id);
      if (index >= 0) {
        tickets[index] = { ...tickets[index], ...ticket };
      } else {
        tickets.push(ticket);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Error updating local ticket:', e);
    }
  }

  /**
   * Reset mock data to initial state
   */
  resetToMock() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
    return [...INITIAL_TICKETS];
  }
}

export const backendApi = new BackendApiService();
export default backendApi;
