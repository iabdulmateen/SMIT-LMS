import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useLMS();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {notifications.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 text-slate-800 dark:text-slate-100 shadow-lg';
        let iconColor = 'text-emerald-600 dark:text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-700/60 text-slate-800 dark:text-slate-100 shadow-lg';
          iconColor = 'text-rose-600 dark:text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 text-slate-800 dark:text-slate-100 shadow-lg';
          iconColor = 'text-amber-600 dark:text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700/60 text-slate-800 dark:text-slate-100 shadow-lg';
          iconColor = 'text-blue-600 dark:text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3 flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${colorClasses}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
