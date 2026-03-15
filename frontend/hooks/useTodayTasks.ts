"use client";

import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types";
import { api } from "@/lib/api";

export function useTodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.tasks.getToday();
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (data: { title: string; description?: string }) => {
    await api.tasks.create({ ...data, status: "PENDING" });
    await fetchTasks();
  };

  const updateTaskStatus = async (id: string, status: string) => {
    await api.tasks.update(id, { status });
    await fetchTasks();
  };

  const updateTaskDetails = async (id: string, data: { title: string; description: string }) => {
    await api.tasks.update(id, data);
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await api.tasks.delete(id);
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTaskStatus,
    updateTaskDetails,
    deleteTask,
  };
}
