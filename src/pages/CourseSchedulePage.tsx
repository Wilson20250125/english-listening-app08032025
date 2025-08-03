import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  title: string;
  level: string;
  type: string;
  url: string;
  description: string;
}

interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  lastStudied?: string;
}

interface LearningStats {
  totalLessonsCompleted: number;
  weeklyStudyTime: number;
  consecutiveDays: number;
  totalCourses: number;
}

const CourseSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalLessonsCompleted: 0,
    weeklyStudyTime: 0,
    consecutiveDays: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取课程数据
        const { data: coursesData, error: coursesError } = await supabase
          .from('lessons')
          .select('*')
          .order('Title', { ascending: true });

        if (coursesError) {
          console.error('Failed to fetch lessons:', coursesError.message);
        } else {
          const normalized = (coursesData || []).map((d) => ({
            title: d.Title,
            level: d.Level,
            type: d.Type,
            url: d.URL,
            description: d.Description,
          }));

          const levelPriority = {
            'Beginner (A1-A2)': 1,
            'Intermediate (B1-B2)': 2,
            'Advanced (C1-C2)': 3,
            'Specialized': 4,
          };

          const sorted = normalized.sort(
            (a, b) => (levelPriority[a.level as keyof typeof levelPriority] || 99) - (levelPriority[b.level as keyof typeof levelPriority] || 99)
          );

          setCourses(sorted);
        }

        // 如果用户已登录，获取学习进度
        if (user) {
          await fetchLearningProgress();
          await fetchLearningStats();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const fetchLearningProgress = async () => {
    try {
      // 获取学生答案数据来计算进度
      const { data: studentAnswers, error } = await supabase
        .from('student_answers')
        .select('lesson_id, created_at')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Failed to fetch student answers:', error);
        return;
      }

      // 获取课程项目数据
      const { data: lessonItems, error: lessonItemsError } = await supabase
        .from('lesson_items')
        .select('id, course_id');

      if (lessonItemsError) {
        console.error('Failed to fetch lesson items:', lessonItemsError);
        return;
      }

      // 计算每个课程的进度
      const progressMap = new Map<string, CourseProgress>();
      
      // 初始化所有课程的进度
      lessonItems?.forEach(item => {
        if (!progressMap.has(item.course_id)) {
          progressMap.set(item.course_id, {
            courseId: item.course_id,
            completedLessons: 0,
            totalLessons: 0,
          });
        }
        const progress = progressMap.get(item.course_id)!;
        progress.totalLessons++;
      });

      // 计算已完成的课程
      studentAnswers?.forEach(answer => {
        const lessonItem = lessonItems?.find(item => item.id === answer.lesson_id);
        if (lessonItem) {
          const progress = progressMap.get(lessonItem.course_id);
          if (progress) {
            progress.completedLessons++;
            if (!progress.lastStudied || answer.created_at > progress.lastStudied) {
              progress.lastStudied = answer.created_at;
            }
          }
        }
      });

      setCourseProgress(Array.from(progressMap.values()));
    } catch (error) {
      console.error('Error fetching learning progress:', error);
    }
  };

  const fetchLearningStats = async () => {
    try {
      // 获取学生答案数据
      const { data: studentAnswers, error } = await supabase
        .from('student_answers')
        .select('created_at')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Failed to fetch student answers:', error);
        return;
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // 计算统计数据
      const totalLessonsCompleted = studentAnswers?.length || 0;
      
      // 本周学习时间（简化计算：每次回答算5分钟）
      const weeklyAnswers = studentAnswers?.filter(answer => 
        new Date(answer.created_at) >= oneWeekAgo
      ) || [];
      const weeklyStudyTime = weeklyAnswers.length * 5; // 分钟

      // 连续学习天数（简化计算）
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

      // 已学习的课程数量
      const uniqueCourses = new Set(
        courseProgress.map(progress => progress.courseId)
      );

      setLearningStats({
        totalLessonsCompleted,
        weeklyStudyTime,
        consecutiveDays,
        totalCourses: uniqueCourses.size,
      });
    } catch (error) {
      console.error('Error fetching learning stats:', error);
    }
  };

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

        {/* 学习统计卡片 */}
        {user && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{learningStats.totalLessonsCompleted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Weekly Study Time</p>
                    <p className="text-2xl font-bold text-gray-900">{learningStats.weeklyStudyTime} min</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Consecutive Days</p>
                    <p className="text-2xl font-bold text-gray-900">{learningStats.consecutiveDays}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Courses Started</p>
                    <p className="text-2xl font-bold text-gray-900">{learningStats.totalCourses}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

                  <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                    {course.description}
                  </p>

                  {/* 学习进度条 */}
                  {user && (() => {
                    const progress = courseProgress.find(p => {
                      // 根据课程标题匹配进度
                      const courseIdMap: { [key: string]: string } = {
                        'BBC Learning English – Lower Levels': 'bbc-lower',
                        'BBC Learning English – News Review': 'bbc-news-review',
                        'EnglishClass101 – Beginner Listening': 'EnglishClass101',
                        'EnglishClass101 – Intermediate Listening': 'EnglishClass101-Intermediate',
                        'English with Lucy': 'english-with-lucy',
                        'JenniferESL': 'jennifer-esl',
                        "Rachel's English": 'rachels-english',
                        'VOA Learning English – Learning English Broadcast': 'voa-advanced',
                        'VOA Learning English – Let\'s Learn English': 'VOALearning',
                      };
                      return p.courseId === courseIdMap[course.title];
                    });
                    
                    if (progress) {
                      const percentage = progress.totalLessons > 0 
                        ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
                        : 0;
                      
                      return (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Progress: {progress.completedLessons}/{progress.totalLessons} lessons
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          {progress.lastStudied && (
                            <p className="text-xs text-gray-500 mt-1">
                              Last studied: {new Date(progress.lastStudied).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* 课程跳转按钮 */}
                  {course.title === 'BBC Learning English – Lower Levels' ? (
                    <a
                      href="/course/bbc-lower"
                      className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      Go to BBC Learning English
                    </a>
                  ) : course.title === 'EnglishClass101 – Beginner Listening' ? (
                    <a
                      href="/course/englishclass101"
                      className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      Go to EnglishClass101 Lessons
                    </a>
                  ) : course.title === 'BBC Learning English – News Review' ? (
                    <a
                      href="/course/bbc-news-review"
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      Go to BBC News Review Lessons
                    </a>
                  ) : course.title === 'English with Lucy' ? (
                    <a
                      href="/course/english-with-lucy"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      Go to English with Lucy Lessons
                    </a>
                  ) : course.title === 'JenniferESL' ? (
                    <a
                      href="/course/jennifer-esl"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      Go to JenniferESL Lessons
                    </a>
                  ) : course.title === "Rachel's English" ? (
                    <a
                      href="/course/rachels-english"
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      Go to Rachel's English Lessons
                    </a>
                  ) : course.title === 'VOA Learning English – Learning English Broadcast' ? (
                    <a
                      href="/course/voa-advanced"
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      Go to VOA Advanced Lessons
                    </a>
                  ) : course.title === "VOA Learning English – Let's Learn English" ? (
                    <a
                      href="/course/voa-learning"
                      className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      Go to VOA Learning Lessons
                    </a>
                  ) : course.title === 'EnglishClass101 – Intermediate Listening' ? (
                    <a
                      href="/course/englishclass101-intermediate"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      Go to EnglishClass101 Intermediate Lessons
                    </a>
                  ) : (
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      Visit Course
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
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
