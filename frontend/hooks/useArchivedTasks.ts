"use client";

import { useState, useCallback, useEffect } from "react";
import { ArchivedTask } from "@/types";
import { api } from "@/lib/api";

export function useArchivedTasks() {
  const [tasks, setTasks] = useState<ArchivedTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.tasks.getHistory();
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteArchivedTask = async (id: string) => {
    await api.tasks.deleteHistory(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return { tasks, loading, fetchHistory, deleteArchivedTask };
}
