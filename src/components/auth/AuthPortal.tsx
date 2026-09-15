import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { SmitLogo } from '../common/SmitLogo';
import { Role } from '../../types';
import { Eye, EyeOff, Calendar as CalendarIcon, ShieldCheck, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const AuthPortal: React.FC = () => {
  const { login, registerPassword, showToast } = useLMS();

  // Portal modes: 'student' | 'trainer' | 'admin'
  const [portalMode, setPortalMode] = useState<'student' | 'trainer' | 'admin'>('student');

  // Student sub-tab: 'login' | 'create_password'
  const [studentTab, setStudentTab] = useState<'login' | 'create_password'>('login');

  // Common form inputs
  const [cnic, setCnic] = useState('42101-777873-1');
  const [dob, setDob] = useState('2002-05-14');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Switch portal mode and preset sample credentials
  const handleSwitchPortal = (mode: 'student' | 'trainer' | 'admin') => {
    setPortalMode(mode);
    if (mode === 'student') {
      setCnic('42101-777873-1');
      setPassword('password123');
    } else if (mode === 'trainer') {
      setEmail('trainer@saylaniwelfare.com');
      setPassword('trainer123');
    } else {
      setEmail('admin@saylaniwelfare.com');
      setPassword('admin123');
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnic.trim()) {
      showToast('Please enter your CNIC number.', 'warning');
      return;
    }
    if (!password.trim()) {
      showToast('Please enter your password.', 'warning');
      return;
    }
    login('student', { cnic, password });
  };

  const handleStudentCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnic.trim() || !dob.trim() || !password.trim()) {
      showToast('Kindly fill all fields to create a password.', 'warning');
      return;
    }
    registerPassword(cnic, dob, password);
    setStudentTab('login');
  };

  const handleTrainerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your trainer email address.', 'warning');
      return;
    }
    if (!password.trim()) {
      showToast('Please enter your password.', 'warning');
      return;
    }
    login('teacher', { email, password });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter administrator credentials.', 'warning');
      return;
    }
    login('admin', { email, password });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast('Please enter your registered email address.', 'warning');
      return;
    }
    showToast(`Password reset link has been dispatched to ${resetEmail}`, 'success');
    setForgotPasswordModal(false);
    setResetEmail('');
  };

  // Quick Demo Auto-login
  const handleQuickDemo = (role: Role) => {
    if (role === 'student') {
      login('student', { cnic: '42101-777873-1', password: '123' });
    } else if (role === 'teacher') {
      login('teacher', { email: 'trainer@saylaniwelfare.com', password: '123' });
    } else {
      login('admin', { email: 'admin@saylaniwelfare.com', password: '123' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Top Center Logo & Portal Subheading */}
      <div className="flex flex-col items-center mb-6 text-center">
        <SmitLogo size="lg" />
        <h1 className="text-sm sm:text-base font-semibold text-slate-800 mt-2">
          {portalMode === 'student' && 'Student Portal'}
          {portalMode === 'trainer' && 'Trainer Portal'}
          {portalMode === 'admin' && 'Admin Portal'}
        </h1>
      </div>

      {/* Main Container Card Box */}
      <div className="w-full max-w-[420px] space-y-3">
        {/* STUDENT PORTAL TAB SWITCHER (Matching Screenshot 2 & 3) */}
        {portalMode === 'student' && (
          <div className="bg-[#F1F5F9] p-1 rounded-xl flex items-center border border-slate-200/80 mb-2">
            <button
              type="button"
              onClick={() => setStudentTab('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
                studentTab === 'login'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setStudentTab('create_password')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
                studentTab === 'create_password'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Password
            </button>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          {/* STUDENT - LOGIN VIEW (Matching Screenshot 2) */}
          {portalMode === 'student' && studentTab === 'login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Login</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kindly provide the CNIC number and password used during SMIT course registration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNIC *
                </label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="42101-777873-1"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#224b8b] hover:bg-[#1b3d73] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer"
              >
                LOGIN
              </button>
            </form>
          )}

          {/* STUDENT - CREATE PASSWORD VIEW (Matching Screenshot 3) */}
          {portalMode === 'student' && studentTab === 'create_password' && (
            <form onSubmit={handleStudentCreatePassword} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Create a Password</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kindly provide the CNIC number and DOB used during SMIT course registration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNIC *
                </label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="42101-777873-1"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  DOB *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-3.5 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a new password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#224b8b] hover:bg-[#1b3d73] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer"
              >
                SUBMIT
              </button>
            </form>
          )}

          {/* TRAINER - LOGIN VIEW (Matching Screenshot 1) */}
          {portalMode === 'trainer' && (
            <form onSubmit={handleTrainerLogin} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Login</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kindly provide your email and password to access the trainer portal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainer@saylaniwelfare.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#224b8b] hover:bg-[#1b3d73] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer"
              >
                LOGIN
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(true)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* ADMIN - LOGIN VIEW */}
          {portalMode === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Admin Login</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kindly provide your administrator credentials to access the SMIT management console.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saylaniwelfare.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20 focus:border-[#224b8b] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#224b8b] hover:bg-[#1b3d73] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer"
              >
                LOGIN
              </button>
            </form>
          )}
        </div>

        {/* BOTTOM ROLE SWITCH BUTTONS (Matching Screenshots 1 & 2) */}
        <div className="space-y-2">
          {portalMode === 'student' ? (
            <button
              type="button"
              onClick={() => handleSwitchPortal('trainer')}
              className="w-full bg-white border border-slate-200 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs text-center cursor-pointer"
            >
              Login as teacher
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSwitchPortal('student')}
              className="w-full bg-white border border-slate-200 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs text-center cursor-pointer"
            >
              Login as student
            </button>
          )}

          {/* Admin portal alternative link */}
          <div className="flex items-center justify-center gap-3 pt-1 text-xs text-slate-500">
            {portalMode !== 'admin' ? (
              <button
                type="button"
                onClick={() => handleSwitchPortal('admin')}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                Admin Access
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSwitchPortal('student')}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                Back to Student Portal
              </button>
            )}
          </div>
        </div>

        {/* INSTANT ONE-CLICK DEMO ACCESS BAR */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick Demo 1-Click Access:
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-semibold text-blue-700 shadow-2xs transition"
            >
              Student Portal
            </button>
            <button
              onClick={() => handleQuickDemo('teacher')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-semibold text-emerald-700 shadow-2xs transition"
            >
              Trainer Portal
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-slate-200 rounded-lg text-xs font-semibold text-purple-700 shadow-2xs transition"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Reset Password</h3>
            <p className="text-xs text-slate-500">
              Enter your registered SMIT trainer email address to receive password recovery instructions.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="trainer@saylaniwelfare.com"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224b8b]/20"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#224b8b] hover:bg-[#1b3d73] rounded-lg shadow-xs"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
