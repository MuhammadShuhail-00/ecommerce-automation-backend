/**
 * Toast notification component with modern glassmorphic design
 */
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, variant = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variants = {
    success: {
      bg: 'bg-gradient-to-r from-green-600/90 to-emerald-600/90',
      border: 'border-green-500/50',
      icon: '✓',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-600/90 to-pink-600/90',
      border: 'border-red-500/50',
      icon: '✕',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90',
      border: 'border-blue-500/50',
      icon: 'ℹ',
    },
  };

  const variantStyles = variants[variant];

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${variantStyles.bg} backdrop-blur-xl border ${variantStyles.border} px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right min-w-[300px] max-w-md`}
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">{variantStyles.icon}</span>
      </div>
      <span className="text-sm font-semibold text-white flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-80 hover:opacity-100 transition-opacity hover:scale-110 transform duration-200 text-white flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
