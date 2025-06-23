import React from 'react';
import { User } from '../types';
import { Flame, Award } from 'lucide-react';

interface ProgressSectionProps {
  user: User;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
        <div className="flex items-center">
          <Flame className="h-5 w-5 text-orange-500 mr-1" />
          <span className="text-sm font-medium">{user.streak} day streak</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Vocabulary</span>
              <span className="text-sm font-medium text-gray-700">{user.progress.vocabulary}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sky-600 h-2 rounded-full" 
                style={{ width: `${user.progress.vocabulary}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Grammar</span>
              <span className="text-sm font-medium text-gray-700">{user.progress.grammar}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full" 
                style={{ width: `${user.progress.grammar}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Pronunciation</span>
              <span className="text-sm font-medium text-gray-700">{user.progress.pronunciation}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${user.progress.pronunciation}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Conversation</span>
              <span className="text-sm font-medium text-gray-700">{user.progress.conversation}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full" 
                style={{ width: `${user.progress.conversation}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          <Award className="h-5 w-5 mr-2" />
          View Achievements
        </button>
      </div>
    </div>
  );
};

export default ProgressSection;