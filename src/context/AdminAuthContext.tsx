import React, { createContext, useContext, useState } from 'react';
import type { AdminUser } from '../types';

// ── Demo credentials ──────────────────────────────────────────────────────
const DEMO_EMAIL    = 'admin@demo.com';
const DEMO_PASSWORD = 'demo123';

const DEMO_ADMIN: AdminUser = {
  id: 'demo-admin-1',
  auth_user_id: 'demo-auth-1',
  venue_id: 'demo-venue-1',
  role: 'venue_admin',
  status: 'approved',
  full_name: 'Demo Admin',
  created_at: new Date().toISOString(),
  venue: {
    id: 'demo-venue-1',
    name: 'Demo Arena',
    slug: 'demo-arena',
    team_name: 'Demo Team',
    primary_color: '#6366f1',
    secondary_color: '#818cf8',
    logo_url: null,
    contract_status: 'active',
    api_access_enabled: true,
    ai_mode_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

interface AdminAuthCtx {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn:  (email: string, password: string) => Promise<string | null>;
  signUp:  (fullName: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading]                 = useState(false);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setAdminUser(DEMO_ADMIN);
      return null;
    }
    return 'Invalid credentials. Use admin@demo.com / demo123';
  }

  async function signUp(_fullName: string, _email: string, _password: string): Promise<string | null> {
    return 'Sign up is disabled in demo mode. Use admin@demo.com / demo123 to sign in.';
  }

  async function signOut() {
    setAdminUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, signIn, signUp, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}
