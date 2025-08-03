import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CreateProfilePage from './pages/CreateProfilePage';

import UserPerformancePage from './pages/UserPerformancePage';
import CourseSchedulePage from './pages/CourseSchedulePage';
import LearningDetailsPage from './pages/LearningDetailsPage';
import BBCLowerPage from './pages/BBCLowerPage';
import BBCNewsReviewPage from './pages/BBCNewsReviewPage';
import EnglishWithLucyPage from './pages/EnglishWithLucyPage';
import JenniferESLPage from './pages/JenniferESLPage';
import RachelsEnglishPage from './pages/RachelsEnglishPage';
import VOAAdvancedPage from './pages/VOAAdvancedPage';
import VOALearningPage from './pages/VOALearningPage';
import EnglishClass101IntermediatePage from './pages/EnglishClass101IntermediatePage';
import LessonDetailPage from './pages/LessonDetailPage';
import Footer from './components/Footer';
import EnglishClass101Page from './pages/EnglishClass101Page';
// Import new auth pages
import ConfirmationPage from './pages/auth/ConfirmationPage';
import EmailConfirmationSuccess from './pages/auth/EmailConfirmationSuccess';
import AuthCallback from './pages/auth/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <BrowserRouter>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-profile" element={<CreateProfilePage />} />
              
              {/* Auth callback routes */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/confirmation" element={<ConfirmationPage />} />
              <Route path="/auth/confirmation-success" element={<EmailConfirmationSuccess />} />
              

              <Route path="/performance" element={
                <ProtectedRoute>
                  <UserPerformancePage />
                </ProtectedRoute>
              } />
              <Route path="/course-schedule" element={
                <ProtectedRoute>
                  <CourseSchedulePage />
                </ProtectedRoute>
              } />
              <Route path="/learning-details" element={
                <ProtectedRoute>
                  <LearningDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/course/bbc-lower" element={
                <ProtectedRoute>
                  <BBCLowerPage />
                </ProtectedRoute>
              } />
              <Route path="/course/englishclass101" element={
                <ProtectedRoute>
                  <EnglishClass101Page />
                </ProtectedRoute>
              } />
              <Route path="/course/bbc-news-review" element={
                <ProtectedRoute>
                  <BBCNewsReviewPage />
                </ProtectedRoute>
              } />
              <Route path="/course/english-with-lucy" element={
                <ProtectedRoute>
                  <EnglishWithLucyPage />
                </ProtectedRoute>
              } />
              <Route path="/course/jennifer-esl" element={
                <ProtectedRoute>
                  <JenniferESLPage />
                </ProtectedRoute>
              } />
              <Route path="/course/rachels-english" element={
                <ProtectedRoute>
                  <RachelsEnglishPage />
                </ProtectedRoute>
              } />
              <Route path="/course/voa-advanced" element={
                <ProtectedRoute>
                  <VOAAdvancedPage />
                </ProtectedRoute>
              } />
              <Route path="/course/voa-learning" element={
                <ProtectedRoute>
                  <VOALearningPage />
                </ProtectedRoute>
              } />
              <Route path="/course/englishclass101-intermediate" element={
                <ProtectedRoute>
                  <EnglishClass101IntermediatePage />
                </ProtectedRoute>
              } />
              <Route path="/lesson/:id" element={
                <ProtectedRoute>
                  <LessonDetailPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;