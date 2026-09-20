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
  GraduationCap,
  Users,
  Shield,
  History,
  IdCard,
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { currentUser, updateUserProfile, showToast, students, trainers, activityLogs } = useLMS();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Admin Secretariat',
    email: currentUser.email || 'admin.office@smit.edu.pk',
    phone: currentUser.phone || '+92 311 0001122',
    address: currentUser.address || 'Saylani Head Office, Bahadurabad, Karachi',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    campus: currentUser.campus || 'Saylani Central Operations',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditModalOpen(false);
    showToast('Administrator Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Profile Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="relative h-44 sm:h-56 md:h-64 bg-gradient-to-r from-[#8ba1f7] via-[#6366f1] to-[#4338ca] flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center select-none drop-shadow-xs">
            <div className="relative flex items-center gap-1.5">
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
                SM
              </span>
              <div className="flex flex-col items-center justify-center -mt-2">
                <span className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-amber-400 mb-0.5"></span>
                <span className="text-4xl sm:text-6xl md:text-7xl font-black text-amber-400 leading-none">
                  I
                </span>
              </div>
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
                T
              </span>
              <div className="absolute -top-3 sm:-top-5 left-7 sm:left-12 -rotate-12">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-white/20" />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-white/90 tracking-widest uppercase mt-1">
              Saylani Mass IT Training • Central Administration
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white dark:ring-slate-900 bg-indigo-900 overflow-hidden flex-shrink-0 shadow-md">
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
                  <span className="inline-block px-3 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-md text-xs font-bold">
                    Super Administrator
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ID: SMIT-ADM-001
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <IdCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Administrative Information
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Official Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 break-all">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Hotline Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Campus Jurisdiction</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.campus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Access Tier</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Level 5 (Full System Authority)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              LMS Platform Statistics
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{trainers.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Trainers</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{students.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Students</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activityLogs.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit Logs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Admin Profile
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
                  Department / Office Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
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
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
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
