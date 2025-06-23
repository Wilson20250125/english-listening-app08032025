import React, { useEffect, useState } from 'react';
import { Loader, BarChart2, Clock, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserPerformance } from '../types';

const UserPerformancePage: React.FC = () => {
  const [data, setData] = useState<UserPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: performance, error: supabaseError } = await supabase
          .from('user_performance_table')
          .select('*')
          .order('completed_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        setData(performance || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Overview</h1>
        <p className="text-gray-600">Track your learning progress and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{data.length}</span>
          </div>
          <h3 className="text-gray-700 font-medium">Total Activities</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-6 w-6 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {Math.round(data.reduce((acc, curr) => acc + curr.duration, 0) / 60)}h
            </span>
          </div>
          <h3 className="text-gray-700 font-medium">Total Learning Time</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="h-6 w-6 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {data.length ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length) : 0}%
            </span>
          </div>
          <h3 className="text-gray-700 font-medium">Average Score</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {data.map((performance) => (
            <div key={performance.id} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {performance.category}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(performance.completed_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{performance.score}%</p>
                  <p className="text-sm text-gray-500">{performance.duration} minutes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPerformancePage;