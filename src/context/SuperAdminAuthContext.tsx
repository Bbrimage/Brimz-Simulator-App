import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SuperAdmin } from '../types';

interface SuperAdminAuthCtx {
  superAdmin: SuperAdmin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthCtx | null>(null);

export function SuperAdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadSuperAdminProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadSuperAdminProfile(session.user.id);
      else { setSuperAdmin(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadSuperAdminProfile(authUserId: string) {
    const { data } = await supabase
      .from('super_admins')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    setSuperAdmin(data ?? null);
    setLoading(false);
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (!data.user) return 'Sign in failed.';

    const { data: sa } = await supabase
      .from('super_admins')
      .select('id')
      .eq('auth_user_id', data.user.id)
      .single();

    if (!sa) {
      await supabase.auth.signOut();
      return 'Access denied. Super admin account not found.';
    }
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
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
