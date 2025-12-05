"use client";

import { useEffect } from "react";

export default function Toast({ message, open, onClose, variant = "info", actionLabel, onAction }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const bg = variant === "success" ? "bg-emerald-600" : variant === "error" ? "bg-red-600" : "bg-slate-700";

  return (
    <div className="fixed right-4 bottom-4 z-60">
      <div className={`${bg} text-white px-4 py-2 rounded shadow flex items-center gap-3`}> 
        <div className="flex-1">{message}</div>
        {actionLabel && (
          <button onClick={onAction} className="underline text-white text-sm">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
