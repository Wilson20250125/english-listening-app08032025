import React from 'react';
import { Clock, BookOpen, BookText, Mic, MessageSquare } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const getCategoryIcon = () => {
    switch (lesson.category) {
      case 'vocabulary':
        return <BookOpen className="h-5 w-5 text-sky-600" />;
      case 'grammar':
        return <BookText className="h-5 w-5 text-emerald-600" />;
      case 'pronunciation':
        return <Mic className="h-5 w-5 text-indigo-600" />;
      case 'conversation':
        return <MessageSquare className="h-5 w-5 text-amber-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-sky-600" />;
    }
  };

  const getLevelBadgeColor = () => {
    switch (lesson.level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getLevelBadgeColor()}`}>
            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{lesson.duration} min</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{lesson.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {getCategoryIcon()}
            <span className="ml-1 text-sm text-gray-600">{lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}</span>
          </div>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;