import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Calendar, User, Globe, LogOut, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userProfile, setUserProfile] = useState<{ first_name: string; email: string } | null>(null);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, email')
          .eq('user_id', user.id)
          .single();
        if (profile && isMounted) {
          setUserProfile(profile);
        }
      }
      if (isMounted) setLoadingUser(false);
    };
    checkUser();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  if (loadingUser) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50 flex justify-center items-center h-16">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Loading...</span>
      </nav>
    );
  }

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
            <Link to="/course-schedule" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              {language === 'en' ? 'Course Schedule' : '课程表'}
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <User className="h-5 w-5 mr-1" />
              {language === 'en' ? 'Profile' : '个人资料'}
            </Link>
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
            >
              <Globe className="h-5 w-5 mr-1" />
              {language.toUpperCase()}
            </button>

            {/* ✅ 登录状态显示欢迎词，未登录也允许访问 */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {language === 'en' ? 'Welcome' : '欢迎'}
                {userProfile ? `, ${userProfile.first_name}` : '!'}
              </span>
              {userProfile && (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  {language === 'en' ? 'Logout' : '退出'}
                </button>
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
          <button
            onClick={toggleLanguage}
            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            {language === 'en' ? 'Language: ' : '语言：'}{language.toUpperCase()}
          </button>
          {/* ✅ 移除跳转限制 */}
          <div className="block px-3 py-2 text-gray-700">
            {language === 'en' ? 'Welcome!' : '欢迎！'}
          </div>
          {userProfile && (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-gray-50 rounded-md"
            >
              {language === 'en' ? 'Logout' : '退出'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
