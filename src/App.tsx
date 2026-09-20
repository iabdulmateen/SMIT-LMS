/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileFooterNav } from './components/common/MobileFooterNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthPortal } from './components/auth/AuthPortal';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProgress } from './components/student/StudentProgress';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentQuizzes } from './components/student/StudentQuizzes';
import { StudentPayment } from './components/student/StudentPayment';
import { StudentProfile } from './components/student/StudentProfile';

// Teacher Components
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { TeacherAttendance } from './components/teacher/TeacherAttendance';
import { TeacherAssignments } from './components/teacher/TeacherAssignments';
import { TeacherQuizzes } from './components/teacher/TeacherQuizzes';
import { TeacherCourseProgress } from './components/teacher/TeacherCourseProgress';

// Admin Components
import { AdminManageTrainers } from './components/admin/AdminManageTrainers';
import { AdminStudentProgress } from './components/admin/AdminStudentProgress';
import { AdminActivityLog } from './components/admin/AdminActivityLog';

const MainLayout: React.FC = () => {
  const { isAuthenticated, role, studentTab, teacherTab, adminTab, sidebarOpen } = useLMS();

  // If not authenticated, display the exact login / register authentication portal from the screenshots
  if (!isAuthenticated) {
    return (
      <>
        <AuthPortal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width on desktop: w-64 when open, w-20 when collapsed) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* Top Sticky Navbar */}
        <Navbar />

        {/* Page Content Body (with bottom padding on mobile for footer nav) */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {/* Student Role Views */}
          {role === 'student' && (
            <div className="animate-in fade-in duration-200">
              {studentTab === 'dashboard' && <StudentDashboard />}
              {studentTab === 'profile' && <StudentProfile />}
              {studentTab === 'progress' && <StudentProgress />}
              {studentTab === 'attendance' && <StudentAttendance />}
              {studentTab === 'payment' && <StudentPayment />}
              {studentTab === 'assignment' && <StudentAssignments />}
              {studentTab === 'quiz' && <StudentQuizzes />}
            </div>
          )}

          {/* Teacher Role Views */}
          {role === 'teacher' && (
            <div className="animate-in fade-in duration-200">
              {teacherTab === 'students' && <TeacherStudents />}
              {teacherTab === 'attendance' && <TeacherAttendance />}
              {teacherTab === 'assignments' && <TeacherAssignments />}
              {teacherTab === 'quizzes' && <TeacherQuizzes />}
              {teacherTab === 'progress' && <TeacherCourseProgress />}
            </div>
          )}

          {/* Admin Role Views */}
          {role === 'admin' && (
            <div className="animate-in fade-in duration-200">
              {adminTab === 'trainers' && <AdminManageTrainers />}
              {adminTab === 'studentProgress' && <AdminStudentProgress />}
              {adminTab === 'activityLog' && <AdminActivityLog />}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Footer Navigation (All sidebar navigation on mobile) */}
      <MobileFooterNav />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <MainLayout />
    </LMSProvider>
  );
}
