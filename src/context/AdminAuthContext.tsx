import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AdminUser } from '../types';

interface AdminAuthCtx {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadAdminProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadAdminProfile(session.user.id);
      else { setAdminUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadAdminProfile(authUserId: string) {
    const { data } = await supabase
      .from('admin_users')
      .select('*, venue:venues(*)')
      .eq('auth_user_id', authUserId)
      .single();
    setAdminUser(data ?? null);
    setLoading(false);
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (!data.user) return 'Sign in failed.';

    // Verify this user is actually an admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', data.user.id)
      .single();

    if (!admin) {
      await supabase.auth.signOut();
      return 'Access denied. No admin account found.';
    }
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAdminUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}
