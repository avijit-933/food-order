import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 text-gray-800 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          {toast.type === 'success' && (
            <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
              <CheckCircle2 size={18} />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="p-1 rounded-full bg-rose-100 text-rose-600 shrink-0">
              <AlertCircle size={18} />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="p-1 rounded-full bg-orange-100 text-orange-600 shrink-0">
              <Info size={18} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-gray-900">{toast.title}</h5>
            {toast.description && (
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-700 p-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
