import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider,      useAdminAuth      } from './context/AdminAuthContext';
import { SuperAdminAuthProvider, useSuperAdminAuth } from './context/SuperAdminAuthContext';
import { SimulatorProvider } from './context/SimulatorContext';

// Pages
import LandingPage      from './pages/LandingPage';
import SimulatorPage    from './pages/SimulatorPage';
import AdminLogin       from './pages/admin/AdminLogin';
import AdminSignUp      from './pages/admin/AdminSignUp';
import AdminPending     from './pages/admin/AdminPending';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminLiveEvent   from './pages/admin/AdminLiveEvent';
import AdminEvents      from './pages/admin/AdminEvents';
import AdminContent     from './pages/admin/AdminContent';
import { AdminRewards, AdminFans, AdminSettings } from './pages/admin/AdminRewardsAndMore';
import SuperAdminLogin  from './pages/superadmin/SuperAdminLogin';
import {
  SuperAdminDashboard, SuperAdminVenues, SuperAdminNetwork,
  SuperAdminAPIKeys, SuperAdminBracelets, SuperAdminPlatformSettings,
  SuperAdminAccessRequests,
} from './pages/superadmin/SuperAdminPages';

// Layouts
import AdminLayout      from './components/admin/AdminLayout';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';

// ── Guards ─────────────────────────────────────────────────────────────────

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { adminUser, loading } = useAdminAuth();
  if (loading) return <LoadingScreen />;
  if (!adminUser) return <Navigate to="/admin/login" replace />;
  if (adminUser.status !== 'approved') return <Navigate to="/admin/pending" replace />;
  return <>{children}</>;
}

function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const { superAdmin, loading } = useSuperAdminAuth();
  if (loading) return <LoadingScreen />;
  if (!superAdmin) return <Navigate to="/superadmin/login" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
      <span className="font-mono text-[11px] font-bold tracking-[3px]" style={{ color: '#374151' }}>LOADING...</span>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

import React from 'react';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <SuperAdminAuthProvider>
          <SimulatorProvider>
            <Routes>

              {/* Landing page */}
              <Route path="/"          element={<LandingPage />} />

              {/* Simulator (public) */}
              <Route path="/simulator" element={<SimulatorPage />} />

              {/* Admin */}
              <Route path="/admin/login"   element={<AdminLogin />} />
              <Route path="/admin/signup"  element={<AdminSignUp />} />
              <Route path="/admin/pending" element={<AdminPending />} />
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="live"      element={<AdminLiveEvent />} />
                <Route path="events"    element={<AdminEvents />} />
                <Route path="content"   element={<AdminContent />} />
                <Route path="rewards"   element={<AdminRewards />} />
                <Route path="fans"      element={<AdminFans />} />
                <Route path="settings"  element={<AdminSettings />} />
              </Route>

              {/* Super Admin */}
              <Route path="/superadmin/login" element={<SuperAdminLogin />} />
              <Route path="/superadmin" element={
                <SuperAdminGuard>
                  <SuperAdminLayout />
                </SuperAdminGuard>
              }>
                <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="venues"    element={<SuperAdminVenues />} />
                <Route path="network"   element={<SuperAdminNetwork />} />
                <Route path="apikeys"   element={<SuperAdminAPIKeys />} />
                <Route path="bracelets" element={<SuperAdminBracelets />} />
                <Route path="access"    element={<SuperAdminAccessRequests />} />
                <Route path="settings"  element={<SuperAdminPlatformSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/simulator" replace />} />
            </Routes>
          </SimulatorProvider>
        </SuperAdminAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}