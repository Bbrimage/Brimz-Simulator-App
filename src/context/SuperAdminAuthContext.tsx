import React, { createContext, useContext, useState } from 'react';
import type { SuperAdmin } from '../types';

// ── Demo credentials ──────────────────────────────────────────────────────
const DEMO_EMAIL    = 'super@demo.com';
const DEMO_PASSWORD = 'demo123';

const DEMO_SUPER_ADMIN: SuperAdmin = {
  id: 'demo-super-1',
  auth_user_id: 'demo-auth-super-1',
  full_name: 'Demo Super Admin',
  created_at: new Date().toISOString(),
};

interface SuperAdminAuthCtx {
  superAdmin: SuperAdmin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthCtx | null>(null);

export function SuperAdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [loading]                   = useState(false);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setSuperAdmin(DEMO_SUPER_ADMIN);
      return null;
    }
    return 'Invalid credentials. Use super@demo.com / demo123';
  }

  async function signOut() {
    setSuperAdmin(null);
  }

  return (
    <SuperAdminAuthContext.Provider value={{ superAdmin, loading, signIn, signOut }}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

export function useSuperAdminAuth() {
  const ctx = useContext(SuperAdminAuthContext);
  if (!ctx) throw new Error('useSuperAdminAuth must be inside SuperAdminAuthProvider');
  return ctx;
}
