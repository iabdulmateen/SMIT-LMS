import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Award, Users, TrendingUp, AlertTriangle, CheckCircle2, Download, Search, ChevronRight } from 'lucide-react';

export const AdminStudentProgress: React.FC = () => {
  const { students, modules, assignments, quizzes, quizResults, showToast } = useLMS();

  const [filterBatch, setFilterBatch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'ACTIVE').length;
  const overallCurriculumProgress = 73; // %
  const averageAttendance = 81; // %

  const filteredStudents = students.filter((s) => {
    const matchesBatch = filterBatch === 'ALL' || s.batch === filterBatch;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rollNumber && s.rollNumber.includes(searchQuery));
    return matchesBatch && matchesSearch;
  });

  const handleExportReport = () => {
    showToast('Exporting SMIT Academic Performance Report (.CSV)...', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Progress & Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor institutional milestones, attendance distributions, and academic completion rates.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Top 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trainees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{totalStudents}</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Enrolled Trainees</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{overallCurriculumProgress}%</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Avg. Syllabus Covered</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{averageAttendance}%</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Avg. Attendance Rate</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* At Risk Warning */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">1 Trainee</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Under 75% Attendance</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Batch Progress Overview Progress Bars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Module Completion Status (Batch 20)</h3>
        <div className="space-y-3">
          {modules.map((mod) => {
            const pct = Math.round((mod.completedTopics / mod.totalTopics) * 100);
            return (
              <div key={mod.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{mod.title}</span>
                  <span className="text-slate-500">{mod.completedTopics}/{mod.totalTopics} Topics ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Students Progress Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainee..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-medium text-slate-500">Filter Batch:</span>
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 py-1.5 px-3 rounded-lg focus:outline-none"
            >
              <option value="ALL">All Batches</option>
              <option value="20">Batch 20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Trainee</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Assignments Done</th>
                <th className="py-3 px-4">Quiz Average</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((std, idx) => {
                // mock attendance % and metrics
                const attPct = idx === 0 ? 74 : 85 + (idx % 3) * 4;
                const asgDone = idx === 0 ? '14/16' : '15/16';
                const quizAvg = idx === 0 ? '88%' : '92%';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span>{std.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{std.rollNumber}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-xs ${
                          attPct < 75 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
                        }`}
                      >
                        {attPct}% {attPct < 75 && '(Warning)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{asgDone}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-600">{quizAvg}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          std.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
