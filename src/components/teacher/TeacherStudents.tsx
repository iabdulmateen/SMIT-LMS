import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { UserProfile } from '../../types';
import { Users, Search, Plus, UserPlus, Filter, X, Check, Ban, Eye } from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const { students, addStudent, updateStudentStatus, showToast } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // New Student Form
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    campus: 'Zaitoon Ashraf IT Park',
    city: 'Karachi',
    batch: '20',
    course: 'Modern Web Application Development',
    status: 'ACTIVE' as const,
    role: 'student' as const,
  });

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.rollNumber && std.rollNumber.includes(searchQuery)) ||
      std.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || std.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rollNumber.trim() || !formData.email.trim()) {
      showToast('Please fill all required fields.', 'warning');
      return;
    }

    addStudent({
      ...formData,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      campus: 'Zaitoon Ashraf IT Park',
      city: 'Karachi',
      batch: '20',
      course: 'Modern Web Application Development',
      status: 'ACTIVE',
      role: 'student',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enrolled students, academic standing, and roll number credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Statuses ({students.length})</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Students Table (Matching Teacher requirements: Name, Roll Number, Email, Status, Action) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-4">Roll Number</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No students match your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    {/* Name + Avatar */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.campus || 'Main Campus'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {student.rollNumber || '–'}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {student.email}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {student.status === 'ACTIVE' && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          ACTIVE
                        </span>
                      )}
                      {student.status === 'INACTIVE' && (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          INACTIVE
                        </span>
                      )}
                      {student.status === 'BLOCKED' && (
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                          BLOCKED
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right sm:text-left">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {student.status === 'ACTIVE' ? (
                          <button
                            onClick={() => updateStudentStatus(student.id, 'INACTIVE')}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Set Inactive"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStudentStatus(student.id, 'ACTIVE')}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Activate Student"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">Add New Student</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Muhammad Bilal"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 777880"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@gmail.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Campus
                </label>
                <input
                  type="text"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student View Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Student Profile</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{selectedStudent.name}</h4>
                <p className="text-xs text-slate-500 font-mono">Roll: {selectedStudent.rollNumber}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-full uppercase">
                  {selectedStudent.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Email:</span>
                <span className="text-slate-800">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Batch:</span>
                <span className="text-slate-800">{selectedStudent.batch || '20'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Course:</span>
                <span className="text-slate-800">{selectedStudent.course || 'Modern Web App Dev'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-medium text-slate-500">Campus:</span>
                <span className="text-slate-800">{selectedStudent.campus || 'Zaitoon Ashraf IT Park'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
