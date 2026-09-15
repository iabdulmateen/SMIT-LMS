import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useLMS();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'bg-white border-emerald-200 text-slate-800 shadow-lg';
        let iconColor = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-white border-rose-200 text-slate-800 shadow-lg';
          iconColor = 'text-rose-600';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'bg-white border-amber-200 text-slate-800 shadow-lg';
          iconColor = 'text-amber-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'bg-white border-blue-200 text-slate-800 shadow-lg';
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3 flex items-start gap-3 transition-all duration-200 transform translate-y-0 ${colorClasses}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
