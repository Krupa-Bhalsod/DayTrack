"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAdd: (data: { title: string; description: string }) => void;
  isOpen: boolean;
  onToggle: () => void;
  onCancel: () => void;
}

export default function TaskInput({ onAdd, isOpen, onToggle, onCancel }: TaskInputProps) {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setShowError(true);
      return;
    }
    onAdd(formData);
    setFormData({ title: "", description: "" });
    setShowError(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (showError) setShowError(false);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Today's Tasks</h1>
            <p className="text-zinc-400 text-sm font-medium">Capture your daily wins.</p>
          </div>
        </div>
        <button
          onClick={() => {
            onToggle();
            setShowError(false);
          }}
          className="bg-[#702963] hover:bg-[#5a2150] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all text-sm shadow-sm"
        >
          <Plus size={16} />
          Add Task
        </button>
      </header>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Title *</label>
             <input
               autoFocus
               value={formData.title}
               onChange={(e) => handleInputChange("title", e.target.value)}
               placeholder="What's the main goal?"
               className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#702963]"
             />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Description *</label>
             <textarea
               value={formData.description}
               onChange={(e) => handleInputChange("description", e.target.value)}
               placeholder="Add some context..."
               className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-[#702963]"
             />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4">
              {showError && (
                <p className="text-[10px] text-rose-500 font-black uppercase tracking-wider animate-pulse">
                  Please enter both title and description
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onCancel();
                  setShowError(false);
                }}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#702963] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-all"
              >
                Save Task
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
