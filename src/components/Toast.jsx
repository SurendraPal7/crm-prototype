import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

let toastId = 0;
const toastCallbacks = new Set();

export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  info: (message) => showToast(message, 'info'),
};

const showToast = (message, type) => {
  const id = ++toastId;
  const toastData = { id, message, type };
  
  toastCallbacks.forEach(callback => callback(toastData));
  
  return id;
};

const ToastItem = ({ toast: toastData, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toastData.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastData.id, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const Icon = icons[toastData.type];

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${colors[toastData.type]}
      `}
    >
      <Icon className={`w-5 h-5 ${iconColors[toastData.type]}`} />
      <span className="flex-1 text-sm font-medium">{toastData.message}</span>
      <button
        onClick={() => onRemove(toastData.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const callback = (toastData) => {
      setToasts(prev => [...prev, toastData]);
    };

    toastCallbacks.add(callback);
    return () => toastCallbacks.delete(callback);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toastData => (
        <ToastItem
          key={toastData.id}
          toast={toastData}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};