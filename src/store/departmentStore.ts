import { create } from 'zustand';
import { Department, ServiceCatalogItem, Holiday } from '../types';
import { DEPARTMENTS } from '../data/departments';
import { MARKETING_SERVICES } from '../data/serviceCatalog';
import { DEFAULT_CAMBODIAN_HOLIDAYS } from '../utils/slaEngine';

interface DepartmentState {
  departments: Department[];
  currentDepartmentId: string;
  services: ServiceCatalogItem[];
  holidays: Holiday[];
  setCurrentDepartment: (deptId: string) => void;
  getCurrentDepartment: () => Department;
  getDepartmentServices: (deptId?: string) => ServiceCatalogItem[];
  addService: (service: ServiceCatalogItem) => void;
  updateService: (service: ServiceCatalogItem) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (dept: Department) => void;
  addHoliday: (holiday: Holiday) => void;
  removeHoliday: (holidayId: string) => void;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: DEPARTMENTS,
  currentDepartmentId: 'dept-mkt',
  services: MARKETING_SERVICES,
  holidays: DEFAULT_CAMBODIAN_HOLIDAYS,

  setCurrentDepartment: (deptId: string) => {
    set({ currentDepartmentId: deptId });
  },

  getCurrentDepartment: () => {
    const { departments, currentDepartmentId } = get();
    return departments.find(d => d.id === currentDepartmentId) || departments[0];
  },

  getDepartmentServices: (deptId?: string) => {
    const targetId = deptId || get().currentDepartmentId;
    return get().services.filter(s => s.departmentId === targetId);
  },

  addService: (newService: ServiceCatalogItem) => {
    set((state) => ({
      services: [...state.services, newService]
    }));
  },

  updateService: (updated: ServiceCatalogItem) => {
    set((state) => ({
      services: state.services.map(s => s.id === updated.id ? updated : s)
    }));
  },

  addDepartment: (dept: Department) => {
    set((state) => ({
      departments: [...state.departments, dept]
    }));
  },

  updateDepartment: (dept: Department) => {
    set((state) => ({
      departments: state.departments.map(d => d.id === dept.id ? dept : d)
    }));
  },

  addHoliday: (holiday: Holiday) => {
    set((state) => ({
      holidays: [...state.holidays, holiday]
    }));
  },

  removeHoliday: (holidayId: string) => {
    set((state) => ({
      holidays: state.holidays.filter(h => h.id !== holidayId)
    }));
  }
}));
