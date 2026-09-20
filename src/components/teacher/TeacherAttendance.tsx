import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';
import { TeacherHeader } from './TeacherHeader';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  RotateCcw,
  Save,
} from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const { students, attendance, markAttendance, showToast } = useLMS();

  // Date selection (Matching Screenshot 1: "Select a Date" e.g. Tue Sep 15 2026)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-15');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Attendance map for currently selected date: studentId -> 'PRESENT' | 'ABSENT' | 'LEAVE' | 'NOT_MARKED'
  const [statusMap, setStatusMap] = useState<
    Record<string, 'PRESENT' | 'ABSENT' | 'LEAVE' | 'NOT_MARKED'>
  >(() => {
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LEAVE' | 'NOT_MARKED'> = {};
    students.forEach((s) => {
      // Check if already in attendance state
      const existing = attendance.find(
        (a) => a.studentId === s.id && a.date.includes('2026-09-15')
      );
      map[s.id] = existing ? existing.status : 'NOT_MARKED';
    });
    return map;
  });

  // Calculate top 4 metrics matching Screenshot 1
  const totalStudentsCount = students.length;
  const presentCount = Object.values(statusMap).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(statusMap).filter((s) => s === 'ABSENT').length;
  const leaveCount = Object.values(statusMap).filter((s) => s === 'LEAVE').length;

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, students.length);
  const currentStudents = students.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleStatus = (studentId: string) => {
    setStatusMap((prev) => {
      const current = prev[studentId] || 'NOT_MARKED';
      let next: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'NOT_MARKED';
      if (current === 'NOT_MARKED') next = 'PRESENT';
      else if (current === 'PRESENT') next = 'ABSENT';
      else if (current === 'ABSENT') next = 'LEAVE';
      else next = 'NOT_MARKED';
      return { ...prev, [studentId]: next };
    });
  };

  const handleSetStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'NOT_MARKED') => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    setStatusMap((prev) => {
      const updated = { ...prev };
      students.forEach((s) => {
        updated[s.id] = 'PRESENT';
      });
      return updated;
    });
    showToast('Marked all students as Present for this session', 'info');
  };

  const handleResetAttendance = () => {
    setStatusMap((prev) => {
      const updated = { ...prev };
      students.forEach((s) => {
        updated[s.id] = 'NOT_MARKED';
      });
      return updated;
    });
    showToast('Cleared attendance marks for this session', 'info');
  };

  const handleSaveAttendance = () => {
    const records = students
      .filter((s) => statusMap[s.id] && statusMap[s.id] !== 'NOT_MARKED')
      .map((s) => ({
        studentId: s.id,
        rollNumber: s.rollNumber || '467564',
        studentName: s.name,
        status: statusMap[s.id] as 'PRESENT' | 'ABSENT' | 'LEAVE',
        date: selectedDate,
        classNumber: 12,
      }));

    if (records.length === 0) {
      showToast('Please mark at least one student before saving.', 'warning');
      return;
    }

    markAttendance(records);
    showToast(`Attendance saved successfully for ${records.length} students!`, 'success');
  };

  // Format date nicely like "Tue Sep 15 2026"
  const formattedDateDisplay = useMemo(() => {
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Tue Sep 15 2026';
    }
  }, [selectedDate]);

  const dateSelectorControl = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="text-right">
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Select a Date
        </label>
        <div className="relative inline-flex items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <TeacherHeader rightAction={dateSelectorControl} />

      {/* 4 Summary Stat Cards (Matching Screenshot 1 1:1) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Students
            </span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {totalStudentsCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 text-slate-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Present */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {presentCount}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Present
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {absentCount}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Absent
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Leave */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {leaveCount}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Leave
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Action Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Present
          </button>
          <button
            onClick={handleResetAttendance}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Marks
          </button>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
        >
          <Save className="w-3.5 h-3.5" />
          Save Attendance ({presentCount + absentCount + leaveCount} Marked)
        </button>
      </div>

      {/* Attendance Table (Matching Screenshot 1 1:1) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700/70 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/40 dark:bg-slate-900/20">
              <tr>
                <th className="py-3.5 px-6">Roll #</th>
                <th className="py-3.5 px-6">Full Name</th>
                <th className="py-3.5 px-6 text-right sm:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std) => {
                const status = statusMap[std.id] || 'NOT_MARKED';

                return (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition"
                  >
                    {/* Roll # */}
                    <td className="py-3.5 px-6 font-medium text-slate-600 dark:text-slate-400">
                      {std.rollNumber || '467564'}
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-6 font-semibold text-slate-800 dark:text-slate-200">
                      {std.name}
                    </td>

                    {/* Status: NOT MARKED or marked with quick toggles (Matching Screenshot 1) */}
                    <td className="py-3.5 px-6 whitespace-nowrap text-right sm:text-left">
                      <div className="flex items-center gap-1.5 justify-end sm:justify-start">
                        {status === 'NOT_MARKED' ? (
                          <button
                            onClick={() => handleToggleStatus(std.id)}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[11px] font-bold uppercase tracking-wider transition"
                            title="Click to toggle status"
                          >
                            NOT MARKED
                          </button>
                        ) : status === 'PRESENT' ? (
                          <button
                            onClick={() => handleToggleStatus(std.id)}
                            className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded text-[11px] font-bold uppercase tracking-wider transition"
                          >
                            PRESENT
                          </button>
                        ) : status === 'ABSENT' ? (
                          <button
                            onClick={() => handleToggleStatus(std.id)}
                            className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded text-[11px] font-bold uppercase tracking-wider transition"
                          >
                            ABSENT
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(std.id)}
                            className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded text-[11px] font-bold uppercase tracking-wider transition"
                          >
                            LEAVE
                          </button>
                        )}

                        {/* Quick Action Pills for effortless 1-click marking */}
                        <div className="hidden sm:flex items-center gap-1 ml-2 opacity-60 hover:opacity-100 transition">
                          <button
                            onClick={() => handleSetStatus(std.id, 'PRESENT')}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                              status === 'PRESENT'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'
                            }`}
                            title="Mark Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleSetStatus(std.id, 'ABSENT')}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                              status === 'ABSENT'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-rose-100 hover:text-rose-700'
                            }`}
                            title="Mark Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => handleSetStatus(std.id, 'LEAVE')}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                              status === 'LEAVE'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-amber-100 hover:text-amber-700'
                            }`}
                            title="Mark Leave"
                          >
                            L
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination (Matching Screenshot 1: "Showing 1-10 of 57 students" + < Previous 1 2 ... 6 Next >) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/20">
          <div>
            Showing{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {startIndex + 1}-{endIndex}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {students.length}
            </strong>{' '}
            students
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 5 && p > 2 && p < totalPages) {
                if (p === 3) {
                  return (
                    <span key={p} className="px-1 text-xs text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition ${
                    currentPage === p
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
