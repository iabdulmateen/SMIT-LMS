import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { TeacherHeader } from './TeacherHeader';
import { AnimatedProgressRing } from '../common/AnimatedProgressRing';
import {
  CheckCircle2,
  Circle,
  Save,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const TeacherCourseProgress: React.FC = () => {
  const { modules, toggleTopicCompletion, showToast } = useLMS();

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    modules[0]?.id || 'mod_html'
  );

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const totalTopicsCount = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const totalCompletedTopics = modules.reduce(
    (acc, m) => acc + m.topics.filter((t) => t.isCompleted).length,
    0
  );
  const overallPercentage = Math.round((totalCompletedTopics / Math.max(1, totalTopicsCount)) * 100);

  const handleSaveProgress = () => {
    showToast('Course syllabus progress synced and saved successfully!', 'success');
  };

  const saveProgressButton = (
    <button
      onClick={handleSaveProgress}
      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
    >
      <Save className="w-3.5 h-3.5" />
      <span>Save Course Progress</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <TeacherHeader rightAction={saveProgressButton} />

      {/* Overall Progress Banner */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AnimatedProgressRing percentage={overallPercentage} size={54} strokeWidth={4.5} />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Curriculum Milestone Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCompletedTopics} of {totalTopicsCount} syllabus topics marked as delivered and verified
            </p>
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout (Matching Screenshot 4 1:1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Modules List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Course Modules
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {modules.length} Modules
            </span>
          </div>

          <div className="space-y-2">
            {modules.map((mod, index) => {
              const isSelected = mod.id === activeModule?.id;
              const completedCount = mod.topics.filter((t) => t.isCompleted).length;
              const percent = Math.round((completedCount / Math.max(1, mod.topics.length)) * 100);

              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-2xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AnimatedProgressRing percentage={percent} size={38} strokeWidth={3.5} showText={false} />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {completedCount}/{mod.topics.length} topics • {percent}% done
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400 translate-x-0.5'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Topics Checklist for Selected Module */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Module Details & Checklist
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeModule.title}
                </h3>
              </div>
              <div className="px-3 py-1 bg-slate-50 dark:bg-slate-700/60 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                {activeModule.totalHours || 24} Hours
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mark topics as covered during lectures and practical lab sessions. Students will see verified progress on their student dashboards.
            </p>

            <div className="space-y-2.5 pt-1">
              {activeModule.topics.map((topic, tIdx) => {
                return (
                  <div
                    key={topic.id || tIdx}
                    onClick={() => toggleTopicCompletion(activeModule.id, topic.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      topic.isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/60'
                        : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-blue-600 transition"
                      >
                        {topic.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div>
                        <span
                          className={`text-xs sm:text-sm font-semibold transition ${
                            topic.isCompleted
                              ? 'text-slate-800 dark:text-slate-200 line-through decoration-emerald-500/50'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {topic.title}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {topic.durationHours || 2} Hours • {topic.isCompleted ? 'Completed' : 'Pending Lecture'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        topic.isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {topic.isCompleted ? 'DONE' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
