import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AppShell } from './components/layout/AppShell';
import { BoardPage } from './pages/BoardPage';
import { ListViewPage } from './pages/ListViewPage';
import { DashboardPage } from './pages/DashboardPage';
import { ServiceCatalogPage } from './pages/ServiceCatalogPage';
import { RaciMatrixPage } from './pages/RaciMatrixPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { LoginPage } from './pages/LoginPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<BoardPage />} />
          <Route path="list" element={<ListViewPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="catalog" element={<ServiceCatalogPage />} />
          <Route path="raci" element={<RaciMatrixPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="admin" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
