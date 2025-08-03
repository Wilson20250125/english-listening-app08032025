import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Award, BookOpen, Star, TrendingUp, TrendingDown, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lastStudiedLesson, setLastStudiedLesson] = useState<any>(null);
  const [learningStats, setLearningStats] = useState({
    totalLessonsCompleted: 0,
    weeklyStudyTime: 0,
    consecutiveDays: 0,
    averageScore: 0,
    weeklyChange: 0
  });
  const [streak, setStreak] = useState({
    current: 0,
    thisMonth: 0,
    total: 0
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // 获取用户最后学习的课程
      const { data: lastLesson, error: lastLessonError } = await supabase
        .from('student_answers')
        .select(`
          lesson_id,
          created_at,
          lesson_items (
            id,
            title,
            description,
            course_id,
            video_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!lastLessonError && lastLesson) {
        setLastStudiedLesson(lastLesson);
      }

      // 获取学习统计数据
      await fetchLearningStats();
      
      // 获取推荐内容
      await fetchRecommendations();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningStats = async () => {
    try {
      const { data: studentAnswers, error } = await supabase
        .from('student_answers')
        .select('created_at, gpt_score')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Failed to fetch student answers:', error);
        return;
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // 计算统计数据
      const totalLessonsCompleted = studentAnswers?.length || 0;
      
      // 本周学习时间（每次回答算5分钟）
      const weeklyAnswers = studentAnswers?.filter(answer => 
        new Date(answer.created_at) >= oneWeekAgo
      ) || [];
      const weeklyStudyTime = weeklyAnswers.length * 5;

      // 上周学习时间（用于计算变化）
      const lastWeekAnswers = studentAnswers?.filter(answer => {
        const answerDate = new Date(answer.created_at);
        return answerDate >= twoWeeksAgo && answerDate < oneWeekAgo;
      }) || [];
      const lastWeekStudyTime = lastWeekAnswers.length * 5;
      const weeklyChange = lastWeekStudyTime > 0 
        ? Math.round(((weeklyStudyTime - lastWeekStudyTime) / lastWeekStudyTime) * 100)
        : 0;

      // 连续学习天数
      const studyDates = new Set(
        studentAnswers?.map(answer => 
          new Date(answer.created_at).toDateString()
        ) || []
      );
      let consecutiveDays = 0;
      let currentDate = new Date(now);
      
      while (studyDates.has(currentDate.toDateString())) {
        consecutiveDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      // 平均分数
      const scores = studentAnswers?.filter(answer => answer.gpt_score !== null)
        .map(answer => answer.gpt_score) || [];
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      setLearningStats({
        totalLessonsCompleted,
        weeklyStudyTime,
        consecutiveDays,
        averageScore,
        weeklyChange
      });

      // 设置连续天数
      setStreak({
        current: consecutiveDays,
        thisMonth: studyDates.size,
        total: totalLessonsCompleted
      });

    } catch (error) {
      console.error('Error fetching learning stats:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // 获取用户学习过的课程类型
      const { data: userCourses, error } = await supabase
        .from('student_answers')
        .select(`
          lesson_items (
            course_id
          )
        `)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Failed to fetch user courses:', error);
        return;
      }

      // 获取推荐课程（基于用户学习历史）
      const userCourseIds = new Set(
        userCourses?.map(answer => (answer.lesson_items as any)?.course_id).filter(Boolean) || []
      );

      // 如果有学习历史，推荐未学习的课程；否则推荐热门课程
      let recommendedLessons;
      let recError;
      if (userCourseIds.size > 0) {
        const result = await supabase
          .from('lesson_items')
          .select('id, title, description, course_id')
          .not('course_id', 'in', `(${Array.from(userCourseIds).join(',')})`)
          .limit(2);
        recommendedLessons = result.data;
        recError = result.error;
      } else {
        // 新用户推荐热门课程
        const result = await supabase
          .from('lesson_items')
          .select('id, title, description, course_id')
          .limit(2);
        recommendedLessons = result.data;
        recError = result.error;
      }

      if (!recError && recommendedLessons) {
        setRecommendations(recommendedLessons);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your learning dashboard...</p>
          </div>
        ) : (
          <>
            {/* Today's Task - 动态显示最后学习的课程 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={lastStudiedLesson ? "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg" : "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"}
                    alt="Learning task"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="ml-2 text-sm font-medium text-blue-600">
                      {lastStudiedLesson ? "Continue Learning" : "Today's Learning Task"}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    {lastStudiedLesson ? lastStudiedLesson.lesson_items?.title : "Start Your Learning Journey"}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {lastStudiedLesson ? lastStudiedLesson.lesson_items?.description : "Choose a course to begin your English learning adventure."}
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => lastStudiedLesson ? navigate(`/lesson/${lastStudiedLesson.lesson_id}`) : navigate('/course-schedule')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {lastStudiedLesson ? "Continue Learning" : "Start Learning"}
                    </button>
                    <button
                      onClick={() => navigate('/course-schedule')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Browse Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress & Achievements - 动态统计数据 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{learningStats.totalLessonsCompleted}</span>
                    {learningStats.weeklyChange !== 0 && (
                      <div className="flex items-center text-sm">
                        {learningStats.weeklyChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-1 ${learningStats.weeklyChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(learningStats.weeklyChange)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-gray-900 font-medium">Lessons Completed</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{learningStats.averageScore}</span>
                </div>
                <h3 className="text-gray-900 font-medium">Average Score</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">{learningStats.weeklyStudyTime}m</span>
                </div>
                <h3 className="text-gray-900 font-medium">Weekly Study Time</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{learningStats.consecutiveDays}</span>
                </div>
                <h3 className="text-gray-900 font-medium">Consecutive Days</h3>
              </div>
            </div>

            {/* Streak Tracker - 动态连续学习天数 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Study Streak</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-2 font-medium">{streak.current} Day Streak!</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg ${
                      i < streak.thisMonth
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Recommended Tasks - 个性化推荐 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map(lesson => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium text-blue-600">New Course</span>
                          <h3 className="text-lg font-medium text-gray-900 mt-1">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{lesson.description}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">+50 pts</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Learning
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-600">No recommendations available. Start learning to get personalized suggestions!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;