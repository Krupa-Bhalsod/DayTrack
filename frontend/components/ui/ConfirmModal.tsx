"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-zinc-100 w-full max-w-sm p-6 overflow-hidden text-center"
          >
            <div className={`mx-auto w-12 h-12 ${variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'} rounded-full flex items-center justify-center mb-4`}>
              {variant === 'danger' ? <Trash2 size={24} /> : <AlertCircle size={24} />}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
              <div className="text-sm text-zinc-500 mt-2 font-medium leading-relaxed">
                {message}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className={`flex-1 ${variant === 'danger' ? 'bg-zinc-900 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'} text-white py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-100 rounded-xl hover:bg-zinc-50"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
