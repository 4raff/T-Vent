"use client";

import { useEffect, useState } from "react";

export default function Toast({ 
  message, 
  type = "info", 
  duration = 3000, 
  onTutup 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onTutup) onTutup();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onTutup]);

  if (!message || !isVisible) return null;

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  }[type];

  const iconBg = {
    success: "bg-green-100",
    error: "bg-red-100",
    warning: "bg-yellow-100",
    info: "bg-blue-100",
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 ${bgColor} border rounded-lg shadow-lg p-4 max-w-md`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBg} flex items-center justify-center ${textColor} font-bold text-sm`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onTutup) onTutup();
          }}
          className={`flex-shrink-0 text-xl leading-none ${textColor} hover:opacity-70 transition`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
