"use client";

import { useState } from "react";
import { useArchivedTasks } from "@/hooks/useArchivedTasks";
import { ArchivedTask } from "@/types";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { DeleteModal } from "@/components/ui/DeleteModal";

export default function HistoryPage() {
  const { tasks, loading, deleteArchivedTask } = useArchivedTasks();
  const [filterDate, setFilterDate] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<ArchivedTask | null>(null);

  const handleDeleteHistory = async () => {
    if (!taskToDelete) return;
    await deleteArchivedTask(taskToDelete._id);
    setTaskToDelete(null);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "NOT_COMPLETED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-zinc-50 text-zinc-600 border-zinc-100";
    }
  };

  const filteredTasks = filterDate 
    ? tasks.filter(t => t.archive_date === filterDate)
    : tasks;

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const date = task.archive_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, ArchivedTask[]>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Archived Section</h1>
          <p className="text-zinc-400 text-sm font-medium">Review your past performance.</p>
        </div>
        <div className="relative group">
          <div className="flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 p-2.5 rounded-lg border border-zinc-100 transition-all cursor-pointer shadow-sm relative overflow-hidden">
            <CalendarIcon size={16} className="text-[#702963]" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              onClick={(e) => (e.target as any).showPicker?.()}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-[#702963] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest text-[10px]">Accessing Archives...</p>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-2xl p-16 text-center">
            <p className="text-zinc-300 text-sm font-medium">No archived records found.</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>
              <div className="space-y-3">
                {groupedTasks[date].map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-zinc-100 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative flex items-center justify-between group min-h-[90px]"
                  >
                    <div className="flex-1 pr-32">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-zinc-800 tracking-tight">
                          {task.title}
                        </h3>
                        {task.status === 'COMPLETED' ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={14} className="text-rose-400" />
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                       <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(task.status)}`}>
                         {task.status.replace('_', ' ')}
                       </div>
                       <button 
                         onClick={() => setTaskToDelete(task)}
                         className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-zinc-50 rounded-md transition-all"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteModal 
        isOpen={!!taskToDelete}
        title="Delete Archived Task"
        itemName={taskToDelete?.title || ""}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteHistory}
      />
    </div>
  );
}
