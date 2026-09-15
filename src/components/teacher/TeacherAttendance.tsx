import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Calendar, CheckCheck, Save, Users, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const { students, markAttendance, showToast } = useLMS();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClassNumber, setSelectedClassNumber] = useState<number>(7);
  const [selectedBatch, setSelectedBatch] = useState<string>('Batch 20');

  // Local state for daily marking
  const [dailyStatus, setDailyStatus] = useState<
    Record<string, 'PRESENT' | 'ABSENT' | 'LEAVE'>
  >(() => {
    const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LEAVE'> = {};
    students.forEach((s) => {
      initial[s.id] = 'PRESENT';
    });
    return initial;
  });

  const handleStatusChange = (
    studentId: string,
    status: 'PRESENT' | 'ABSENT' | 'LEAVE'
  ) => {
    setDailyStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT' | 'LEAVE') => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LEAVE'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setDailyStatus(updated);
    showToast(`Marked all ${students.length} students as ${status}`, 'info');
  };

  const handleSaveAttendance = () => {
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const records = students.map((s) => ({
      studentId: s.id,
      rollNumber: s.rollNumber || 'N/A',
      studentName: s.name,
      status: dailyStatus[s.id] || 'PRESENT',
      date: formattedDate,
      classNumber: selectedClassNumber,
    }));

    markAttendance(records);
  };

  // Summary counts
  const presentCount = Object.values(dailyStatus).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(dailyStatus).filter((s) => s === 'ABSENT').length;
  const leaveCount = Object.values(dailyStatus).filter((s) => s === 'LEAVE').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card with Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mark Class Attendance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record daily lecture attendance for enrolled batch trainees.
            </p>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save & Record Attendance</span>
          </button>
        </div>

        {/* Date, Class # & Batch Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Lecture Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Class Session #
            </label>
            <input
              type="number"
              min={1}
              max={150}
              value={selectedClassNumber}
              onChange={(e) => setSelectedClassNumber(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Active Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option>Batch 20 (Modern Web App Dev)</option>
              <option>Batch 21 (Front-End React)</option>
              <option>Batch 19 (MERN Stack)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Status Bar & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {presentCount} Present
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <XCircle className="w-4 h-4 text-rose-600" /> {absentCount} Absent
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <AlertCircle className="w-4 h-4 text-amber-600" /> {leaveCount} Leave
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('PRESENT')}
            className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold transition"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('ABSENT')}
            className="px-3 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg text-xs font-bold transition"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Table (Matching Prompt: Roll number, Full name, Status) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Roll Number</th>
                <th className="py-4 px-6">Full Name</th>
                <th className="py-4 px-6 text-center sm:text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((student) => {
                const currentStatus = dailyStatus[student.id] || 'PRESENT';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    {/* Roll number */}
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                      {student.rollNumber || '777870'}
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-semibold text-slate-900">{student.name}</span>
                      </div>
                    </td>

                    {/* Status Toggles */}
                    <td className="py-3.5 px-6 text-center sm:text-right">
                      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          PRESENT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          ABSENT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'LEAVE')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'LEAVE'
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          LEAVE
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
    </div>
  );
};
