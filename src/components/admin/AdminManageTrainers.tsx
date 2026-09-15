import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Trainer } from '../../types';
import { GraduationCap, UserPlus, Search, Edit, Trash2, X, Phone, Mail, BookOpen, Users, CheckCircle, Clock } from 'lucide-react';

export const AdminManageTrainers: React.FC = () => {
  const { trainers, addTrainer, updateTrainer, deleteTrainer, showToast } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    assignedCourse: 'Modern Web Application Development',
    assignedBatches: 'Batch 20, Batch 21',
    totalStudents: 120,
    experience: '5+ Years',
    status: 'ACTIVE' as const,
  });

  const filteredTrainers = trainers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedCourse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      assignedCourse: 'Modern Web Application Development',
      assignedBatches: 'Batch 20, Batch 21',
      totalStudents: 100,
      experience: '4+ Years',
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      assignedCourse: trainer.assignedCourse,
      assignedBatches: trainer.assignedBatches.join(', '),
      totalStudents: trainer.totalStudents,
      experience: trainer.experience,
      status: trainer.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please fill all required trainer fields', 'warning');
      return;
    }

    const batchesArray = formData.assignedBatches
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (editingTrainer) {
      updateTrainer(editingTrainer.id, {
        ...formData,
        assignedBatches: batchesArray,
      });
    } else {
      addTrainer({
        ...formData,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
        assignedBatches: batchesArray,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Faculty & Trainers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee course instructors, batch allocation, and student rosters across SMIT campuses.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search instructor by name, email, or course..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-2xs"
        />
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-200 transition"
          >
            <div>
              {/* Header with Avatar & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{trainer.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Exp: {trainer.experience}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                    trainer.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {trainer.status}
                </span>
              </div>

              {/* Info Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span className="truncate">{trainer.assignedCourse}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{trainer.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{trainer.phone}</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {trainer.assignedBatches.map((batch, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                    >
                      {batch}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-semibold">
                    {trainer.totalStudents} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(trainer)}
                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                title="Edit Trainer"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTrainer(trainer.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Remove Trainer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">
                {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sir Kashif Sulaiman"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Assigned Course
                </label>
                <input
                  type="text"
                  value={formData.assignedCourse}
                  onChange={(e) => setFormData({ ...formData, assignedCourse: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Batches (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.assignedBatches}
                    onChange={(e) => setFormData({ ...formData, assignedBatches: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
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
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition"
                >
                  Save Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
