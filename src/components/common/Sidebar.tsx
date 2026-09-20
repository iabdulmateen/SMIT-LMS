import React, { useState, useRef, useEffect } from 'react';
import { useLMS, StudentTab, TeacherTab, AdminTab } from '../../context/LMSContext';
import { SmitLogo } from './SmitLogo';
import {
  LayoutDashboard,
  LayoutGrid,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Wallet,
  FileText,
  CheckSquare,
  ClipboardCheck,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
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

  // Student Navigation Links (using LayoutGrid & Wallet to match Screenshot 2)
  const studentNavItems: { id: StudentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'progress', label: 'Progress', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'payment', label: 'Payment', icon: Wallet },
    { id: 'assignment', label: 'Assignment', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: ClipboardCheck },
  ];

  // Teacher Navigation Links
  const teacherNavItems: { id: TeacherTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'progress', label: 'Course Progress', icon: BookOpen },
  ];

  // Admin Navigation Links
  const adminNavItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'trainers', label: 'Manage Trainers', icon: GraduationCap },
    { id: 'studentProgress', label: 'Student progress', icon: Award },
    { id: 'activityLog', label: 'Activity Log', icon: History },
  ];

  const getActiveItems = () => {
    if (role === 'student') {
      return studentNavItems.map((item) => ({
        ...item,
        isActive: studentTab === item.id,
        onClick: () => handleNavClick(() => setStudentTab(item.id)),
      }));
    }
    if (role === 'teacher') {
      return teacherNavItems.map((item) => ({
        ...item,
        isActive: teacherTab === item.id,
        onClick: () => handleNavClick(() => setTeacherTab(item.id)),
      }));
    }
    return adminNavItems.map((item) => ({
      ...item,
      isActive: adminTab === item.id,
      onClick: () => handleNavClick(() => setAdminTab(item.id)),
    }));
  };

  const currentNavItems = getActiveItems();

  return (
    <>
      {/* Sidebar Container (Desktop Only, Mobile uses Bottom Footer Navigation) */}
      <aside
        className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col justify-between transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Top Header & Logo / Expand Button */}
        <div>
          {sidebarOpen ? (
            /* Expanded Top Header */
            <div className="h-16 px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <SmitLogo />
              {/* Collapse button matching Screenshot 1 */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center flex-shrink-0"
                title="Collapse Sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Collapsed Top Header (Matching Screenshot 2) */
            <div className="h-16 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="w-9 h-9 rounded-full border-2 border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition shadow-2xs cursor-pointer group"
                title="Expand Sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5] text-slate-800 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className={`py-4 ${sidebarOpen ? 'px-3 space-y-1' : 'px-2 flex flex-col items-center space-y-3'}`}>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const { isActive, label, id, onClick } = item;

              if (!sidebarOpen) {
                /* Collapsed Icon-Only Mode (Matching Screenshot 2) */
                return (
                  <button
                    key={id}
                    onClick={onClick}
                    title={label}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-blue-50/90 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-2xs ring-1 ring-blue-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                    {/* Hover Tooltip in collapsed view */}
                    <span className="sr-only">{label}</span>
                  </button>
                );
              }

              /* Expanded View (Matching Screenshot 1) */
              return (
                <button
                  key={id}
                  onClick={onClick}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold ring-1 ring-blue-600/20 dark:ring-blue-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 stroke-[2] ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer with Clickable Popup (Matching Screenshot 1 & 2) */}
        <div ref={profileMenuRef} className={`relative border-t border-slate-100 dark:border-slate-800 ${sidebarOpen ? 'p-3' : 'p-2 py-4 flex justify-center'}`}>
          {/* PROFILE DROPDOWN POPUP */}
          {showProfileMenu && (
            <div
              className={`absolute bottom-16 ${
                sidebarOpen ? 'left-3 right-3' : 'left-3 w-56'
              } bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150`}
            >
              {/* Option 1: Profile */}
              <button
                type="button"
                onClick={() => {
                  if (role === 'student') setStudentTab('profile');
                  if (role === 'teacher') setTeacherTab('profile');
                  if (role === 'admin') setAdminTab('profile');
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

          {/* Profile Trigger Button */}
          {sidebarOpen ? (
            /* Expanded profile view */
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
          ) : (
            /* Collapsed profile view (Matching Screenshot 2 bottom avatar) */
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="relative p-1 rounded-full hover:ring-2 hover:ring-blue-500/30 transition cursor-pointer flex items-center justify-center"
              title={currentUser.name}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

