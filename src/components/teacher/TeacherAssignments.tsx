import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment, Submission } from '../../types';
import { FileText, Plus, Eye, Edit, Trash2, X, CheckCircle, Github, Globe, Star } from 'lucide-react';

export const TeacherAssignments: React.FC = () => {
  const {
    assignments,
    submissions,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    gradeSubmission,
    showToast,
  } = useLMS();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedSubmissionsAssignment, setSelectedSubmissionsAssignment] = useState<Assignment | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: 'Modern Web Application Development',
    batch: 'Batch-20',
    topicsCount: 5,
    topicTag: '5 Topics',
    dueDate: 'October 15, 2026',
    isHackathon: false,
  });

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      course: 'Modern Web Application Development',
      batch: 'Batch-20',
      topicsCount: 5,
      topicTag: '5 Topics',
      dueDate: 'October 15, 2026',
      isHackathon: false,
    });
    setEditingAssignment(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      title: asg.title,
      description: asg.description,
      course: asg.course,
      batch: asg.batch,
      topicsCount: asg.topicsCount,
      topicTag: asg.topicTag || `${asg.topicsCount} Topics`,
      dueDate: asg.dueDate,
      isHackathon: !!asg.isHackathon,
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Please fill in title and description', 'warning');
      return;
    }

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        ...formData,
        topicTag: formData.topicsCount > 0 ? `${formData.topicsCount} Topics` : 'No topics',
      });
    } else {
      createAssignment({
        ...formData,
        topicTag: formData.topicsCount > 0 ? `${formData.topicsCount} Topics` : 'No topics',
        submissionsClosed: false,
      });
    }
    setIsCreateModalOpen(false);
  };

  const handleOpenGrade = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score || 90);
    setGradeFeedback(sub.feedback || '');
  };

  const handleConfirmGrade = (status: 'APPROVED' | 'REJECTED') => {
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, status, gradeScore, gradeFeedback);
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assignments Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create tasks, set due dates, and evaluate student code submissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignments Table (Matching prompt: Title, Description, Topics, Due date, Action [View and edit]) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4">Topics</th>
                <th className="py-4 px-4">Due Date</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignments.map((asg) => {
                const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);

                return (
                  <tr key={asg.id} className="hover:bg-slate-50/50 transition">
                    {/* Title */}
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{asg.title}</span>
                        {asg.isHackathon && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">
                            HACKATHON
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 text-slate-600 max-w-sm truncate">
                      {asg.description}
                    </td>

                    {/* Topics */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        {asg.topicTag || `${asg.topicsCount} Topics`}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                      {asg.dueDate}
                    </td>

                    {/* Action: View and edit, Submissions, Delete */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSubmissionsAssignment(asg)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="View Student Submissions"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Submissions ({asgSubmissions.length})</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(asg)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit Assignment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAssignment(asg.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">
                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next.js Full Stack Blog System"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Description & Requirements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide comprehensive requirements, repository structure expectations..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Number of Topics
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.topicsCount}
                    onChange={(e) => setFormData({ ...formData, topicsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Due Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="e.g. October 20, 2026"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHackathon"
                  checked={formData.isHackathon}
                  onChange={(e) => setFormData({ ...formData, isHackathon: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <label htmlFor="isHackathon" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Mark as Hackathon Assignment
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                >
                  {editingAssignment ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Review Modal */}
      {selectedSubmissionsAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Review Submissions
                </span>
                <h3 className="font-bold text-slate-800 text-base">
                  {selectedSubmissionsAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmissionsAssignment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {submissions.filter((s) => s.assignmentId === selectedSubmissionsAssignment.id).length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No submissions uploaded by students for this assignment yet.
                </div>
              ) : (
                submissions
                  .filter((s) => s.assignmentId === selectedSubmissionsAssignment.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{sub.studentName}</p>
                          <p className="text-xs text-slate-400 font-mono">Roll: {sub.rollNumber} • Submitted: {sub.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                          <button
                            onClick={() => handleOpenGrade(sub)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                          >
                            Grade & Feedback
                          </button>
                        </div>
                      </div>

                      {/* Links & remarks */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        {sub.repoUrl && (
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>GitHub Code</span>
                          </a>
                        )}
                        {sub.liveUrl && (
                          <a
                            href={sub.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-emerald-600 hover:underline font-medium"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>

                      {sub.remarks && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                          "{sub.remarks}"
                        </p>
                      )}

                      {sub.score !== undefined && (
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-2 pt-1">
                          <span>Grade Awarded: {sub.score}/100</span>
                          {sub.feedback && <span className="text-slate-500 font-normal">| Feedback: {sub.feedback}</span>}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grade Submission Dialog */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Grade Submission: {gradingSubmission.studentName}
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Score Percentage (0 - 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Instructor Feedback
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="e.g. Well organized component hierarchy and excellent responsive design."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleConfirmGrade('REJECTED')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
              >
                Reject / Needs Revision
              </button>
              <button
                type="button"
                onClick={() => handleConfirmGrade('APPROVED')}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
              >
                Approve & Record Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
