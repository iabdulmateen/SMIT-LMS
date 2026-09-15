import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Clock, GraduationCap, Copy, Check, Calendar as CalendarIcon, MapPin, Hash, User } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setStudentTab, attendance, assignments, feeRecords, showToast } = useLMS();
  const [scheduleTab, setScheduleTab] = useState<'assignments' | 'quizzes' | 'events'>('quizzes');
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Calculate dynamic stats
  const totalClasses = 111;
  const presentClasses = attendance.filter((a) => a.studentId === currentUser.id && a.status === 'PRESENT').length + 74; // combined with historical
  const totalAssignments = 13;
  const submittedAssignments = assignments.filter((a) => a.status === 'APPROVED' || a.status === 'SUBMITTED' || a.status === 'LATE SUBMITTED').length;

  const currentFee = feeRecords[0] || {
    month: 'Sep 2026',
    amount: 1000,
    type: 'Monthly',
    dueDate: '08-Sep-2026',
    voucherId: '202609777873',
    status: 'PAID',
  };

  const handleCopyVoucher = (voucherId: string) => {
    navigator.clipboard.writeText(voucherId);
    setCopiedVoucher(true);
    showToast('Voucher ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Attendance Stat Card */}
        <div
          onClick={() => setStudentTab('attendance')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between hover:border-slate-200 dark:hover:border-slate-700 transition cursor-pointer group"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              82/111
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Attendance</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Assignment Stat Card */}
        <div
          onClick={() => setStudentTab('assignment')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between hover:border-slate-200 dark:hover:border-slate-700 transition cursor-pointer group"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              8/13
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Assignment</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Course & Class Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Course */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Active Course</h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
            {/* Header: Title + Enrolled Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Modern Web Application Development
              </h1>
              <span className="self-start sm:self-auto px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-md tracking-wider">
                ENROLLED
              </span>
            </div>

            {/* Schedule Timing Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-100 dark:border-slate-700">
                Mon 01:00 PM – 03:00 PM
              </span>
              <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-100 dark:border-slate-700">
                Wed 01:00 PM – 03:00 PM
              </span>
              <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-100 dark:border-slate-700">
                Fri 01:00 PM – 03:00 PM
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Progress</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">73% Completed</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '73%' }} />
              </div>
            </div>

            {/* Course Meta Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                <span><strong className="text-slate-700 dark:text-slate-300">Batch:</strong> 20</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span><strong className="text-slate-700 dark:text-slate-300">Roll:</strong> 777873</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="truncate"><strong className="text-slate-700 dark:text-slate-300">Campus:</strong> Zaitoon Ashraf IT Park</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span><strong className="text-slate-700 dark:text-slate-300">City:</strong> Karachi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Class Schedule & Upcoming Tabs */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <CalendarIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <h3>Class Schedule</h3>
            </div>

            {/* Days of Week (Matching Screenshot 1) */}
            <div className="grid grid-cols-7 gap-1 text-center">
              <div className="p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <div className="text-[10px] uppercase font-semibold">Sun</div>
                <div className="text-xs font-bold mt-1">13</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-xs">
                <div className="text-[10px] uppercase font-semibold">Mon</div>
                <div className="text-xs font-bold mt-1">14</div>
              </div>
              <div className="p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <div className="text-[10px] uppercase font-semibold">Tue</div>
                <div className="text-xs font-bold mt-1">15</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-xs">
                <div className="text-[10px] uppercase font-semibold">Wed</div>
                <div className="text-xs font-bold mt-1">16</div>
              </div>
              <div className="p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <div className="text-[10px] uppercase font-semibold">Thu</div>
                <div className="text-xs font-bold mt-1">17</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-xs">
                <div className="text-[10px] uppercase font-semibold">Fri</div>
                <div className="text-xs font-bold mt-1">18</div>
              </div>
              <div className="p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <div className="text-[10px] uppercase font-semibold">Sat</div>
                <div className="text-xs font-bold mt-1">19</div>
              </div>
            </div>

            {/* Upcoming Sub Tabs */}
            <div className="pt-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setScheduleTab('assignments')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                    scheduleTab === 'assignments'
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => setScheduleTab('quizzes')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                    scheduleTab === 'quizzes'
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Quizzes
                </button>
                <button
                  onClick={() => setScheduleTab('events')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                    scheduleTab === 'events'
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Events
                </button>
              </div>

              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                {scheduleTab === 'quizzes' && <p>No upcoming quizzes</p>}
                {scheduleTab === 'assignments' && <p>Next assignment due Sep 25, 2026</p>}
                {scheduleTab === 'events' && <p>Saylani Hackathon 2026 in 12 days</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Section (Matching Screenshot 1) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Fee</h2>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Month</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Due date</th>
                  <th className="py-3 px-4">Voucher ID</th>
                  <th className="py-3 px-4 sm:px-6 text-right sm:text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 dark:text-white">{currentFee.month}</td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Rs: {currentFee.amount} /-</td>
                  <td className="py-4 px-4">{currentFee.type}</td>
                  <td className="py-4 px-4">{currentFee.dueDate}</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                      <span>{currentFee.voucherId}</span>
                      <button
                        onClick={() => handleCopyVoucher(currentFee.voucherId)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title="Copy Voucher ID"
                      >
                        {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right sm:text-left">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full font-bold text-[11px] uppercase tracking-wider">
                      PAID
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
