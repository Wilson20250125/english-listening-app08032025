import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LessonItem } from '../types';

const BBCLowerPage: React.FC = () => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lesson_items')
        .select('id, title, description, video_url, course_id')
        .eq('course_id', 'bbc-lower')
        .order('id');

      console.log('Supabase data:', data, 'error:', error);

      if (error) {
        throw error;
      }

      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading BBC Lower Level lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLessons}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BBC Lower Level - Video Lessons
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of BBC Lower Level video lessons designed to help you improve your English skills.
          </p>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No lessons found for this course.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 truncate">
                    <Link to={`/lesson/${lesson.id}`} className="hover:underline">
                      {lesson.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-6 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {lesson.description}
                  </p>
                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Info */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About BBC Lower Level</h2>
          <p className="text-gray-600 mb-4">
            BBC Lower Level courses are designed for English learners who are building their foundation in the language. 
            These video lessons cover essential topics and provide practical examples to help you improve your English skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Beginner</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Video</div>
              <div className="text-sm text-gray-600">Format</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BBCLowerPage; 