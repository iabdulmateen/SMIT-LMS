import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Mail, User, BookOpen, Edit3, LogOut, X, Check, Camera, ShieldCheck, MapPin, Phone, Calendar, GraduationCap, IdCard } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, updateUserProfile, logout, showToast } = useLMS();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || 'ABDUL MATEEN AZEEMI',
    email: currentUser.email || 'innovatecode121@gmail.com',
    phone: currentUser.phone || '03353745448',
    address: currentUser.address || 'Gulshan E Hadeed Phase 2 Jamia Masjid Babe Rehmet Flat',
    gender: currentUser.gender || 'Male',
    dob: currentUser.dob || 'February 12, 2006',
    qualification: currentUser.qualification || 'Matric',
    cnic: currentUser.cnic || '8210172099609',
    avatar: currentUser.avatar || '/assets/abdul_mateen.jpg',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Profile Header Section (Matching Screenshot 2 & 3) */}
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
              {/* Mortarboard cap over M */}
              <div className="absolute -top-3 sm:-top-5 left-7 sm:left-12 -rotate-12">
                <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-[#1d5b94] fill-[#1d5b94]" />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#1d5b94] tracking-widest uppercase mt-1">
              Saylani Mass IT Training
            </span>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
              {/* Circular Avatar with blue background ring matching screenshot */}
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
                <div>
                  <span className="inline-block px-3 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-semibold">
                    Student
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c64f2] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Details Cards (Matching Screenshot 2 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contact Info (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 h-full transition-colors">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              <Mail className="w-4 h-4" />
              <h2 className="text-slate-900 dark:text-white font-bold">Contact Info</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Email</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 break-all">{formData.email}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Phone</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Address</span>
                <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {formData.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Enrolled Courses (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Personal Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4" />
              <h2 className="text-slate-900 dark:text-white font-bold">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Gender</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.gender}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Date of Birth</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.dob}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">Last Qualification</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.qualification}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-0.5">CNIC</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formData.cnic}</p>
              </div>
            </div>
          </div>

          {/* Card: Enrolled Courses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">
                <BookOpen className="w-4 h-4" />
                <h2 className="text-slate-900 dark:text-white font-bold">Enrolled Courses</h2>
              </div>
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
            </div>

            {/* Course Container with Left Blue Accent Line */}
            <div className="bg-[#f8fafc] dark:bg-slate-800/60 border-l-4 border-blue-600 rounded-r-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentUser.course || 'Modern Web Application Development'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Batch: {currentUser.batch || '20'} • Roll: {currentUser.rollNumber || '777873'}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md font-bold text-[11px] uppercase tracking-wider self-start sm:self-auto">
                ENROLLED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Logout Button (Matching Screenshot 3 Bottom-Right) */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Last Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
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
