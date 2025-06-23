import React from 'react';
import { Calendar, Clock, Award, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const todayTask = {
    title: "A Little Story about Friendship",
    description: "Learn about friendship through an engaging short story while practicing vocabulary and comprehension.",
    image: "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"
  };

  const progress = {
    phase: 65,
    averageScore: 85,
    totalHours: 24,
    daysStudied: 15
  };

  const streak = {
    current: 7,
    thisMonth: 15,
    total: 30
  };

  const recommendations = [
    {
      id: 1,
      title: "Technology News: AI Advances",
      type: "News",
      points: 50
    },
    {
      id: 2,
      title: "Business English: Negotiations",
      type: "Conversation",
      points: 75
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Task */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={todayTask.image}
                alt="Today's task"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="ml-2 text-sm font-medium text-blue-600">Today's Learning Task</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">{todayTask.title}</h2>
              <p className="mt-2 text-gray-600">{todayTask.description}</p>
              <button
                onClick={() => navigate('/learning-details')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>

        {/* Progress & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{progress.phase}%</span>
            </div>
            <h3 className="text-gray-900 font-medium">Current Phase</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{progress.averageScore}</span>
            </div>
            <h3 className="text-gray-900 font-medium">Average Score</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{progress.totalHours}h</span>
            </div>
            <h3 className="text-gray-900 font-medium">Total Study Time</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{progress.daysStudied}</span>
            </div>
            <h3 className="text-gray-900 font-medium">Days Studied</h3>
          </div>
        </div>

        {/* Streak Tracker */}
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

        {/* Recommended Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(task => (
              <div key={task.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-blue-600">{task.type}</span>
                    <h3 className="text-lg font-medium text-gray-900 mt-1">{task.title}</h3>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">+{task.points} pts</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Start Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;