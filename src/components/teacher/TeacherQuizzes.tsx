import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Quiz, QuizQuestion } from '../../types';
import { CheckSquare, Plus, Eye, Edit, Trash2, X, CheckCircle, Clock } from 'lucide-react';

export const TeacherQuizzes: React.FC = () => {
  const { quizzes, quizResults, createQuiz, showToast } = useLMS();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuizDetails, setSelectedQuizDetails] = useState<Quiz | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('Modern Front-End Development');
  const [course, setCourse] = useState('Modern Web Application Development');
  const [questionsCount, setQuestionsCount] = useState(40);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [date, setDate] = useState('Sep 20, 2026');
  const [expiryDate, setExpiryDate] = useState('Oct 10, 2026');
  const [sampleQuestion, setSampleQuestion] = useState({
    question: 'What is the purpose of the key prop in React lists?',
    options: ['To give CSS unique class styles', 'To help React identify which items have changed, been added, or removed', 'To encrypt state values', 'To link external scripts'],
    correctAnswer: 1,
  });

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a quiz title.', 'warning');
      return;
    }

    const newQuizQuestions: QuizQuestion[] = [
      {
        id: `q_cust_${Date.now()}`,
        question: sampleQuestion.question,
        options: sampleQuestion.options,
        correctAnswer: sampleQuestion.correctAnswer,
      },
      {
        id: `q_cust_${Date.now()}_2`,
        question: 'Which CSS property defines flex items growing capability?',
        options: ['flex-basis', 'flex-shrink', 'flex-grow', 'flex-flow'],
        correctAnswer: 2,
      },
    ];

    createQuiz({
      title,
      module,
      course,
      questionsCount,
      durationMinutes,
      maxAttempts: 3,
      date,
      expiryDate,
      status: 'ACTIVE',
      questions: newQuizQuestions,
    });

    setIsCreateModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quizzes Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure examination papers, timers, question pools, and view batch performance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes Table (Matching Prompt: Quize, Course, Date, expiry, Status, Action) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Quize</th>
                <th className="py-4 px-4">Course</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Expiry</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {quizzes.map((quiz) => {
                const totalAttempts = quizResults.filter((r) => r.quizId === quiz.id).length;

                return (
                  <tr key={quiz.id} className="hover:bg-slate-50/50 transition">
                    {/* Quize Title & Module */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-900">{quiz.title}</p>
                        <p className="text-xs text-slate-500">{quiz.module} ({quiz.questionsCount} Qs)</p>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {quiz.course}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {quiz.date}
                    </td>

                    {/* Expiry */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {quiz.expiryDate}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {quiz.status === 'ACTIVE' && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          ACTIVE
                        </span>
                      )}
                      {quiz.status === 'EXPIRED' && (
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          EXPIRED
                        </span>
                      )}
                      {quiz.status === 'DRAFT' && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          DRAFT
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQuizDetails(quiz)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="View Questions & Results"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Results ({totalAttempts})</span>
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

      {/* Create Quiz Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">Create New Quiz</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js App Router (Quiz-5)"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Course Module
                  </label>
                  <input
                    type="text"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    value={questionsCount}
                    onChange={(e) => setQuestionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-700">Sample MCQ Preview</p>
                <input
                  type="text"
                  value={sampleQuestion.question}
                  onChange={(e) => setSampleQuestion({ ...sampleQuestion, question: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white"
                />
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
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Details & Result Breakdown Modal */}
      {selectedQuizDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{selectedQuizDetails.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedQuizDetails.module} • {selectedQuizDetails.questionsCount} Questions • Duration: {selectedQuizDetails.durationMinutes} mins
                </p>
              </div>
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Question Bank Preview
              </h4>
              <div className="space-y-3">
                {selectedQuizDetails.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <p className="font-semibold text-slate-800 mb-2">
                      Q{idx + 1}: {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg ${
                            oIdx === q.correctAnswer
                              ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
