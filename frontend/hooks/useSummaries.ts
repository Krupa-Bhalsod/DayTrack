"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { DailySummary } from "@/types";

export function useSummaries() {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.eod.getSummaries();
      setSummaries(data || []);
    } catch (error) {
      console.error("Failed to fetch summaries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const deleteSummary = async (id: string) => {
    await api.eod.deleteSummary(id);
    setSummaries((prev) => prev.filter((s) => s._id !== id));
  };

  return { summaries, loading, fetchSummaries, deleteSummary };
}
