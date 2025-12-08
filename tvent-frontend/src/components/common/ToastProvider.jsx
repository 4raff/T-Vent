"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => {
      // Replace existing toast of same type, or add new one
      const filtered = prev.filter((toast) => toast.type !== type);
      return [...filtered, { id, message, type, duration }];
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration = 3000) => addToast(message, "success", duration),
    [addToast]
  );

  const showError = useCallback(
    (message, duration = 4000) => addToast(message, "error", duration),
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration = 3500) => addToast(message, "warning", duration),
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => addToast(message, "info", duration),
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onTutup={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
