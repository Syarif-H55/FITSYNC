'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastComponent = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
  const bgColor = 
    toast.type === 'success' ? 'bg-green-500' : 
    toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg text-white max-w-sm ${bgColor}`}
    >
      <div className="flex items-center justify-between">
        <span>{toast.message}</span>
        <button 
          onClick={onDismiss}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };

  return { toast, toasts, removeToast };
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </>
  );
};