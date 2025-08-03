import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LessonItem } from '../types';
import InteractiveDialogue from '../components/InteractiveDialogue';

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLesson(id);
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchLesson = async (lessonId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('lesson_items')
        .select('*')
        .eq('id', lessonId)
        .single();
      if (error) throw error;
      setLesson(data);
    } catch (err) {
      setError('Failed to load lesson. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <button
            onClick={() => navigate('/course/bbc-lower')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // 判断是否为YouTube嵌入链接
  const isYouTube = lesson.video_url && lesson.video_url.includes('youtube.com/embed');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Today's Learning</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* 视频播放器 */}
          <div className="w-full max-w-6xl mx-auto aspect-[3/2] bg-black rounded-lg overflow-hidden shadow">
            {isYouTube ? (
              <iframe
                src={lesson.video_url}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                poster="https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"
              >
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          {/* 内容区 */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
            {/* 词汇区可后续扩展 */}
          </div>
          {/* Interactive Dialogue Section */}
          <div className="px-6 pb-6">
            <InteractiveDialogue 
              lessonTitle={lesson.title}
              lessonDescription={lesson.description}
              videoUrl={lesson.video_url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage; 