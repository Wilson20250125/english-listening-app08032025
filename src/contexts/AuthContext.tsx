import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('[AuthContext] getInitialSession start');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('[AuthContext] getSession result:', session, error);
      setSession(session);
      setUser(session?.user ?? null);
      // fetchProfile 暂时不在这里调用，避免多次重复
      setLoading(false);
      console.log('[AuthContext] setLoading(false) called in getInitialSession');
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] onAuthStateChange event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          const userId = session?.user?.id;
          console.log('→ Auth SIGNED_IN: userId =', userId);

          if (!userId) {
            console.warn('🚨 userId 不存在，fetchProfile 不会被调用');
            setLoading(false);
            return;
          }

          // 暂时停用 profile 查询，直接设为 null，避免 Supabase RLS 问题导致页面卡住
          setProfile(null);
          // console.log('[AuthContext] fetchProfile start (onAuthStateChange)');
          // await fetchProfile(userId);
          // console.log('[AuthContext] fetchProfile end (onAuthStateChange)');
          setLoading(false);
          return;
        }
        // if (session?.user) {
        //   console.log('[AuthContext] fetchProfile start (onAuthStateChange)');
        //   await fetchProfile(session.user.id);
        //   console.log('[AuthContext] fetchProfile end (onAuthStateChange)');
        // } else {
        //   setProfile(null);
        // }
        setProfile(null);
        setLoading(false);
        console.log('[AuthContext] setLoading(false) called in onAuthStateChange');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('→ fetchProfile: query start', userId);
      console.log('→ fetchProfile: before query');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
        .throwOnError();

      console.log('→ fetchProfile: after query');
      console.log('→ fetchProfile: raw response =', profile);

      if (profile) {
        setProfile(profile);
        console.log('→ fetchProfile: setProfile success', profile);
      } else {
        console.warn('→ fetchProfile: profile not found');
      }
    } catch (err) {
      console.error('→ fetchProfile: catch error =', err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 