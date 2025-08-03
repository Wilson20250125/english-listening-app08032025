import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Calendar, User, Globe, LogOut, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50 flex justify-center items-center h-16">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Loading...</span>
      </nav>
    );
  }

  const isAuthenticated = !!user;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Learnify</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              {language === 'en' ? 'Home' : '首页'}
            </Link>
            {isAuthenticated && (
              <>

                <Link to="/course-schedule" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  {language === 'en' ? 'Course Schedule' : '课程表'}
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  {language === 'en' ? 'Profile' : '个人资料'}
                </Link>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
            >
              <Globe className="h-5 w-5 mr-1" />
              {language.toUpperCase()}
            </button>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    {language === 'en' ? 'Welcome' : '欢迎'}
                    {profile ? `, ${profile.first_name}` : '!'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    {language === 'en' ? 'Logout' : '退出'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                    {language === 'en' ? 'Login' : '登录'}
                  </Link>
                  <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    {language === 'en' ? 'Sign Up' : '注册'}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            {language === 'en' ? 'Home' : '首页'}
          </Link>
          {isAuthenticated && (
            <>

              <Link
                to="/course-schedule"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                {language === 'en' ? 'Course Schedule' : '课程表'}
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                {language === 'en' ? 'Profile' : '个人资料'}
              </Link>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            {language === 'en' ? 'Language: ' : '语言：'}{language.toUpperCase()}
          </button>
          
          {isAuthenticated ? (
            <>
              <div className="block px-3 py-2 text-gray-700">
                {language === 'en' ? 'Welcome' : '欢迎'}
                {profile ? `, ${profile.first_name}` : '!'}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-gray-50 rounded-md"
              >
                {language === 'en' ? 'Logout' : '退出'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                {language === 'en' ? 'Login' : '登录'}
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              >
                {language === 'en' ? 'Sign Up' : '注册'}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
