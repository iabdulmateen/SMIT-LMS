import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { TeacherTab } from '../../context/LMSContext';
import {
  Users,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  MessageSquare,
  X,
} from 'lucide-react';

interface TeacherHeaderProps {
  rightAction?: React.ReactNode;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({ rightAction }) => {
  const { teacherTab, setTeacherTab, showToast } = useLMS();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const tabs: { id: TeacherTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'progress', label: 'Course Progress', icon: BarChart3 },
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Feedback submitted to SMIT Administration. Thank you!', 'success');
    setFeedbackText('');
    setFeedbackOpen(false);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Breadcrumb & Feedback Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          <span
            onClick={() => setTeacherTab('students')}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            Dashboard
          </span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            Modern Web Application Development
          </span>
        </div>

        <button
          id="btn-teacher-feedback"
          onClick={() => setFeedbackOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          Feedback
        </button>
      </div>

      {/* Course Heading & Right Action (Search/Filters on Students tab, etc.) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Modern Web Application Development
          </h1>
        </div>

        {rightAction && <div className="flex items-center gap-3">{rightAction}</div>}
      </div>

      {/* Subtabs Navigation Bar (Matching Screenshot 1:1) */}
      <div className="border-b border-slate-200 dark:border-slate-700/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = teacherTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-teacher-${tab.id}`}
                onClick={() => setTeacherTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-semibold transition-all relative border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/40 dark:bg-blue-950/20 rounded-t-lg'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Course Trainer Feedback
              </h3>
              <button
                onClick={() => setFeedbackOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit class feedback, curriculum notes, or infrastructure requests directly to SMIT academic coordinators.
            </p>
            <form onSubmit={handleSendFeedback} className="space-y-4">
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Type your feedback or report here..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
