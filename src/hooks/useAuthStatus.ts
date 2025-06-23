import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  first_name: string;
  last_name: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  profile: Profile | null;
  loading: boolean;
}

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', user.id)
            .single();

          setStatus({
            isAuthenticated: true,
            profile,
            loading: false,
          });
        } else {
          setStatus({
            isAuthenticated: false,
            profile: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setStatus({
          isAuthenticated: false,
          profile: null,
          loading: false,
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', session.user.id)
          .single();

        setStatus({
          isAuthenticated: true,
          profile,
          loading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setStatus({
          isAuthenticated: false,
          profile: null,
          loading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return status;
}