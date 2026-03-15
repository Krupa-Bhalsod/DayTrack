"use client";

import { useTodayTasks } from "@/hooks/useTodayTasks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Task } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import TaskInput from "@/components/tasks/TaskInput";
import TaskModal from "@/components/tasks/TaskModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

export default function DayTrack() {
  const {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTaskStatus,
    updateTaskDetails,
    deleteTask,
  } = useTodayTasks();

  const handleMessage = useCallback((data: any) => {
    if (data.type === "TASK_COMPLETED" || data.type === "EOD_SUMMARY") {
      fetchTasks();
    }
  }, [fetchTasks]);

  const { notifications } = useWebSocket("69b5a3a2a11fcd72c90f24f6", handleMessage);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleCreateTask = async (data: { title: string; description: string }) => {
    await addTask(data);
    setShowAddForm(false);
  };

  const handleUpdateTask = async (data: { title: string; description: string }) => {
    if (editingTask) {
      await updateTaskDetails(editingTask._id, data);
      setEditingTask(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <TaskInput
        onAdd={handleCreateTask}
        isOpen={showAddForm}
        onToggle={() => setShowAddForm(!showAddForm)}
        onCancel={() => setShowAddForm(false)}
      />

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task as any}
              onUpdateStatus={updateTaskStatus as any}
              onEdit={setEditingTask as any}
              onDelete={setTaskToDelete as any}
            />
          ))}
        </AnimatePresence>

        {!loading && tasks.length === 0 && (
          <div className="border border-dashed border-zinc-200 rounded-xl p-16 text-center">
            <p className="text-zinc-300 text-sm font-medium tracking-tight">
                Your task list is empty. Take the first step!
            </p>
          </div>
        )}
        
        {loading && tasks.length === 0 && (
           <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-[#702963] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">Loading tasks...</p>
           </div>
        )}
      </div>

      <NotificationCenter notifications={notifications} />

      <TaskModal
        isOpen={!!editingTask}
        title="Edit Task"
        initialData={editingTask || undefined}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
        mode="edit"
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes"
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
