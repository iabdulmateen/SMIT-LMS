import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ActivityLog, ActivityCategory, ActivityActionType } from '../../types';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  PlusCircle,
  UserCheck,
  GraduationCap,
  FileText,
  CheckSquare,
  CalendarCheck,
  Server,
  Info,
  ChevronRight,
  X,
  Clock,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminActivityLog: React.FC = () => {
  const { activityLogs, addActivityLog, clearActivityLogs, showToast, currentUser } = useLMS();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [datePeriod, setDatePeriod] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  // Modals
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<ActivityLog | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Form State for Manual Audit Note
  const [newNote, setNewNote] = useState({
    title: '',
    category: 'GENERAL' as ActivityCategory,
    action: 'ADMIN_NOTE' as ActivityActionType,
    description: '',
    targetName: '',
  });

  // Calculate KPIs
  const stats = useMemo(() => {
    const total = activityLogs.length;
    const trainerLogs = activityLogs.filter((l) => l.category === 'TRAINER').length;
    const studentLogs = activityLogs.filter((l) => l.category === 'STUDENT').length;
    const academicLogs = activityLogs.filter((l) =>
      ['ASSIGNMENT', 'QUIZ', 'ATTENDANCE', 'SYSTEM'].includes(l.category)
    ).length;

    return { total, trainerLogs, studentLogs, academicLogs };
  }, [activityLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        log.title.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        (log.targetName && log.targetName.toLowerCase().includes(q)) ||
        log.performedBy.name.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);

      // Category
      const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;

      // Action
      const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

      // Date period
      let matchesDate = true;
      if (datePeriod !== 'ALL') {
        const logDate = new Date(log.timestamp).getTime();
        const now = Date.now();
        if (datePeriod === 'TODAY') {
          matchesDate = now - logDate <= 24 * 60 * 60 * 1000;
        } else if (datePeriod === 'WEEK') {
          matchesDate = now - logDate <= 7 * 24 * 60 * 60 * 1000;
        } else if (datePeriod === 'MONTH') {
          matchesDate = now - logDate <= 30 * 24 * 60 * 60 * 1000;
        }
      }

      return matchesSearch && matchesCategory && matchesAction && matchesDate;
    });
  }, [activityLogs, searchQuery, selectedCategory, selectedAction, datePeriod]);

  // Helper for Category Badge Style
  const getCategoryBadge = (category: ActivityCategory) => {
    switch (category) {
      case 'TRAINER':
        return {
          icon: GraduationCap,
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
        };
      case 'STUDENT':
        return {
          icon: UserCheck,
          bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60',
          dot: 'bg-blue-500',
        };
      case 'ASSIGNMENT':
        return {
          icon: FileText,
          bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/60',
          dot: 'bg-purple-500',
        };
      case 'QUIZ':
        return {
          icon: CheckSquare,
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
          dot: 'bg-amber-500',
        };
      case 'ATTENDANCE':
        return {
          icon: CalendarCheck,
          bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/60',
          dot: 'bg-teal-500',
        };
      case 'SYSTEM':
        return {
          icon: Server,
          bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
          dot: 'bg-rose-500',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-500',
        };
    }
  };

  // Helper for Action Pill Style
  const getActionBadge = (action: ActivityActionType) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60';
      case 'UPDATE':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60';
      case 'DELETE':
        return 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700/60';
      case 'STATUS_CHANGE':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
      case 'ATTENDANCE_MARKED':
        return 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700/60';
      case 'ASSIGNMENT_CREATED':
      case 'ASSIGNMENT_GRADED':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60';
      case 'QUIZ_CREATED':
        return 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700/60';
      case 'ADMIN_NOTE':
        return 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60';
      case 'SYSTEM_RESET':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  // Relative Time Formatter
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleExportCSV = () => {
    if (activityLogs.length === 0) {
      showToast('No activity logs to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Timestamp', 'Category', 'Action', 'Title', 'Description', 'Performed By', 'Target Name'];
    const rows = activityLogs.map((l) => [
      l.id,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      l.category,
      l.action,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.performedBy.name} (${l.performedBy.role})"`,
      `"${(l.targetName || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smit_activity_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported SMIT Activity Log Audit Report (.CSV)', 'success');
  };

  const handleAddAuditNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.description.trim()) {
      showToast('Please provide both title and description for the audit note.', 'warning');
      return;
    }

    addActivityLog({
      action: newNote.action,
      category: newNote.category,
      title: newNote.title.trim(),
      description: newNote.description.trim(),
      performedBy: {
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      targetName: newNote.targetName.trim() || undefined,
      metadata: {
        noteType: 'Manual Admin Record',
      },
    });

    setNewNote({
      title: '',
      category: 'GENERAL',
      action: 'ADMIN_NOTE',
      description: '',
      targetName: '',
    });
    setIsAddNoteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-2xs transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/50 dark:border-purple-800/50">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                System Activity & Audit Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time tracking of institutional updates across faculty, trainees, assignments, and curriculum.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddNoteModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Audit Note</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            disabled={activityLogs.length === 0}
            className="p-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear Log History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {stats.total}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Total Logged Events
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-200/50 dark:border-purple-800/50">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Trainer Changes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {stats.trainerLogs}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Faculty & Trainer Actions
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Student Changes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {stats.studentLogs}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Trainee Status & Updates
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-200/50 dark:border-blue-800/50">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Academic Operations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {stats.academicLogs}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Curriculum & System Events
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-200/50 dark:border-amber-800/50">
            <Server className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3.5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, user, trainer, student or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Data Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns & Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="TRAINER">Faculty & Trainers</option>
            <option value="STUDENT">Trainees & Students</option>
            <option value="ASSIGNMENT">Assignments</option>
            <option value="QUIZ">Quizzes</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="SYSTEM">System Master</option>
            <option value="GENERAL">General Audit Notes</option>
          </select>

          {/* Action Selector */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Action Types</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="STATUS_CHANGE">STATUS CHANGE</option>
            <option value="ATTENDANCE_MARKED">ATTENDANCE</option>
            <option value="ASSIGNMENT_CREATED">ASSIGNMENT CREATED</option>
            <option value="ASSIGNMENT_GRADED">ASSIGNMENT GRADED</option>
            <option value="QUIZ_CREATED">QUIZ CREATED</option>
            <option value="ADMIN_NOTE">ADMIN NOTE</option>
            <option value="SYSTEM_RESET">SYSTEM RESET</option>
          </select>

          {/* Date Period Selector */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDatePeriod(period)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  datePeriod === period
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {period === 'ALL' ? 'All Time' : period === 'TODAY' ? 'Today' : period === 'WEEK' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Active Count Badge */}
          <div className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium">
            Showing <strong className="text-slate-700 dark:text-slate-300">{filteredLogs.length}</strong> of {activityLogs.length} logs
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
            <History className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-white">No Activity Logs Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL' || selectedAction !== 'ALL'
              ? 'No activity entries match your current search or filter criteria. Try resetting filters.'
              : 'There are currently no recorded activity events in the system log.'}
          </p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-2xs transition-colors space-y-6">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredLogs.map((log) => {
              const categoryBadge = getCategoryBadge(log.category);
              const Icon = categoryBadge.icon;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition">
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${categoryBadge.dot}`} />
                  </div>

                  {/* Log Content Card */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-700/60 transition group-hover:border-blue-200 dark:group-hover:border-blue-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2">
                      {/* Title and Category/Action Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] sm:text-xs font-bold uppercase px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5 ${categoryBadge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          {log.category}
                        </span>

                        <span
                          className={`text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 rounded-md border ${getActionBadge(
                            log.action
                          )}`}
                        >
                          {log.action.replace('_', ' ')}
                        </span>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {log.title}
                        </h4>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap self-start">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span title={new Date(log.timestamp).toLocaleString()}>
                          {formatTimeAgo(log.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Narrative Description */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                      {log.description}
                    </p>

                    {/* Footer Meta & Performer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      {/* Performed by */}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                          {log.performedBy.name.charAt(0)}
                        </div>
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200">{log.performedBy.name}</strong>{' '}
                          <span className="text-[11px] text-slate-400">({log.performedBy.role.toUpperCase()})</span>
                        </span>
                      </div>

                      {/* Target entity or details button */}
                      <div className="flex items-center gap-2">
                        {log.targetName && (
                          <span className="text-[11px] px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                            Target: <strong className="text-slate-900 dark:text-white">{log.targetName}</strong>
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedLogForDetails(log)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Diff</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Data Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Event & Summary</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {filteredLogs.map((log) => {
                  const categoryBadge = getCategoryBadge(log.category);
                  const Icon = categoryBadge.icon;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatTimeAgo(log.timestamp)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${categoryBadge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          {log.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getActionBadge(
                            log.action
                          )}`}
                        >
                          {log.action.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {log.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {log.description}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-700 dark:text-slate-300">
                        {log.targetName ? (
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {log.targetName}
                          </span>
                        ) : (
                          <span className="text-slate-400">–</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {log.performedBy.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {log.performedBy.role.toUpperCase()}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLogForDetails(log)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Diff / Log Details Modal */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Audit Log Details & Metadata
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Event Title</span>
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedLogForDetails.title}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Description</span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mt-1 leading-relaxed">
                  {selectedLogForDetails.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Category</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLogForDetails.category}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Action Type</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLogForDetails.action}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Exact Timestamp</span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {new Date(selectedLogForDetails.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Performed By</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLogForDetails.performedBy.name} ({selectedLogForDetails.performedBy.role})
                  </p>
                </div>
              </div>

              {selectedLogForDetails.metadata && Object.keys(selectedLogForDetails.metadata).length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Captured Metadata & Payload Diff
                  </span>
                  <div className="bg-slate-950 text-slate-100 font-mono text-xs p-3.5 rounded-xl mt-1 overflow-x-auto border border-slate-800">
                    <pre>{JSON.stringify(selectedLogForDetails.metadata, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Audit Note Modal */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Administrative Audit Note
                </h3>
              </div>
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAuditNoteSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Faculty Evaluation Review Completed"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value as ActivityCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="GENERAL">General Audit</option>
                    <option value="TRAINER">Faculty / Trainer</option>
                    <option value="STUDENT">Student / Trainee</option>
                    <option value="SYSTEM">System Master</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Subject (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Batch 20 or Trainer Name"
                    value={newNote.targetName}
                    onChange={(e) => setNewNote({ ...newNote, targetName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Audit Narrative *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the administrative decision, reason for change, or inspection notes..."
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  Record Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Clear Activity Logs?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to purge all system activity logs? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearActivityLogs();
                  setIsClearConfirmOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
