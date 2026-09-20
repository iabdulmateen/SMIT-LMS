import React from 'react';
import { useLMS, StudentTab, TeacherTab, AdminTab } from '../../context/LMSContext';
import {
  Home,
  LayoutGrid,
  Wallet,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  History,
  FileText,
  ClipboardCheck,
} from 'lucide-react';

export const MobileFooterNav: React.FC = () => {
  const {
    role,
    studentTab,
    setStudentTab,
    teacherTab,
    setTeacherTab,
    adminTab,
    setAdminTab,
  } = useLMS();

  // If Student: EXACTLY 5 ITEMS matching Image 1
  // 1. Home, 2. Dashboard (elevated center/accent), 3. Payment, 4. Quiz, 5. Progress
  // Note: Attendance & Assignment stay on top of the dashboard cards as requested.
  if (role === 'student') {
    const isHome = studentTab === 'dashboard';
    const isDashboard = studentTab === 'dashboard';
    const isPayment = studentTab === 'payment';
    const isQuiz = studentTab === 'quiz';
    const isProgress = studentTab === 'progress';

    return (
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden transition-colors"
      >
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => setStudentTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isHome && !isPayment && !isQuiz && !isProgress
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="p-1 rounded-lg">
              <Home className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5 select-none">
              Home
            </span>
          </button>

          {/* 2. Dashboard */}
          <button
            type="button"
            onClick={() => setStudentTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isDashboard
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isDashboard ? 'bg-blue-50 dark:bg-blue-900/40' : ''
              }`}
            >
              <LayoutGrid className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5 select-none">
              Dashboard
            </span>
          </button>

          {/* 3. Payment */}
          <button
            type="button"
            onClick={() => setStudentTab('payment')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isPayment
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="p-1 rounded-lg">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5 select-none">
              Payment
            </span>
          </button>

          {/* 4. Quiz */}
          <button
            type="button"
            onClick={() => setStudentTab('quiz')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isQuiz
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="p-1 rounded-lg">
              <GraduationCap className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5 select-none">
              Quiz
            </span>
          </button>

          {/* 5. Progress */}
          <button
            type="button"
            onClick={() => setStudentTab('progress')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isProgress
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="p-1 rounded-lg">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5 select-none">
              Progress
            </span>
          </button>
        </div>
      </nav>
    );
  }

  // Teacher 5 Mobile Items
  if (role === 'teacher') {
    const teacherItems: { id: TeacherTab; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'students', label: 'Students', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: Award },
      { id: 'assignments', label: 'Assignments', icon: FileText },
      { id: 'quizzes', label: 'Quizzes', icon: ClipboardCheck },
      { id: 'progress', label: 'Progress', icon: BookOpen },
    ];

    return (
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden transition-colors"
      >
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          {teacherItems.map((item) => {
            const Icon = item.icon;
            const isActive = teacherTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTeacherTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="p-1 rounded-lg">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] leading-tight tracking-tight mt-0.5 truncate select-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Admin Mobile Items
  const adminItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'trainers', label: 'Trainers', icon: Users },
    { id: 'studentProgress', label: 'Progress', icon: Award },
    { id: 'activityLog', label: 'Activity', icon: History },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden transition-colors"
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAdminTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="p-1 rounded-lg">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5 truncate select-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
