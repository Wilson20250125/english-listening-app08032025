import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Course {
  title: string;
  level: string;
  type: string;
  url: string;
  description: string;
}

const CourseSchedulePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('Title', { ascending: true });

      if (error) {
        console.error('Failed to fetch lessons:', error.message);
      } else {
        const normalized = (data || []).map((d) => ({
          title: d.Title,
          level: d.Level,
          type: d.Type,
          url: d.URL,
          description: d.Description,
        }));
        setCourses(normalized);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  const getLevelColor = (level: string) => {
    if (level.includes('Beginner')) return 'bg-green-100 text-green-800 border-green-200';
    if (level.includes('Intermediate')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level.includes('Advanced')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Schedule</h1>
          <p className="text-xl text-gray-600">
            Explore our curated collection of English learning resources
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {course.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-2 min-h-[3rem]">
                    {course.description}
                  </p>

                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    Visit Course
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSchedulePage;
