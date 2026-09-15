import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, ChevronDown } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { attendance, currentUser } = useLMS();
  const [selectedMonth, setSelectedMonth] = useState<string>('Sep 2026');

  // Filter student's attendance records
  const studentRecords = attendance.filter((a) => a.studentId === currentUser.id);

  const totalClasses = 111;
  const presentCount = 82;
  const leaveCount = 0;
  const absentCount = 29;

  const attendancePercentage = Math.round((presentCount / totalClasses) * 100);
  const isBelowThreshold = attendancePercentage < 75;

  return (
    <div className="space-y-6">
      {/* Top 4 Stat Cards (Matching Screenshot 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Classes */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{totalClasses}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Total Classes</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{presentCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Present</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Leave */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{leaveCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Leave</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{absentCount}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Absent</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Overview Warning Card (Matching Screenshot 3) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Attendance Overview</h2>
          <span className="text-lg font-bold text-amber-600">{attendancePercentage}%</span>
        </div>

        {isBelowThreshold && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Your attendance is below 75%. Please improve.
          </p>
        )}

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* Attendance Table with Month Filter (Matching Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex justify-end">
          <div className="relative inline-block">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Sep 2026</option>
              <option>Aug 2026</option>
              <option>Jul 2026</option>
              <option>Jun 2026</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right sm:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                studentRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{index + 1}</td>
                    <td className="py-3.5 px-4">{record.date}</td>
                    <td className="py-3.5 px-4 text-right sm:text-left">
                      {record.status === 'PRESENT' && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          PRESENT
                        </span>
                      )}
                      {record.status === 'ABSENT' && (
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          ABSENT
                        </span>
                      )}
                      {record.status === 'LEAVE' && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          LEAVE
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
