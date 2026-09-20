import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Quiz, QuizQuestion } from '../../types';
import { TeacherHeader } from './TeacherHeader';
import {
  Plus,
  Eye,
  FileText,
  ToggleLeft,
  ToggleRight,
  X,
  Clock,
  CheckCircle,
  Users,
  Award,
} from 'lucide-react';

export const TeacherQuizzes: React.FC = () => {
  const { quizzes, quizResults, createQuiz, toggleQuizStatus, showToast } = useLMS();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuizDetails, setSelectedQuizDetails] = useState<Quiz | null>(null);
  const [selectedQuizSubmissions, setSelectedQuizSubmissions] = useState<Quiz | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('Modern Front-End Development');
  const [course, setCourse] = useState('Modern Web Application Development');
  const [coursesList, setCoursesList] = useState(
    'Modern Web Application Development, Web and Mobile App Development'
  );
  const [questionsCount, setQuestionsCount] = useState(40);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [date, setDate] = useState('Jun 24, 2026');
  const [expiryDate, setExpiryDate] = useState('Jun 24, 2026');
  const [sampleQuestion, setSampleQuestion] = useState({
    question: 'What is the purpose of the key prop in React lists?',
    options: [
      'To give CSS unique class styles',
      'To help React identify which items have changed, been added, or removed',
      'To encrypt state values',
      'To link external scripts',
    ],
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
        id: `q_cust_${Date.now()}_1`,
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
      {
        id: `q_cust_${Date.now()}_3`,
        question: 'How do you pass data from a parent to a child component in React?',
        options: ['Via props', 'Via window variables', 'Via HTML attributes only', 'Via CSS classes'],
        correctAnswer: 0,
      },
    ];

    createQuiz({
      title,
      module,
      course,
      coursesList,
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

  const createButton = (
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Create Quiz</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <TeacherHeader rightAction={createButton} />

      {/* Quizzes Table (Matching Screenshot 3 1:1) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700/70 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/40 dark:bg-slate-900/20">
              <tr>
                <th className="py-3.5 px-6">Quiz</th>
                <th className="py-3.5 px-4 min-w-[240px]">Course(s)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Expiry</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-6 text-right sm:text-left whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
              {quizzes.map((quiz) => {
                const resultsForThisQuiz = quizResults.filter((r) => r.quizId === quiz.id);

                return (
                  <tr
                    key={quiz.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition"
                  >
                    {/* Quiz Title */}
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {quiz.title}
                    </td>

                    {/* Course(s) Column (Matching screenshot 3 list of assigned courses) */}
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
                      {quiz.coursesList || quiz.course}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      {quiz.date}
                    </td>

                    {/* Expiry */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      {quiz.expiryDate}
                    </td>

                    {/* Status Pill: ACTIVE (Matching Screenshot 3) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {quiz.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60 rounded text-[11px] font-bold uppercase tracking-wider">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 rounded text-[11px] font-bold uppercase tracking-wider">
                          EXPIRED
                        </span>
                      )}
                    </td>

                    {/* Action Icons (Matching Screenshot 3: Status switch, Submissions list icon, Eye preview icon) */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      <div className="flex items-center gap-2.5 justify-end sm:justify-start">
                        {/* Status Toggle Switch */}
                        <button
                          onClick={() => toggleQuizStatus(quiz.id)}
                          className={`p-1 transition ${
                            quiz.status === 'ACTIVE'
                              ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={`Toggle Quiz Status (Currently ${quiz.status})`}
                        >
                          {quiz.status === 'ACTIVE' ? (
                            <ToggleRight className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 stroke-[2.5]" />
                          )}
                        </button>

                        {/* Submissions / Results Report Icon */}
                        <button
                          onClick={() => setSelectedQuizSubmissions(quiz)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          title="View Student Results"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Eye Preview Icon */}
                        <button
                          onClick={() => setSelectedQuizDetails(quiz)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                          title="Preview Questions"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Quiz Preview Modal */}
      {selectedQuizDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Quiz Preview & Config
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedQuizDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Time Allowed</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">
                    {selectedQuizDetails.durationMinutes} Minutes
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Total Questions</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">
                    {selectedQuizDetails.questionsCount} Questions
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Sample Questions Pool
                </h4>
                <div className="space-y-3">
                  {selectedQuizDetails.questions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Q{qIndex + 1}: {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border text-[11px] font-medium ${
                              oIdx === q.correctAnswer
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctAnswer && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Submissions Modal */}
      {selectedQuizSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Student Results: {selectedQuizSubmissions.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Passing threshold: 60% | Max Attempts: {selectedQuizSubmissions.maxAttempts}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuizSubmissions(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {quizResults.filter((r) => r.quizId === selectedQuizSubmissions.id).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No student submission records logged for this quiz paper yet.
                </div>
              ) : (
                quizResults
                  .filter((r) => r.quizId === selectedQuizSubmissions.id)
                  .map((res) => (
                    <div
                      key={res.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Student Roll: {res.studentId === 'std_01' ? 'Abdul Mateen (777873)' : res.studentId}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Attempts: {res.attemptsUsed}/{res.maxAttempts} | Completed: {res.completedAt || 'Recently'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold text-sm ${
                            res.scorePercentage >= 60 ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {res.scorePercentage}%
                        </span>
                        <p className="text-[10px] uppercase font-bold text-slate-500">{res.status}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQuizSubmissions(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Publish New Quiz Assessment
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Javascript (Quiz-5)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Target Course(s)
                </label>
                <input
                  type="text"
                  value={coursesList}
                  onChange={(e) => setCoursesList(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    value={questionsCount}
                    onChange={(e) => setQuestionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
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
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
