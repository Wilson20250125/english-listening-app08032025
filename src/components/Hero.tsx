import React from 'react';
import { BookOpen, Award, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn English <span className="text-yellow-300">Effectively</span> with Personalized Lessons
            </h1>
            
            <p className="text-lg text-blue-100">
              Master English at your own pace with our interactive lessons, 
              personalized practice sessions, and instant feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Start Learning
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Explore Lessons
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-0 right-0 -mr-4 mt-4 bg-white rounded-lg shadow-xl p-6 transform rotate-6">
                <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
                <h3 className="font-bold text-gray-800">300+ Lessons</h3>
                <p className="text-sm text-gray-600">For all proficiency levels</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-xl p-6 transform -rotate-3">
                <img
                  src="https://images.pexels.com/photos/4144294/pexels-photo-4144294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Student learning English"
                  className="w-full h-auto rounded-md mb-4"
                />
                <h3 className="font-bold text-gray-800">Personalized Learning</h3>
                <p className="text-sm text-gray-600">Tailored to your skill level and goals</p>
              </div>
              
              <div className="absolute bottom-0 left-0 -ml-4 -mb-4 bg-white rounded-lg shadow-xl p-6 transform -rotate-6">
                <Award className="h-10 w-10 text-blue-600 mb-2" />
                <h3 className="font-bold text-gray-800">Track Progress</h3>
                <p className="text-sm text-gray-600">Visualize your improvement</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <BookOpen className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Structured Curriculum</h3>
            <p className="text-blue-100">
              Follow our proven learning path designed by language experts.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <Award className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Practice</h3>
            <p className="text-blue-100">
              Build your skills consistently with bite-sized daily activities.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-blue-100">
              Connect with fellow learners and get help when you need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;