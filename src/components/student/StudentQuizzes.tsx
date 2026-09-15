import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Quiz } from '../../types';
import { AlertTriangle, Clock, CheckCircle2, XCircle, Play, X, ArrowRight, Check } from 'lucide-react';

export const StudentQuizzes: React.FC = () => {
  const { quizzes, quizResults, submitQuizAttempt, currentUser } = useLMS();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [lastScorePercentage, setLastScorePercentage] = useState<number>(0);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsQuizCompleted(false);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    const questions = activeQuiz.questions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 85;
    setLastScorePercentage(percentage);
    setIsQuizCompleted(true);
    submitQuizAttempt(activeQuiz.id, percentage);
  };

  const handleCloseQuizModal = () => {
    setActiveQuiz(null);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Important Information Warning Box (Matching Screenshot 5) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-slate-700" />
          <h3>Important Information</h3>
        </div>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
          <li>Once started, quizzes must be completed in one session</li>
          <li>Switching tabs or leaving the window will be recorded</li>
          <li>Ensure you have a stable internet connection</li>
          <li>The quiz will open in fullscreen mode</li>
        </ul>
      </div>

      {/* Quizzes Table (Matching Screenshot 5) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/50">
              <tr>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-4">Module</th>
                <th className="py-4 px-4 text-center">Questions</th>
                <th className="py-4 px-4 text-center">Attempts</th>
                <th className="py-4 px-4 text-center">Percentage</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Note</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {quizzes.map((quiz) => {
                const result = quizResults.find(
                  (r) => r.quizId === quiz.id && r.studentId === currentUser.id
                );
                const attemptsUsed = result ? result.attemptsUsed : 0;
                const maxAttempts = quiz.maxAttempts || 3;
                const percentage = result ? result.scorePercentage : null;
                const isPassed = result?.status === 'PASSED';
                const hasAttemptsLeft = attemptsUsed < maxAttempts;

                return (
                  <tr key={quiz.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">
                      {quiz.title}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      {quiz.module}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-800">
                      {quiz.questionsCount}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-xs ${
                          attemptsUsed >= 2 ? 'text-rose-600 bg-rose-50' : 'text-slate-700'
                        }`}
                      >
                        {attemptsUsed}/{maxAttempts}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-800">
                      {percentage !== null ? `${percentage}%` : '–'}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isPassed ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          PASSED
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {result?.note || '–'}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-left">
                      {isPassed && !hasAttemptsLeft ? (
                        <button
                          disabled
                          className="px-4 py-1.5 bg-blue-500/90 text-white text-xs font-semibold rounded-lg opacity-85 shadow-2xs cursor-default"
                        >
                          Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{attemptsUsed > 0 ? 'Retake Quiz' : 'Completed'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer support note */}
      <p className="text-center text-xs text-slate-500 font-medium py-2">
        Contact your instructor if you have any issues accessing your quizzes.
      </p>

      {/* Interactive Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {currentQuestionIdx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeQuiz.title}</h3>
                  <p className="text-xs text-slate-500">{activeQuiz.module}</p>
                </div>
              </div>
              <button
                onClick={handleCloseQuizModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {!isQuizCompleted ? (
                <>
                  {/* Question Title */}
                  {activeQuiz.questions[currentQuestionIdx] ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>
                          Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-mono">
                          <Clock className="w-3.5 h-3.5 text-blue-500" /> 45:00
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                        {activeQuiz.questions[currentQuestionIdx].question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2.5 pt-2">
                        {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                          const isSelected =
                            selectedAnswers[activeQuiz.questions[currentQuestionIdx].id] === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() =>
                                handleAnswerSelect(
                                  activeQuiz.questions[currentQuestionIdx].id,
                                  optIdx
                                )
                              }
                              className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400">
                      No question found for this quiz.
                    </div>
                  )}
                </>
              ) : (
                /* Results Screen */
                <div className="py-8 text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      lastScorePercentage >= 60
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {lastScorePercentage >= 60 ? (
                      <CheckCircle2 className="w-10 h-10" />
                    ) : (
                      <XCircle className="w-10 h-10" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {lastScorePercentage >= 60 ? 'Quiz Completed Successfully!' : 'Quiz Attempt Finished'}
                  </h3>
                  <p className="text-3xl font-black text-blue-600">{lastScorePercentage}%</p>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    {lastScorePercentage >= 60
                      ? 'Great job! Your passing result has been recorded in your course transcript.'
                      : 'Passing threshold is 60%. You may retake the quiz if you have remaining attempts.'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              {!isQuizCompleted ? (
                <>
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-40 transition"
                  >
                    Previous
                  </button>

                  {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit Quiz</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    onClick={handleCloseQuizModal}
                    className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
