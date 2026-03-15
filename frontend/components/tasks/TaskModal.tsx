"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  title: string;
  initialData?: { title: string; description?: string };
  mode?: "create" | "edit";
}

import { useState, useEffect } from "react";

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialData,
  mode = "edit"
}: TaskModalProps) {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    } else {
        setFormData({ title: "", description: "" });
    }
    setShowError(false);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setShowError(true);
      return;
    }
    onSave(formData);
    setShowError(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (showError) setShowError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
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
            className="relative bg-white rounded-2xl shadow-2xl border border-zinc-100 w-full max-w-md p-6 overflow-hidden"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
              <p className="text-sm text-zinc-500">
                {mode === "edit" ? "All fields are required to update." : "All fields are required to create a task."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Title *</label>
                <input
                  autoFocus
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#702963]/20 focus:border-[#702963] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#702963]/20 focus:border-[#702963] transition-all"
                />
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-50">
                <div className="h-4">
                  {showError && (
                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest animate-pulse max-w-[150px]">
                      Please enter both title and description
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#702963] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/10 hover:shadow-purple-00/20 active:scale-95 transition-all"
                  >
                    {mode === "edit" ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
