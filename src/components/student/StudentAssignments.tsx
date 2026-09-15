import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment } from '../../types';
import { FileText, CheckCircle, Clock, Eye, Upload, Edit3, X, ExternalLink, Github, Globe } from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const { assignments, submissions, submitAssignment, currentUser, showToast } = useLMS();

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'submit' | 'edit' | null>(null);

  // Form states for submission
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const assignedCount = assignments.length;
  const submittedCount = assignments.filter((a) => a.status === 'APPROVED' || a.status === 'SUBMITTED' || a.status === 'LATE SUBMITTED').length;
  const pendingCount = assignments.filter((a) => a.status === 'NOT SUBMITTED').length;

  const handleOpenModal = (assignment: Assignment, mode: 'view' | 'submit' | 'edit') => {
    setSelectedAssignment(assignment);
    setModalMode(mode);

    // Pre-populate if student already has a submission
    const existingSub = submissions.find((s) => s.assignmentId === assignment.id && s.studentId === currentUser.id);
    if (existingSub) {
      setRepoUrl(existingSub.repoUrl || '');
      setLiveUrl(existingSub.liveUrl || '');
      setRemarks(existingSub.remarks || '');
    } else {
      setRepoUrl('');
      setLiveUrl('');
      setRemarks('');
    }
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setModalMode(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!repoUrl.trim() && !liveUrl.trim()) {
      showToast('Please provide at least a GitHub repository or live URL.', 'warning');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitAssignment(selectedAssignment.id, repoUrl, liveUrl, remarks);
      setSubmitting(false);
      handleCloseModal();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Assigned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{assignedCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Assigned</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{submittedCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Submitted</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{pendingCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Pending</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Assignment Table (Matching Screenshot 4) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/50">
              <tr>
                <th className="py-4 px-6">Assignment</th>
                <th className="py-4 px-4">Topics</th>
                <th className="py-4 px-4">Due Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignments.map((asg) => {
                const existingSub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);

                return (
                  <tr key={asg.id} className="hover:bg-slate-50/50 transition group">
                    {/* Assignment Title & Hackathon Tag */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-semibold ${asg.isHackathon ? 'text-purple-900' : 'text-slate-800'}`}>
                          {asg.title}
                        </span>
                        {asg.isHackathon && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold tracking-wider">
                            HACKATHON
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Topics Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        {asg.topicTag || `${asg.topicsCount} Topics`}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {asg.dueDate}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {asg.status === 'APPROVED' && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          APPROVED
                        </span>
                      )}
                      {asg.status === 'SUBMITTED' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          SUBMITTED
                        </span>
                      )}
                      {asg.status === 'LATE SUBMITTED' && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          LATE SUBMITTED
                        </span>
                      )}
                      {asg.status === 'NOT SUBMITTED' && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          NOT SUBMITTED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      {asg.submissionsClosed ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(asg, 'view')}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <span className="text-rose-500 italic text-xs font-medium">
                            Submissions closed
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(asg, 'view')}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(asg, 'submit')}
                            className="p-1 text-slate-400 hover:text-emerald-600 transition"
                            title="Submit Assignment"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          {existingSub && (
                            <button
                              onClick={() => handleOpenModal(asg, 'edit')}
                              className="p-1 text-slate-400 hover:text-amber-600 transition"
                              title="Edit Submission"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View / Submit / Edit Modal */}
      {modalMode && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {modalMode === 'view' ? 'Assignment Details' : modalMode === 'submit' ? 'Submit Assignment' : 'Edit Submission'}
                </span>
                <h3 className="text-base font-bold text-slate-800 truncate max-w-md">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-100">
                <p className="font-semibold text-slate-900 mb-1">Instructions:</p>
                <p>{selectedAssignment.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
                  <span><strong>Due Date:</strong> {selectedAssignment.dueDate}</span>
                  <span><strong>Course:</strong> {selectedAssignment.course}</span>
                </div>
              </div>

              {/* View Mode Submission Info if exists */}
              {modalMode === 'view' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Your Submission Status
                  </h4>
                  {submissions.filter((s) => s.assignmentId === selectedAssignment.id && s.studentId === currentUser.id).length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-800">
                      You haven't submitted this assignment yet. Click the submit icon to upload your work before the deadline.
                    </div>
                  ) : (
                    submissions
                      .filter((s) => s.assignmentId === selectedAssignment.id && s.studentId === currentUser.id)
                      .map((sub) => (
                        <div key={sub.id} className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">Submitted on {sub.submittedAt}</span>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">
                              {sub.status}
                            </span>
                          </div>
                          {sub.repoUrl && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Github className="w-3.5 h-3.5" />
                              <a href={sub.repoUrl} target="_blank" rel="noreferrer" className="underline truncate">
                                {sub.repoUrl}
                              </a>
                            </div>
                          )}
                          {sub.liveUrl && (
                            <div className="flex items-center gap-2 text-emerald-600">
                              <Globe className="w-3.5 h-3.5" />
                              <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="underline truncate">
                                {sub.liveUrl}
                              </a>
                            </div>
                          )}
                          {sub.score !== undefined && (
                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <span className="font-bold text-slate-800">Grade: {sub.score}/100</span>
                              {sub.feedback && <p className="text-slate-600 italic mt-0.5">Trainer Feedback: "{sub.feedback}"</p>}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* Submission Form */}
              {(modalMode === 'submit' || modalMode === 'edit') && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      GitHub Repository URL *
                    </label>
                    <div className="relative">
                      <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Live Demo / Deployment URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://my-app.vercel.app"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Remarks / Notes for Trainer
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Mention any bonus challenges completed or special notes..."
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Submission'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
