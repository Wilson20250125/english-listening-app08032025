import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CreateProfilePage from './pages/CreateProfilePage';
import Dashboard from './pages/Dashboard';
import UserPerformancePage from './pages/UserPerformancePage';
import CourseSchedulePage from './pages/CourseSchedulePage';
import LearningDetailsPage from './pages/LearningDetailsPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/performance" element={<UserPerformancePage />} />
            <Route path="/course-schedule" element={<CourseSchedulePage />} />
            <Route path="/learning-details" element={<LearningDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;