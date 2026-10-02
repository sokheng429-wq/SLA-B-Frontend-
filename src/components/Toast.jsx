import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon toast-icon-success" />,
    warning: <AlertCircle size={18} className="toast-icon toast-icon-warning" />,
    error: <AlertCircle size={18} className="toast-icon toast-icon-error" style={{ color: '#f43f5e' }} />,
    info: <Info size={18} className="toast-icon toast-icon-info" />,
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`} role="alert" aria-live="assertive">
      <div className="toast-body">
        {icons[toast.type] || icons.info}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
