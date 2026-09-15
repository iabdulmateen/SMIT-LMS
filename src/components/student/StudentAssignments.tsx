import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment } from '../../types';
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Upload,
  Edit3,
  X,
  Github,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const { assignments, submissions, submitAssignment, currentUser, showToast } = useLMS();

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'submit' | 'edit' | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'SUBMITTED' | 'LATE SUBMITTED' | 'NOT SUBMITTED'>('ALL');

  // Pagination (Default 6 items per page matching SMIT portal UI in screenshot)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Form states for submission
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const assignedCount = assignments.length;
  const submittedCount = assignments.filter(
    (a) => a.status === 'APPROVED' || a.status === 'SUBMITTED' || a.status === 'LATE SUBMITTED'
  ).length;
  const pendingCount = assignments.filter((a) => a.status === 'NOT SUBMITTED').length;

  const handleOpenModal = (assignment: Assignment, mode: 'view' | 'submit' | 'edit') => {
    setSelectedAssignment(assignment);
    setModalMode(mode);

    // Pre-populate if student already has a submission
    const existingSub = submissions.find(
      (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
    );
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
      showToast('Assignment submitted successfully!', 'success');
    }, 500);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Feedback submitted to SMIT course instructors. Thank you!', 'success');
    setFeedbackText('');
    setFeedbackModalOpen(false);
  };

  // Filtered & Paginated Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      const matchesSearch =
        asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asg.topicTag && asg.topicTag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || asg.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchQuery, statusFilter]);

  const totalRecords = filteredAssignments.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = filteredAssignments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs (Matching screenshot 1:1) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          <span className="hover:text-blue-600 transition cursor-pointer">Home</span>
          <span>&gt;</span>
          <span className="hover:text-blue-600 transition cursor-pointer truncate max-w-[200px] sm:max-w-none">
            Modern Web Application Development
          </span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Assignment</span>
        </div>

        <button
          id="btn-assignment-feedback"
          onClick={() => setFeedbackModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition self-start sm:self-auto shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          Feedback
        </button>
      </div>

      {/* Top 3 Stat Cards (Matching Screenshot 1:1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Assigned */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition hover:shadow-xs">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {assignedCount}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Assigned</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition hover:shadow-xs">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {submittedCount}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Submitted</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition hover:shadow-xs">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {pendingCount}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Pending</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-assignment-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search assignments by title or topic..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {(['ALL', 'APPROVED', 'SUBMITTED', 'LATE SUBMITTED', 'NOT SUBMITTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {status === 'ALL' ? 'All Assignments' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Table (Matching Screenshot 1:1) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700/70 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
              <tr>
                <th className="py-4 px-6">Assignment</th>
                <th className="py-4 px-4">Topics</th>
                <th className="py-4 px-4">Due Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No assignments found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentRecords.map((asg) => {
                  const existingSub = submissions.find(
                    (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
                  );

                  return (
                    <tr
                      key={asg.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition group"
                    >
                      {/* Assignment Title & Hackathon Tag */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-semibold ${
                              asg.isHackathon
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {asg.title}
                          </span>
                          {asg.isHackathon && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold tracking-wider border border-purple-200 dark:border-purple-800/60">
                              HACKATHON
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Topics Badge (Exact blue pill in screenshot) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                          {asg.topicTag || (asg.topicsCount > 0 ? `${asg.topicsCount} Topics` : 'No topics')}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                        {asg.dueDate}
                      </td>

                      {/* Status Pill (Exact match to screenshot) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {asg.status === 'APPROVED' && (
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-md font-bold text-[11px] uppercase tracking-wider">
                            APPROVED
                          </span>
                        )}
                        {asg.status === 'SUBMITTED' && (
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-md font-bold text-[11px] uppercase tracking-wider">
                            SUBMITTED
                          </span>
                        )}
                        {asg.status === 'LATE SUBMITTED' && (
                          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-md font-bold text-[11px] uppercase tracking-wider">
                            LATE SUBMITTED
                          </span>
                        )}
                        {asg.status === 'NOT SUBMITTED' && (
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-md font-bold text-[11px] uppercase tracking-wider">
                            NOT SUBMITTED
                          </span>
                        )}
                      </td>

                      {/* Action Icons (Eye, Upload, Pencil) */}
                      <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                        {asg.submissionsClosed ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(asg, 'view')}
                              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
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
                              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenModal(asg, 'submit')}
                              className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                              title="Submit Assignment"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            {existingSub && (
                              <button
                                onClick={() => handleOpenModal(asg, 'edit')}
                                className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination (Exact match to screenshot: Showing X-Y of Z records + Prev/Next/Page pills) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/20">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200 font-semibold">{totalRecords === 0 ? 0 : startIndex + 1}-{endIndex}</strong> of{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{totalRecords}</strong> records
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 focus:outline-none"
            >
              <option value={6}>6 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View / Submit / Edit Modal */}
      {modalMode && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {modalMode === 'view'
                    ? 'Assignment Details'
                    : modalMode === 'submit'
                    ? 'Submit Assignment'
                    : 'Edit Submission'}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-md">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-700/60">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Instructions:</p>
                <p>{selectedAssignment.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    <strong>Due Date:</strong> {selectedAssignment.dueDate}
                  </span>
                  <span>
                    <strong>Course:</strong> {selectedAssignment.course}
                  </span>
                </div>
              </div>

              {/* View Mode Submission Info if exists */}
              {modalMode === 'view' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Your Submission Status
                  </h4>
                  {submissions.filter(
                    (s) => s.assignmentId === selectedAssignment.id && s.studentId === currentUser.id
                  ).length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                      You haven't submitted this assignment yet. Click the submit icon to upload your work before the deadline.
                    </div>
                  ) : (
                    submissions
                      .filter(
                        (s) => s.assignmentId === selectedAssignment.id && s.studentId === currentUser.id
                      )
                      .map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-700/60 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Submitted on {sub.submittedAt}
                            </span>
                            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold rounded-md border border-emerald-200 dark:border-emerald-800">
                              {sub.status}
                            </span>
                          </div>
                          {sub.repoUrl && (
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <Github className="w-3.5 h-3.5" />
                              <a
                                href={sub.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline truncate"
                              >
                                {sub.repoUrl}
                              </a>
                            </div>
                          )}
                          {sub.liveUrl && (
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                              <Globe className="w-3.5 h-3.5" />
                              <a
                                href={sub.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline truncate"
                              >
                                {sub.liveUrl}
                              </a>
                            </div>
                          )}
                          {sub.score !== undefined && (
                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <span className="font-bold text-slate-800 dark:text-slate-100">
                                Grade: {sub.score}/100
                              </span>
                              {sub.feedback && (
                                <p className="text-slate-600 dark:text-slate-400 italic mt-0.5">
                                  Trainer Feedback: "{sub.feedback}"
                                </p>
                              )}
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      GitHub Repository URL *
                    </label>
                    <div className="relative">
                      <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Live Demo / Deployment URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://my-app.vercel.app"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Remarks / Notes for Trainer
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Mention any bonus challenges completed or special notes..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
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

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Course Feedback
              </h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share your thoughts, suggestions, or issues regarding assignments and lectures with the course instructors.
            </p>
            <form onSubmit={handleSendFeedback} className="space-y-4">
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
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
