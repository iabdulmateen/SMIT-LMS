import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { BookMarked, GraduationCap, Clock, ChevronDown, ChevronUp, CheckCircle2, CheckSquare, Square } from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const { modules, toggleTopicCompletion } = useLMS();
  const [expandedModule, setExpandedModule] = useState<string | null>('mod_2');

  const totalTopics = modules.reduce((acc, m) => acc + m.totalTopics, 0);
  const completedTopics = modules.reduce((acc, m) => acc + m.completedTopics, 0);
  const pendingTopics = totalTopics - completedTopics;

  const toggleExpand = (id: string) => {
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  // Helper to render circular progress ring SVG
  const renderProgressRing = (percentage: number) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-12 h-12 -rotate-90 transform">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={percentage === 100 ? '#10B981' : percentage > 0 ? '#3B82F6' : '#CBD5E1'}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span
          className={`absolute text-[11px] font-bold ${
            percentage === 100
              ? 'text-emerald-600'
              : percentage > 0
              ? 'text-blue-600'
              : 'text-slate-400'
          }`}
        >
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Topics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {totalTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Total Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Topics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {completedTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Completed Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Topics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {pendingTopics}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Pending Topics</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Modules List (Matching Screenshot 2) */}
      <div className="space-y-3">
        {modules.map((module) => {
          const percentage = Math.round((module.completedTopics / module.totalTopics) * 100) || 0;
          const isCompleted = percentage === 100;
          const isExpanded = expandedModule === module.id;

          return (
            <div
              key={module.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden transition"
            >
              {/* Module Header Bar */}
              <div
                onClick={() => toggleExpand(module.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{module.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Topics: {module.completedTopics}/{module.totalTopics}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {renderProgressRing(percentage)}
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expandable Topic Details Checklist */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/40 p-5 space-y-2.5">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Curriculum Topics</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-2">
                    {module.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopicCompletion(module.id, topic.id)}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {topic.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs sm:text-sm font-medium ${
                              topic.completed ? 'text-slate-800 line-through/20' : 'text-slate-700'
                            }`}
                          >
                            {topic.title}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            topic.completed
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-500'
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
