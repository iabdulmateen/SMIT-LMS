import React, { useState, useRef, useEffect } from 'react';
import { useLMS, StudentTab, TeacherTab, AdminTab } from '../../context/LMSContext';
import { SmitLogo } from './SmitLogo';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileText,
  CheckSquare,
  Users,
  Award,
  ChevronLeft,
  X,
  UserCheck,
  GraduationCap,
  History,
  LogOut,
  User,
  Moon,
  Sun,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    role,
    currentUser,
    studentTab,
    setStudentTab,
    teacherTab,
    setTeacherTab,
    adminTab,
    setAdminTab,
    sidebarOpen,
    setSidebarOpen,
    isDarkMode,
    toggleDarkMode,
    logout,
  } = useLMS();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tabAction: () => void) => {
    tabAction();
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Student Navigation Links
  const studentNavItems: { id: StudentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'progress', label: 'Progress', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'assignment', label: 'Assignment', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: CheckSquare },
  ];

  // Teacher Navigation Links
  const teacherNavItems: { id: TeacherTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'students', label: 'Student', icon: Users },
    { id: 'attendance', label: 'Attendence', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
  ];

  // Admin Navigation Links
  const adminNavItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'trainers', label: 'Manage Trainers', icon: GraduationCap },
    { id: 'studentProgress', label: 'Student progress', icon: Award },
    { id: 'activityLog', label: 'Activity Log', icon: History },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <SmitLogo />
            {/* Collapse / Close button matching screenshot */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 sm:p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center flex-shrink-0"
              title="Close Sidebar"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Role Indicator Banner */}
          <div className="px-6 pt-4 pb-2">
            <div
              className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50'
                  : role === 'teacher'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                  : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {role === 'student' ? 'Student Portal' : role === 'teacher' ? 'Teacher Portal' : 'Admin Portal'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {role === 'student' &&
              studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = studentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(() => setStudentTab(item.id))}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold ring-1 ring-blue-600/20 dark:ring-blue-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            {role === 'teacher' &&
              teacherNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = teacherTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(() => setTeacherTab(item.id))}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold ring-1 ring-emerald-600/20 dark:ring-emerald-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

            {role === 'admin' &&
              adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(() => setAdminTab(item.id))}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-50/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 shadow-2xs font-semibold ring-1 ring-purple-600/20 dark:ring-purple-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Bottom Profile Footer with Clickable Popup (Matching Screenshot 1) */}
        <div ref={profileMenuRef} className="relative p-3 border-t border-slate-100 dark:border-slate-800">
          {/* PROFILE DROPDOWN POPUP (Matching Screenshot 1) */}
          {showProfileMenu && (
            <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* Option 1: Profile */}
              <button
                type="button"
                onClick={() => {
                  if (role === 'student') {
                    setStudentTab('profile');
                  }
                  setShowProfileMenu(false);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Profile</span>
              </button>

              {/* Option 2: Dark Mode */}
              <button
                type="button"
                onClick={() => {
                  toggleDarkMode();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition text-left cursor-pointer border-t border-slate-100 dark:border-slate-700/80"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                {isDarkMode && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                    ON
                  </span>
                )}
              </button>

              {/* Option 3: Log out */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition text-left cursor-pointer border-t border-slate-100 dark:border-slate-700/80"
              >
                <LogOut className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-rose-600" />
                <span>Log out</span>
              </button>
            </div>
          )}

          {/* Profile Trigger Button (Matching Screenshot 1) */}
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
              showProfileMenu
                ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-blue-500/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="text-xs font-bold text-[#1d5b94] dark:text-blue-400 uppercase tracking-tight truncate text-left pr-2">
              {currentUser.name}
            </span>
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900"></span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

