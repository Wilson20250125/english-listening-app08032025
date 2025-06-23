import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  created_at: string;
  completed: boolean;
}

const DashboardPage: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load modules:', error);
      } else {
        setModules(data || []);
      }

      setLoading(false);
    };

    fetchModules();

    // 👇 测试 profiles 表是否可以访问
    const testProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      console.log('Profiles Data:', data);
      console.log('Profiles Error:', error);
    };

    testProfiles();
  }, []);

  const groupModulesByDate = (mods: LearningModule[]) => {
    const map = new Map<string, LearningModule[]>();
    for (const mod of mods) {
      const date = new Date(mod.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(mod);
    }
    return Array.from(map.entries());
  };

  const markComplete = async (id: string) => {
    const { error } = await supabase
      .from('learning_modules')
      .update({ completed: true })
      .eq('id', id);

    if (error) {
      console.error('Failed to mark module as complete:', error);
    } else {
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setModules(data);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Learning Modules</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {groupModulesByDate(modules).map(([date, items]) => (
            <div key={date} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">📅 {date}</h2>
              <div className="space-y-4">
                {items.map((mod) => (
                  <div key={mod.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{mod.title}</h3>
                      <p className="text-gray-600 text-sm">{mod.description}</p>
                    </div>
                    {mod.completed ? (
                      <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-700">
                        ✅ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => markComplete(mod.id)}
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
