"use client";

import { useState } from "react";
import { useSummaries } from "@/hooks/useSummaries";
import { DailySummary } from "@/types";
import { BarChart3, TrendingUp, Calendar as CalendarIcon, CheckCircle2, ListTodo, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { DeleteModal } from "@/components/ui/DeleteModal";

export default function SummaryPage() {
  const { summaries, loading, deleteSummary } = useSummaries();
  const [summaryToDelete, setSummaryToDelete] = useState<DailySummary | null>(null);

  const handleDeleteSummary = async () => {
    if (!summaryToDelete) return;
    await deleteSummary(summaryToDelete._id);
    setSummaryToDelete(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Daily Summary</h1>
          <p className="text-zinc-400 text-sm font-medium">Your productivity trends at a glance.</p>
        </div>
        <div className="bg-zinc-50 px-4 py-2 rounded-lg flex items-center gap-2 border border-zinc-100">
          <TrendingUp size={16} className="text-[#702963]" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Analytics</span>
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-6 h-6 border-2 border-[#702963] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest text-[10px]">Analyzing Results...</p>
        </div>
      ) : summaries.length === 0 ? (
        <div className="border border-dashed border-zinc-200 rounded-2xl p-16 text-center">
            <p className="text-zinc-300 text-sm font-medium">No summaries found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaries.map((summary) => (
            <motion.div 
              key={summary._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <CalendarIcon size={20} className="text-[#702963]" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Generated Date</p>
                  <p className="text-base font-bold text-zinc-800">{new Date(summary.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-50 transition-colors">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ListTodo size={14} /> Tasks
                  </p>
                  <p className="text-2xl font-black text-zinc-800">{summary.tasks_created}</p>
                </div>
                <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-50/50 transition-colors">
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Done
                  </p>
                  <p className="text-2xl font-black text-emerald-600">{summary.tasks_completed}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Efficiency</span>
                  <span className="text-base font-black text-[#702963]">{summary.completion_percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.completion_percentage}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[#702963] to-purple-400 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-widest text-[9px]">
                    <Clock size={12} />
                    Pending: <span className="text-zinc-900 font-black">{summary.tasks_pending}</span>
                  </div>
                  <p className="text-[9px] text-zinc-300 font-medium">
                    Finalized {new Date(summary.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button 
                  onClick={() => setSummaryToDelete(summary)}
                  className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <DeleteModal 
        isOpen={!!summaryToDelete}
        title="Delete Record"
        itemName={summaryToDelete ? new Date(summaryToDelete.date).toLocaleDateString() : ""}
        onClose={() => setSummaryToDelete(null)}
        onConfirm={handleDeleteSummary}
      />
    </div>
  );
}
