import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Mail,
  Edit3,
  X,
  Check,
  ShieldCheck,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Briefcase,
  IdCard,
  LogOut,
} from 'lucide-react';

export const TeacherProfile: React.FC = () => {
  const { currentUser, updateUserProfile, showToast, students, logout } = useLMS();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Sir Syed Muzammil Javed',
    email: currentUser.email || 'ali.trainer@smit.edu.pk',
    phone: currentUser.phone || '+92 321 9876543',
    address: currentUser.address || 'Saylani Zaitoon Ashraf IT Park , Karachi',
    gender: currentUser.gender || 'Male',
    dob: currentUser.dob || 'March 14, 1990',
    qualification: currentUser.qualification || 'MS Computer Science',
    cnic: currentUser.cnic || '42101-9876543-1',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    course: currentUser.course || 'Modern Web Application Development',
    campus: currentUser.campus || 'Zaitoon Ashraf IT Park',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditModalOpen(false);
    showToast('Instructor Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Profile Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        {/* Banner with SMIT Logo Gradient */}
        <div className="relative h-44 sm:h-56 md:h-64 bg-gradient-to-r from-[#bfe4af] via-[#7bc7c3] to-[#4085b8] flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center select-none drop-shadow-xs">
            {/* SMIT Big Logo In Banner */}
            <div className="relative flex items-center gap-1.5">
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1d5b94] tracking-tight">
                SM
              </span>
              <div className="flex flex-col items-center justify-center -mt-2">
                <span className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#75b839] mb-0.5"></span>
                <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#75b839] leading-none">
                  I
                </span>
              </div>
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1d5b94] tracking-tight">
                T
              </span>
              <div className="absolute -top-3 sm:-top-5 left-7 sm:left-12 -rotate-12">
                <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-[#1d5b94] fill-[#1d5b94]" />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#1d5b94] tracking-widest uppercase mt-1">
              Saylani Mass IT Training • Faculty Portal
            </span>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white dark:ring-slate-900 bg-[#0c57c4] overflow-hidden flex-shrink-0 shadow-md">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {formData.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-3 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold">
                    Faculty / Lead Instructor
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ID: SMIT-FAC-8821
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c64f2] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contact & Personal Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <IdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Instructor Information
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 break-all">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Phone Number</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Campus Location</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.campus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Highest Qualification</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.qualification}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Date of Birth</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.dob}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">CNIC Identification</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.cnic}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Academic & Teaching Assignments (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Course Track */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Assigned Course & Batches
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {formData.course}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Department of Information Technology & Web Engineering
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  Batch 20 & 21
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700">
                <div className="text-center">
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{students.length}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Students</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">4</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Active Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-purple-600 dark:text-purple-400">8</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Assignments</p>
                </div>
              </div>
            </div>

            {/* Class Timetable */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Weekly Class Schedule
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Monday</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">01:00 PM - 03:00 PM</p>
                  <p className="text-[10px] text-slate-400">Lab 04 • On Campus</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Wednesday</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">01:00 PM - 03:00 PM</p>
                  <p className="text-[10px] text-slate-400">Lab 04 • On Campus</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400">Friday</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">01:00 PM - 03:00 PM</p>
                  <p className="text-[10px] text-slate-400">Lab 04 • On Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Logout Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Instructor Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
