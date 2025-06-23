import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface UseModulesReturn {
  modules: LearningModule[];
  loading: boolean;
  error: Error | null;
}

export function useModules(): UseModulesReturn {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchModules() {
      console.log('🔵 Supabase client check:', supabase);
      try {
        const { data, error: supabaseError } = await supabase
          .from('learning_modules')
          .select('*')
          .order('created_at', { ascending: false });
        
      console.log('模块数据', data); 
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        setModules(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch modules'));
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  return { modules, loading, error };
}