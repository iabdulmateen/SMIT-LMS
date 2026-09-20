import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { BookMarked, GraduationCap, Clock, ChevronDown, ChevronUp, CheckCircle2, CheckSquare, Square } from 'lucide-react';
import { AnimatedProgressRing } from '../common/AnimatedProgressRing';

export const StudentProgress: React.FC = () => {
  const { modules, toggleTopicCompletion } = useLMS();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const totalTopics = modules.reduce((acc, m) => acc + m.totalTopics, 0);
  const completedTopics = modules.reduce((acc, m) => acc + m.completedTopics, 0);
  const pendingTopics = totalTopics - completedTopics;

  const toggleExpand = (id: string) => {
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Topics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {totalTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Total Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Topics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {completedTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Completed Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Topics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {pendingTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Pending Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Modules List (Matching Screenshot 2 & 3) */}
      <div className="space-y-3">
        {modules.map((module) => {
          const percentage = Math.round((module.completedTopics / module.totalTopics) * 100) || 0;
          const isCompleted = percentage === 100;
          const isExpanded = expandedModule === module.id;

          return (
            <div
              key={module.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden transition"
            >
              {/* Module Header Bar */}
              <div
                onClick={() => toggleExpand(module.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{module.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Topics: {module.completedTopics}/{module.totalTopics}
                    </p>
                  </div>
                </div>

                {/* Animated Circular Progress Ring + Chevron (Matching Screenshot 3) */}
                <div className="flex items-center gap-3.5">
                  <AnimatedProgressRing
                    percentage={percentage}
                    size={48}
                    strokeWidth={4}
                    duration={1300}
                  />
                  <div className="text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Topic Details Checklist */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 p-5 space-y-2.5">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Curriculum Topics</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-2">
                    {module.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopicCompletion(module.id, topic.id)}
                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {topic.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs sm:text-sm font-medium ${
                              topic.completed ? 'text-slate-800 dark:text-slate-200 line-through/20' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {topic.title}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            topic.completed
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {topic.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
