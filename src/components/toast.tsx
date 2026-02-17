"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={16} className="text-positive" />,
    error: <AlertTriangle size={16} className="text-negative" />,
    info: <Info size={16} className="text-blue-400" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg ${
              t.exiting ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            {icons[t.type]}
            <span className="text-sm text-text-primary">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 text-text-muted transition-colors hover:text-text-primary"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
