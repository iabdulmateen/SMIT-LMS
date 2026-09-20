import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';
import { UserProfile } from '../../types';
import { TeacherHeader } from './TeacherHeader';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const { students, addStudent, showToast } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination state (Default 10 records per page as seen in screenshot: "Showing 1-10 of 201 records")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      const matchesSearch =
        std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (std.rollNumber && std.rollNumber.includes(searchQuery)) ||
        std.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = filterBatch === 'All' || std.batch === filterBatch || filterBatch === 'Enrolled';
      return matchesSearch && matchesBatch;
    });
  }, [students, searchQuery, filterBatch]);

  const totalRecords = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  // Generate pagination items with ellipses matching screenshot: < Previous 1 2 ... 21 Next >
  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 1, totalPages);
      } else {
        pages.push(1, currentPage, '...', totalPages);
      }
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => handlePageChange(p)}
              className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition ${
                currentPage === p
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1 text-xs text-slate-400">
              {p}
            </span>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  const searchControls = (
    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
      {/* Search Input (Matching Screenshot 2) */}
      <div className="relative flex-1 sm:w-64">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, email or roll no..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>

      {/* Filter dropdown (Matching Screenshot 2) */}
      <select
        value={filterBatch}
        onChange={(e) => {
          setFilterBatch(e.target.value);
          setCurrentPage(1);
        }}
        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="All">All</option>
        <option value="Enrolled">Enrolled</option>
        <option value="20">Batch 20</option>
        <option value="19">Batch 19</option>
      </select>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Add Student</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <TeacherHeader rightAction={searchControls} />

      {/* Students Table (Matching Screenshot 2 1:1) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700/70 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider bg-slate-50/40 dark:bg-slate-900/20">
              <tr>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                currentRecords.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition"
                  >
                    {/* Student Avatar + Name */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {std.name}
                        </span>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      {std.rollNumber || '467564'}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {std.email}
                    </td>

                    {/* Status: ENROLLED in light blue badge (Matching Screenshot 2) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/70 dark:border-sky-800/60 rounded text-[11px] font-bold uppercase tracking-wider">
                        ENROLLED
                      </span>
                    </td>

                    {/* Action: Eye Icon */}
                    <td className="py-3.5 px-6 whitespace-nowrap text-right sm:text-left">
                      <button
                        onClick={() => setSelectedStudent(std)}
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        title="View Student Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination (Exact match to Screenshot 2: "Showing 1-10 of 201 records") */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/20">
          <div>
            Showing{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {totalRecords === 0 ? 0 : startIndex + 1}-{endIndex}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {totalRecords}
            </strong>{' '}
            records
          </div>

          {renderPaginationButtons()}
        </div>
      </div>

      {/* Student Profile Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Student Record Details
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedStudent.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Roll No: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedStudent.rollNumber}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded text-[10px] font-bold">
                    ENROLLED
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded text-[10px] font-semibold">
                    Batch {selectedStudent.batch || '20'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedStudent.phone || '+92 300 1234567'}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Campus</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedStudent.campus || 'Zaitoon Ashraf IT Park'}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Course</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{selectedStudent.course || 'Modern Web App Dev'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Enroll New Student
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Abdul Wadood"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 467564"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Campus
                </label>
                <input
                  type="text"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
