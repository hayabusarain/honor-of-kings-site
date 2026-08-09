'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'error', duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'warning' ? 'bg-amber-600' : 'bg-red-600';
  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : '✗';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all duration-300 ${
        bgColor
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{message}</span>
      <button
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}
