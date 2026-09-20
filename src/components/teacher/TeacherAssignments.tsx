import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment, Submission } from '../../types';
import { TeacherHeader } from './TeacherHeader';
import {
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Github,
  X,
  FileText,
  Search,
  CheckCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const TeacherAssignments: React.FC = () => {
  const { assignments, submissions, createAssignment, gradeSubmission, showToast } = useLMS();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<Assignment | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [feedbackText, setFeedbackText] = useState<string>('Great effort! Clean component structure.');
  const [searchFilter, setSearchFilter] = useState('');

  // Create Assignment Form State
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('Modern Front-End Development');
  const [course, setCourse] = useState('Modern Web Application Development');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [totalMarks, setTotalMarks] = useState(100);
  const [description, setDescription] = useState('');

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.module.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill all required fields.', 'warning');
      return;
    }

    createAssignment({
      title,
      module,
      course,
      dueDate,
      totalMarks,
      description,
      status: 'ACTIVE',
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleGrade = (status: 'APPROVED' | 'REJECTED') => {
    if (!activeSubmission) return;

    gradeSubmission(activeSubmission.id, status, gradeScore, feedbackText);
    setActiveSubmission(null);
  };

  const createAssignmentButton = (
    <div className="flex items-center gap-2">
      <div className="relative w-48 sm:w-60">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter assignments..."
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200"
        />
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Create Assignment</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <TeacherHeader rightAction={createAssignmentButton} />

      {/* Assignments Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700/70 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/40 dark:bg-slate-900/20">
              <tr>
                <th className="py-3.5 px-6">Assignment</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Due Date</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Total Marks</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-6 text-right sm:text-left whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
              {filteredAssignments.map((asg) => {
                const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
                const pendingCount = asgSubmissions.filter((s) => s.status === 'PENDING').length;

                return (
                  <tr
                    key={asg.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition"
                  >
                    {/* Assignment Title */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {asg.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {asgSubmissions.length} Submissions ({pendingCount} pending review)
                        </span>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {asg.module}
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {asg.dueDate}
                    </td>

                    {/* Total Marks */}
                    <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                      {asg.totalMarks} Pts
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {asg.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60 rounded text-[11px] font-bold uppercase tracking-wider">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 rounded text-[11px] font-bold uppercase tracking-wider">
                          CLOSED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      <div className="flex items-center gap-2 justify-end sm:justify-start">
                        <button
                          onClick={() => setSelectedAssignmentForReview(asg)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review ({asgSubmissions.length})</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submissions Review Modal */}
      {selectedAssignmentForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Assignment Submissions Desk
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedAssignmentForReview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {submissions.filter((s) => s.assignmentId === selectedAssignmentForReview.id).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No students have submitted solutions for this task yet.
                </div>
              ) : (
                submissions
                  .filter((s) => s.assignmentId === selectedAssignmentForReview.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            Student ID: {sub.studentId === 'std_01' ? 'Abdul Mateen (Roll: 777873)' : sub.studentId}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Submitted on {sub.submittedAt}
                          </p>
                        </div>
                        <span
                          className={`self-start px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : sub.status === 'REJECTED'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {sub.repoUrl && (
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                          >
                            <Github className="w-3.5 h-3.5" />
                            GitHub Repository
                          </a>
                        )}
                        {sub.liveUrl && (
                          <a
                            href={sub.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Deployment
                          </a>
                        )}
                      </div>

                      {sub.feedback && (
                        <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                          <strong>Trainer Feedback:</strong> {sub.feedback} ({sub.score}/{selectedAssignmentForReview.totalMarks} Marks)
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            setActiveSubmission(sub);
                            setGradeScore(sub.score || 85);
                            setFeedbackText(sub.feedback || 'Great work! Code is clean and functional.');
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                        >
                          Grade / Feedback
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grading Form Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Grade Submission
              </h3>
              <button
                onClick={() => setActiveSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Marks Awarded (Max 100)
                </label>
                <input
                  type="number"
                  value={gradeScore}
                  max={100}
                  min={0}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-base text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Trainer Remarks & Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Add constructive notes on code quality..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleGrade('REJECTED')}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold"
                >
                  Reject & Request Resubmission
                </button>
                <button
                  type="button"
                  onClick={() => handleGrade('APPROVED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Approve & Record Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Assignment
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Redux Toolkit Cart & Checkout Implementation"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Module
                  </label>
                  <input
                    type="text"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Problem Statement & Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe technical requirements, deliverables, and submission guidelines..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
