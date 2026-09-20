import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { MessageSquare, ChevronRight, UserCheck, Shield, GraduationCap, RefreshCw, Moon, Sun } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { SmitLogo } from './SmitLogo';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    studentTab,
    setStudentTab,
    teacherTab,
    setTeacherTab,
    adminTab,
    setAdminTab,
    currentUser,
    resetAllData,
    isDarkMode,
    toggleDarkMode,
  } = useLMS();

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleHomeClick = () => {
    if (role === 'student') setStudentTab('dashboard');
    else if (role === 'teacher') setTeacherTab('students');
    else setAdminTab('trainers');
  };

  // Generate current breadcrumb title
  const getActiveViewTitle = () => {
    if (role === 'student') {
      switch (studentTab) {
        case 'dashboard':
          return '';
        case 'profile':
          return 'Profile';
        case 'progress':
          return 'Progress';
        case 'attendance':
          return 'Attendance';
        case 'payment':
          return 'Payment';
        case 'assignment':
          return 'Assignment';
        case 'quiz':
          return 'Quiz';
        default:
          return '';
      }
    } else if (role === 'teacher') {
      switch (teacherTab) {
        case 'students':
          return 'Student Management';
        case 'attendance':
          return 'Mark Attendance';
        case 'assignments':
          return 'Assignments Management';
        case 'quizzes':
          return 'Quizzes Management';
        case 'progress':
          return 'Course Progress';
        case 'profile':
          return 'Profile';
        default:
          return '';
      }
    } else {
      switch (adminTab) {
        case 'trainers':
          return 'Manage Trainers';
        case 'studentProgress':
          return 'Student Progress Analytics';
        case 'activityLog':
          return 'Activity Logs';
        case 'profile':
          return 'Profile';
        default:
          return '';
      }
    }
  };

  const isProfileActive =
    (role === 'student' && studentTab === 'profile') ||
    (role === 'teacher' && teacherTab === 'profile') ||
    (role === 'admin' && adminTab === 'profile');

  const activeTitle = getActiveViewTitle();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Top View (Matching Image 2: User Avatar on Left) */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (role === 'student') setStudentTab('profile');
                if (role === 'teacher') setTeacherTab('profile');
                if (role === 'admin') setAdminTab('profile');
              }}
              className="relative p-0.5 focus:outline-hidden cursor-pointer"
              title="View Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            </button>
          </div>

          {/* Desktop Left: Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3 overflow-hidden">
            <nav className="flex items-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={handleHomeClick}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium cursor-pointer"
              >
                Home
              </button>

              {isProfileActive ? (
                <>
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                  <span className="text-slate-800 dark:text-slate-100 font-semibold">Profile</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[140px] sm:max-w-xs md:max-w-none">
                    {currentUser.course || 'Saylani Mass IT Training'}
                  </span>
                  {activeTitle && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{activeTitle}</span>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Controls: Moon Toggle + Feedback + Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick Role Switcher Pills (Desktop Only) */}
            <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl items-center gap-0.5 border border-slate-200/70 dark:border-slate-700">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Login as Student"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                onClick={() => setRole('teacher')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'teacher'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Login as Teacher"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Teacher</span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Login as Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Dark / Light Mode Toggle Button (Matching Image 2) */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Feedback Button (Matching Image 2) */}
            <button
              onClick={() => setFeedbackOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Feedback</span>
            </button>

            {/* Demo Reset button */}
            <button
              onClick={resetAllData}
              title="Reset Demo Data"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition hidden xl:flex"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
};
