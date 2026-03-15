"use client";

import { CheckCircle2, Clock, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "NOT_COMPLETED":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }
};

export default function TaskCard({ task, onUpdateStatus, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-zinc-100 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative flex items-center justify-between group min-h-[90px]"
    >
      {/* Left Content (Wide) */}
      <div className="flex-1 pr-32">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-zinc-800 tracking-tight">
            {task.title}
          </h3>
          {task.status === 'COMPLETED' && <CheckCircle2 size={14} className="text-emerald-500" />}
          {task.status === 'IN_PROGRESS' && <Clock size={14} className="text-blue-500" />}
        </div>
        {task.description && (
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            {task.description}
          </p>
        )}
      </div>

      {/* Right Tools Area (Stacked) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-6 border-l border-zinc-50 pl-6">
        <div className="flex flex-col items-end gap-2">
          <div className="relative group">
            <select 
              value={task.status}
              onChange={(e) => onUpdateStatus(task._id, e.target.value)}
              className={`appearance-none pl-3 pr-8 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-colors ${getStatusStyles(task.status)}`}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="NOT_COMPLETED">Not Completed</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 text-zinc-500 hover:text-[#702963] hover:bg-zinc-50 rounded-md transition-all"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => onDelete(task)}
              className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-zinc-50 rounded-md transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
