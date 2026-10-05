import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useDepartmentStore } from '../store/departmentStore';
import { Avatar } from '../components/common/Avatar';
import { Role, User } from '../types';
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  toggleUserStatusApi,
  adminChangeUserPasswordApi,
  deleteUserApi,
} from '../services/userService';
import {
  Users,
  UserPlus,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  Mail,
  Phone,
  Search,
  X,
  Edit2,
  Power,
  Trash2,
  UserCog,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuthStore();
  const { departments } = useDepartmentStore();

  const initialModule = searchParams.get('module') === 'create' ? 'create' : 'manage';
  const [userSubTab, setUserSubTab] = useState<'manage' | 'create'>(initialModule);

  // Create User Module State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newFullNameEn, setNewFullNameEn] = useState('');
  const [newFullNameKh, setNewFullNameKh] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newRole, setNewRole] = useState<Role>('REQUESTER');
  const [newDeptId, setNewDeptId] = useState('dept-ops');
  const [newSessionTimeout, setNewSessionTimeout] = useState('15 min');
  const [newMustChangePassword, setNewMustChangePassword] = useState(true);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Manage Users Search & Filtering State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | Role>('ALL');
  const [userDeptFilter, setUserDeptFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED' | 'RESET_REQUIRED'>('ALL');

  // Edit User Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTargetUser, setEditTargetUser] = useState<User | null>(null);
  const [editFullNameEn, setEditFullNameEn] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editRole, setEditRole] = useState<Role>('REQUESTER');
  const [editDepartment, setEditDepartment] = useState('Store Operations');
  const [editSessionTimeout, setEditSessionTimeout] = useState('15 min');
  const [editActive, setEditActive] = useState(true);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editModalError, setEditModalError] = useState<string | null>(null);

  // Backend Live Users State
  const [backendUsers, setBackendUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccessMessage, setUserSuccessMessage] = useState<string | null>(null);

  // Change User Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | number>('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);
  const [forceResetOnNextLogin, setForceResetOnNextLogin] = useState(true);
  const [isChangingUserPassword, setIsChangingUserPassword] = useState(false);
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const list = await fetchUsersApi();
      if (list && list.length > 0) {
        setBackendUsers(list);
      }
    } catch (err: unknown) {
      setUserError(err instanceof Error ? err.message : 'Could not synchronize users from backend server');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      alert('Username is required');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsSubmittingUser(true);
    setUserError(null);
    setUserSuccessMessage(null);

    const chosenDept = departments.find((d) => d.id === newDeptId);
    const deptName = chosenDept ? chosenDept.nameEn : 'Store Operations';

    try {
      await createUserApi({
        username: newUsername.trim(),
        password: newPassword,
        fullName: newFullNameEn.trim() || newUsername.trim(),
        email: newEmail.trim() || `${newUsername.trim()}@bgroceries.com`,
        phoneNumber: newPhoneNumber.trim() || undefined,
        role: newRole,
        department: deptName,
        sessionTimeout: newSessionTimeout,
        mustChangePassword: newMustChangePassword,
      });

      setUserSuccessMessage(`User "@${newUsername.trim()}" created successfully! Initial credentials configured.`);
      setNewUsername('');
      setNewPassword('');
      setNewFullNameEn('');
      setNewFullNameKh('');
      setNewEmail('');
      setNewPhoneNumber('');
      setUserSubTab('manage');
      await loadUsers();
    } catch (err: unknown) {
      setUserError(err instanceof Error ? err.message : 'Failed to create user on backend');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // Open Edit User Modal
  const openEditUserModal = (user: User) => {
    setEditTargetUser(user);
    setEditFullNameEn(user.fullNameEn || user.fullNameKh || '');
    setEditEmail(user.email || '');
    setEditPhoneNumber(user.phoneNumber || '');
    setEditRole(user.role);
    setEditDepartment(user.departmentName || 'Store Operations');
    setEditSessionTimeout(user.sessionTimeout || '15 min');
    setEditActive(user.active !== false);
    setEditModalError(null);
    setEditModalOpen(true);
  };

  // Submit Edit User
  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetUser) return;

    setIsEditingUser(true);
    setEditModalError(null);

    try {
      await updateUserApi(editTargetUser.id, {
        fullName: editFullNameEn.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhoneNumber.trim(),
        role: editRole,
        department: editDepartment,
        sessionTimeout: editSessionTimeout,
        active: editActive,
      });

      setUserSuccessMessage(`Account "@${editTargetUser.username}" profile updated successfully.`);
      setEditModalOpen(false);
      await loadUsers();
    } catch (err: unknown) {
      setEditModalError(err instanceof Error ? err.message : 'Failed to update user profile');
    } finally {
      setIsEditingUser(false);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user: User) => {
    if (currentUser && user.username.toLowerCase() === currentUser.username.toLowerCase()) {
      alert('You cannot deactivate your own logged-in administrator account.');
      return;
    }
    try {
      const updated = await toggleUserStatusApi(user.id);
      setUserSuccessMessage(`Account "${user.username}" status updated to ${updated.active ? 'ACTIVE' : 'DISABLED'}.`);
      await loadUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  // Open Password Modal
  const openChangePasswordModal = (user: User | null) => {
    if (user) {
      setTargetUserId(user.id);
    } else if (backendUsers.length > 0) {
      setTargetUserId(backendUsers[0].id);
    }
    setAdminNewPassword('');
    setAdminConfirmPassword('');
    setShowAdminNewPassword(false);
    setShowAdminConfirmPassword(false);
    setForceResetOnNextLogin(true);
    setPasswordModalError(null);
    setPasswordModalOpen(true);
  };

  // Submit Admin Change Password
  const handleAdminChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
      setPasswordModalError('Please select a user account');
      return;
    }
    if (!adminNewPassword || adminNewPassword.length < 6) {
      setPasswordModalError('Password must be at least 6 characters long');
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setPasswordModalError('The two passwords do not match. Please verify both fields.');
      return;
    }

    setIsChangingUserPassword(true);
    setPasswordModalError(null);

    try {
      const selected = backendUsers.find((u) => String(u.id) === String(targetUserId));
      const targetName = selected ? selected.username : `ID ${targetUserId}`;

      await adminChangeUserPasswordApi(
        targetUserId,
        adminNewPassword,
        forceResetOnNextLogin
      );

      setUserSuccessMessage(
        `Password for user "${targetName}" updated successfully.${
          forceResetOnNextLogin ? ' User must choose their own password on next login.' : ''
        }`
      );
      setPasswordModalOpen(false);
      await loadUsers();
    } catch (err: unknown) {
      setPasswordModalError(err instanceof Error ? err.message : 'Failed to update user password');
    } finally {
      setIsChangingUserPassword(false);
    }
  };

  const generateRandomPassword = () => {
    const generated = `Bgroceries#${Math.floor(1000 + Math.random() * 9000)}`;
    setAdminNewPassword(generated);
    setAdminConfirmPassword(generated);
  };

  // Delete User
  const handleDeleteUser = async (user: User) => {
    if (currentUser && user.username.toLowerCase() === currentUser.username.toLowerCase()) {
      alert('You cannot delete your own logged-in administrator account.');
      return;
    }
    if (!confirm(`Are you sure you want to delete account "${user.username}"? This cannot be undone.`)) return;
    try {
      await deleteUserApi(user.id);
      setUserSuccessMessage(`Account "${user.username}" deleted.`);
      await loadUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>ENTERPRISE GOVERNANCE • USER ADMINISTRATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight flex items-center gap-3">
            <UserCog className="w-8 h-8 text-[#77BC1F]" />
            <span>{t('nav.users', 'Manage Users')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Enterprise User Provisioning, Corporate Role Assignment, Credentials Control & Account Security
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadUsers}
            disabled={loadingUsers}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#16202C] text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer shadow-xs"
            title="Refresh users from backend database"
          >
            <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin text-[#77BC1F]' : ''}`} />
            <span>Sync Database</span>
          </button>
        </div>
      </div>

      {/* Module Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-gray-100 dark:bg-[#0E1520] rounded-2xl border border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUserSubTab('manage')}
            className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              userSubTab === 'manage'
                ? 'bg-white dark:bg-[#16202C] text-[#232F3F] dark:text-white shadow-md border border-gray-200/80 dark:border-white/15'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-[#77BC1F]" />
            <span>Manage Users Directory</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F]">
              {backendUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setUserSubTab('create')}
            className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              userSubTab === 'create'
                ? 'bg-[#77BC1F] text-white shadow-md shadow-[#77BC1F]/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create User Module</span>
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {userSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span>{userSuccessMessage}</span>
          </div>
          <button onClick={() => setUserSuccessMessage(null)} className="text-emerald-700 dark:text-emerald-300 hover:opacity-70 p-1">✕</button>
        </div>
      )}

      {userError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs sm:text-sm font-bold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>{userError}</span>
          </div>
          <button onClick={() => setUserError(null)} className="text-red-700 dark:text-red-300 hover:opacity-70 p-1">✕</button>
        </div>
      )}

      {/* MODULE 1: CREATE USER */}
      {userSubTab === 'create' && (
        <div className="p-6 md:p-8 bg-white dark:bg-[#16202C] rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#77BC1F]/15 text-[#558D14] flex items-center justify-center border border-[#77BC1F]/30 shadow-xs">
                <UserPlus className="w-6 h-6 text-[#77BC1F]" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-[#232F3F] dark:text-white">
                  Create User Module
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Provision new corporate user accounts, department roles, and temporary credentials.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUserSubTab('manage')}
              className="text-xs font-bold text-[#77BC1F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Users Directory →</span>
            </button>
          </div>

          {/* Informational Security Banner */}
          <div className="p-4 bg-[#77BC1F]/10 dark:bg-[#77BC1F]/15 border border-[#77BC1F]/30 rounded-xl text-xs text-[#232F3F] dark:text-gray-200 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#77BC1F] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#558D14] dark:text-[#77BC1F]">
                Enterprise Security Governance Active:
              </span>{' '}
              Accounts created by Administrators will be issued initial credentials. By default, the mandatory password change flag is enabled, requiring the staff member to choose a private password on their first login.
            </div>
          </div>

          {/* Comprehensive Create User Form */}
          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name EN */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sokha Meas"
                  value={newFullNameEn}
                  onChange={(e) => setNewFullNameEn(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                />
              </div>

              {/* Full Name KH */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name (Khmer)
                </label>
                <input
                  type="text"
                  placeholder="e.g. មាស សុខា"
                  value={newFullNameKh}
                  onChange={(e) => setNewFullNameKh(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-khmer text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm font-bold">@</span>
                  <input
                    type="text"
                    required
                    placeholder="sokha_meas"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-mono text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Initial Password (min. 6 chars) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = `Bgroceries#${Math.floor(1000 + Math.random() * 9000)}`;
                      setNewPassword(rand);
                    }}
                    className="text-[11px] font-bold text-[#FF9900] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl font-mono text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder={newUsername ? `${newUsername}@bgroceries.com` : 'user@bgroceries.com'}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number (Cambodian format)
                </label>
                <div className="relative">
                  <Phone className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. 012 345 678"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-medium text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  User Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
                >
                  <option value="REQUESTER">REQUESTER (Standard Department Requester)</option>
                  <option value="ASSIGNEE">ASSIGNEE (Resolving Specialist / Designer)</option>
                  <option value="MARKETING_OPS">MARKETING_OPS (SLA Lead / Triage Operator)</option>
                  <option value="MANAGER">MANAGER (Department Approver & Reviewer)</option>
                  <option value="EXECUTIVE">EXECUTIVE (General Manager / Escalation Authority)</option>
                  <option value="ADMIN">ADMIN (Full System Administrator)</option>
                </select>
              </div>

              {/* Department Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Department Desk *
                </label>
                <select
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
                >
                  <option value="dept-mkt">Marketing & Communications (MKT)</option>
                  <option value="dept-it">Information Technology (IT)</option>
                  <option value="dept-ops">Store Operations (OPS)</option>
                  <option value="dept-pur">Purchasing & Sourcing (PUR)</option>
                  <option value="dept-fin">Finance & Accounting (FIN)</option>
                  <option value="dept-hr">Human Resources (HR)</option>
                </select>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Session Inactivity Timeout
                </label>
                <select
                  value={newSessionTimeout}
                  onChange={(e) => setNewSessionTimeout(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-xl text-sm font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
                >
                  <option value="15 min">15 minutes (Standard)</option>
                  <option value="30 min">30 minutes</option>
                  <option value="60 min">60 minutes</option>
                  <option value="120 min">120 minutes (Executive)</option>
                </select>
              </div>

              {/* Mandatory Password Change Toggle */}
              <div className="flex items-center">
                <label className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0E1520] flex items-center gap-3 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={newMustChangePassword}
                    onChange={(e) => setNewMustChangePassword(e.target.checked)}
                    className="w-4 h-4 text-[#77BC1F] focus:ring-[#77BC1F] accent-[#77BC1F] rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#232F3F] dark:text-white block">
                      Require password change on first login
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                      Forces the user to create their personal password immediately upon sign-in.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  setNewUsername('');
                  setNewPassword('');
                  setNewFullNameEn('');
                  setNewFullNameKh('');
                  setNewEmail('');
                  setNewPhoneNumber('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmittingUser}
                className="flex items-center gap-2 px-6 py-3 bg-[#77BC1F] hover:bg-[#66A31A] disabled:opacity-50 text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-[#77BC1F]/30 cursor-pointer"
              >
                {isSubmittingUser ? (
                  <span>Creating User...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Staff Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODULE 2: MANAGE USERS DIRECTORY */}
      {userSubTab === 'manage' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#16202C] border border-gray-200 dark:border-white/10 shadow-2xs">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Users</div>
              <div className="text-2xl font-black text-[#232F3F] dark:text-white mt-1">
                {backendUsers.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Provisioned accounts</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#16202C] border border-gray-200 dark:border-white/10 shadow-2xs">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Active Staff</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {backendUsers.filter((u) => u.active !== false).length}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Can sign in</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#16202C] border border-gray-200 dark:border-white/10 shadow-2xs">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Administrators</div>
              <div className="text-2xl font-black text-[#558D14] dark:text-[#77BC1F] mt-1">
                {backendUsers.filter((u) => u.role === 'ADMIN').length}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Full access</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#16202C] border border-gray-200 dark:border-white/10 shadow-2xs">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Pending Reset</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {backendUsers.filter((u) => u.mustChangePassword).length}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">First-time login</div>
            </div>
          </div>

          {/* Dedicated User Password Management Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#16202C] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center border border-[#FF9900]/30 shrink-0 mt-0.5">
                <KeyRound className="w-5 h-5 text-[#FF9900]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#232F3F] dark:text-white flex items-center gap-2">
                  <span>Admin Setting: User Password Management</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 uppercase">
                    Admin Privilege
                  </span>
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                  As an Administrator, you can update passwords directly for any staff member, set permanent credentials, or enforce a mandatory password change on their next login (requiring 2 textboxes: Password & Confirm Password).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openChangePasswordModal(null)}
                className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#FF9900]/25 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Change User Password</span>
              </button>
              <button
                type="button"
                onClick={() => setUserSubTab('create')}
                className="px-4 py-2 bg-[#77BC1F] hover:bg-[#66A31A] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#77BC1F]/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create User</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-3.5 bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xs flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, @username, email, or phone..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg text-xs font-medium text-[#232F3F] dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
              />
              {userSearchQuery && (
                <button
                  onClick={() => setUserSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Role */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as 'ALL' | Role)}
                className="p-2 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg text-xs font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MARKETING_OPS">MARKETING_OPS</option>
                <option value="ASSIGNEE">ASSIGNEE</option>
                <option value="MANAGER">MANAGER</option>
                <option value="EXECUTIVE">EXECUTIVE</option>
                <option value="REQUESTER">REQUESTER</option>
              </select>
            </div>

            {/* Filter Department */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Dept:</span>
              <select
                value={userDeptFilter}
                onChange={(e) => setUserDeptFilter(e.target.value)}
                className="p-2 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg text-xs font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
              >
                <option value="ALL">All Desks</option>
                <option value="Marketing">Marketing</option>
                <option value="Information Technology">IT</option>
                <option value="Store Operations">Store Ops</option>
                <option value="Purchasing">Purchasing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">HR</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Status:</span>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'DISABLED' | 'RESET_REQUIRED')}
                className="p-2 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-lg text-xs font-bold text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="DISABLED">Disabled Only</option>
                <option value="RESET_REQUIRED">Pending Reset</option>
              </select>
            </div>
          </div>

          {/* Filtered User Table */}
          {(() => {
            const query = userSearchQuery.trim().toLowerCase();
            const filtered = backendUsers.filter((u) => {
              if (query) {
                const matchName = (u.fullNameEn || '').toLowerCase().includes(query);
                const matchKh = (u.fullNameKh || '').toLowerCase().includes(query);
                const matchUser = (u.username || '').toLowerCase().includes(query);
                const matchEmail = (u.email || '').toLowerCase().includes(query);
                const matchPhone = (u.phoneNumber || '').toLowerCase().includes(query);
                if (!matchName && !matchKh && !matchUser && !matchEmail && !matchPhone) return false;
              }
              if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
              if (userDeptFilter !== 'ALL' && !((u.departmentName || '').toLowerCase().includes(userDeptFilter.toLowerCase()))) return false;
              if (userStatusFilter === 'ACTIVE' && u.active === false) return false;
              if (userStatusFilter === 'DISABLED' && u.active !== false) return false;
              if (userStatusFilter === 'RESET_REQUIRED' && !u.mustChangePassword) return false;
              return true;
            });

            return (
              <div className="bg-white dark:bg-[#16202C] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xs">
                <div className="px-5 py-3.5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-gray-500">
                  <span>Showing {filtered.length} of {backendUsers.length} Users</span>
                  {userSearchQuery && (
                    <button
                      onClick={() => {
                        setUserSearchQuery('');
                        setUserRoleFilter('ALL');
                        setUserDeptFilter('ALL');
                        setUserStatusFilter('ALL');
                      }}
                      className="text-[#77BC1F] hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-[#0E1520] border-b border-gray-200 dark:border-white/10 text-[#232F3F] dark:text-gray-300 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Username</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Login Status</th>
                        <th className="py-3.5 px-4">Account</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            No user accounts match the current search & filters.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={u.fullNameEn || u.username} avatarUrl={u.avatarUrl} size="sm" />
                                <div>
                                  <div className="font-bold text-[#232F3F] dark:text-white flex items-center gap-1.5">
                                    <span>{u.fullNameEn || u.username}</span>
                                    {currentUser?.username.toLowerCase() === u.username.toLowerCase() && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 uppercase">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  {u.fullNameKh && (
                                    <div className="text-[11px] text-gray-400 font-khmer">{u.fullNameKh}</div>
                                  )}
                                  <div className="text-[11px] text-gray-400">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-gray-700 dark:text-gray-300">
                              @{u.username}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 dark:border-[#77BC1F]/40">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300 font-medium">
                              {u.departmentName}
                            </td>
                            <td className="py-3.5 px-4">
                              {u.mustChangePassword ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Reset Required (First Login)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Verified Active</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {u.active !== false ? (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
                                  DISABLED
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Edit User Button */}
                                <button
                                  type="button"
                                  onClick={() => openEditUserModal(u)}
                                  className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-[#77BC1F] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                  title={`Edit details for @${u.username}`}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                {/* Change User Password Button */}
                                <button
                                  type="button"
                                  onClick={() => openChangePasswordModal(u)}
                                  className="p-1.5 rounded-lg border border-[#FF9900]/40 text-[#FF9900] hover:bg-[#FF9900]/10 dark:hover:bg-[#FF9900]/20 transition-colors cursor-pointer"
                                  title={`Change password for @${u.username}`}
                                >
                                  <KeyRound className="w-4 h-4" />
                                </button>

                                {/* Toggle status */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(u)}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    u.active !== false
                                      ? 'border-gray-200 dark:border-white/10 text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                                      : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                                  }`}
                                  title={u.active !== false ? 'Deactivate account' : 'Activate account'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                  title="Delete staff account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Admin Change User Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#16202C] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/15 text-[#232F3F] dark:text-white w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center">
                  <KeyRound className="w-4.5 h-4.5 text-[#FF9900]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#232F3F] dark:text-white">
                    Admin: Change User Password
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Update staff credentials with immediate effect or forced reset
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {passwordModalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordModalError}</span>
              </div>
            )}

            <form onSubmit={handleAdminChangePassword} className="space-y-4 text-sm">
              {/* Target User Selector */}
              <div>
                <label className="block font-bold mb-1.5 text-xs text-gray-700 dark:text-gray-300">
                  Target User Account *
                </label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white font-medium focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                >
                  <option value="">-- Choose User to Change Password --</option>
                  {backendUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullNameEn} (@{user.username}) — {user.role} ({user.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected User Badge */}
              {(() => {
                const selected = backendUsers.find((user) => String(user.id) === String(targetUserId));
                if (!selected) return null;
                return (
                  <div className="p-3 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={selected.fullNameEn} avatarUrl={selected.avatarUrl} size="sm" />
                      <div>
                        <div className="font-bold text-[#232F3F] dark:text-white">
                          {selected.fullNameEn}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          @{selected.username} • {selected.departmentName}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#77BC1F]/15 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 uppercase">
                      {selected.role}
                    </span>
                  </div>
                );
              })()}

              {/* Textbox 1: New Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-xs text-gray-700 dark:text-gray-300">
                    New Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-[#FF9900] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Random Password</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter new password (min. 6 characters)"
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 cursor-pointer"
                  >
                    {showAdminNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Textbox 2: Confirm Password */}
              <div>
                <label className="block font-bold mb-1.5 text-xs text-gray-700 dark:text-gray-300">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Re-enter new password to confirm"
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-sm text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 cursor-pointer"
                  >
                    {showAdminConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Force Reset Checkbox */}
              <div className="p-3 bg-gray-50 dark:bg-[#0E1520] rounded-xl border border-gray-200 dark:border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceResetOnNextLogin}
                    onChange={(e) => setForceResetOnNextLogin(e.target.checked)}
                    className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900] accent-[#FF9900] rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#232F3F] dark:text-white block">
                      Enforce Password Reset on Next Sign-in
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      The user will be required to change this temporary password immediately after logging in.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingUserPassword}
                  className="px-5 py-2 rounded-lg bg-[#FF9900] hover:bg-[#E68A00] disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-[#FF9900]/30 cursor-pointer text-xs flex items-center gap-1.5"
                >
                  {isChangingUserPassword ? <span>Saving...</span> : <span>Update User Password</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && editTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#16202C] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/15 text-[#232F3F] dark:text-white w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#77BC1F]/15 text-[#558D14] flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-[#77BC1F]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#232F3F] dark:text-white">
                    Edit User Profile: @{editTargetUser.username}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Update role assignments, department desk, and contact information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editModalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editFullNameEn}
                  onChange={(e) => setEditFullNameEn(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                    Role *
                  </label>
                  <select
                    value={editRole}
                    disabled={currentUser?.username.toLowerCase() === editTargetUser.username.toLowerCase()}
                    onChange={(e) => setEditRole(e.target.value as Role)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] disabled:opacity-60"
                  >
                    <option value="REQUESTER">REQUESTER</option>
                    <option value="ASSIGNEE">ASSIGNEE</option>
                    <option value="MARKETING_OPS">MARKETING_OPS</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EXECUTIVE">EXECUTIVE (GM)</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  {currentUser?.username.toLowerCase() === editTargetUser.username.toLowerCase() && (
                    <span className="text-[10px] text-gray-400 block mt-0.5">Cannot change own role</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                    Department *
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
                  >
                    <option value="Marketing & Communications">Marketing</option>
                    <option value="Information Technology">IT</option>
                    <option value="Store Operations">Store Ops</option>
                    <option value="Purchasing & Sourcing">Purchasing</option>
                    <option value="Finance & Accounting">Finance</option>
                    <option value="Human Resources">HR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                    Session Timeout
                  </label>
                  <select
                    value={editSessionTimeout}
                    onChange={(e) => setEditSessionTimeout(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F]"
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="60 min">60 min</option>
                    <option value="120 min">120 min</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-xs text-gray-700 dark:text-gray-300">
                    Account Status
                  </label>
                  <select
                    value={editActive ? 'active' : 'disabled'}
                    disabled={currentUser?.username.toLowerCase() === editTargetUser.username.toLowerCase()}
                    onChange={(e) => setEditActive(e.target.value === 'active')}
                    className="w-full p-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-300 dark:border-white/15 rounded-lg text-[#232F3F] dark:text-white focus:ring-2 focus:ring-[#77BC1F] disabled:opacity-60"
                  >
                    <option value="active">Active (Can login)</option>
                    <option value="disabled">Disabled (Blocked)</option>
                  </select>
                  {currentUser?.username.toLowerCase() === editTargetUser.username.toLowerCase() && (
                    <span className="text-[10px] text-gray-400 block mt-0.5">Cannot disable own account</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-white/10 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditingUser}
                  className="px-5 py-2 rounded-lg bg-[#77BC1F] hover:bg-[#66A31A] disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-[#77BC1F]/30 cursor-pointer text-xs flex items-center gap-1.5"
                >
                  {isEditingUser ? <span>Saving...</span> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
