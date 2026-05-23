"use client";

import { useState, useEffect, useCallback } from "react";
import { AppData } from "@/types";
import {
  loadData,
  saveData,
  addJournalEntry,
  updateJournalEntry,
  markReadingComplete,
  setReadingPlan,
  advancePlanDay,
  addGoal,
  updateGoal,
  getJournalForDate,
  getTodayStats,
} from "@/lib/storage";
import type { JournalEntry, ReadingEntry, ReadingGoal, ReadingPlan } from "@/types";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setIsLoaded(true);
  }, []);

  const refresh = useCallback(() => {
    setData(loadData());
  }, []);

  const handleAddJournal = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      const result = addJournalEntry(entry);
      refresh();
      return result;
    },
    [refresh]
  );

  const handleUpdateJournal = useCallback(
    (id: string, updates: Partial<JournalEntry>) => {
      updateJournalEntry(id, updates);
      refresh();
    },
    [refresh]
  );

  const handleMarkReading = useCallback(
    (entry: Omit<ReadingEntry, "id">) => {
      const result = markReadingComplete(entry);
      refresh();
      return result;
    },
    [refresh]
  );

  const handleSetPlan = useCallback(
    (plan: ReadingPlan) => {
      setReadingPlan(plan);
      refresh();
    },
    [refresh]
  );

  const handleAdvanceDay = useCallback(() => {
    advancePlanDay();
    refresh();
  }, [refresh]);

  const handleAddGoal = useCallback(
    (goal: Omit<ReadingGoal, "id">) => {
      const result = addGoal(goal);
      refresh();
      return result;
    },
    [refresh]
  );

  const handleUpdateGoal = useCallback(
    (id: string, current: number) => {
      updateGoal(id, current);
      refresh();
    },
    [refresh]
  );

  const handleResetData = useCallback(() => {
    saveData({
      journalEntries: [],
      readingEntries: [],
      readingPlan: null,
      goals: [],
      streak: 0,
      lastReadDate: null,
    });
    refresh();
  }, [refresh]);

  return {
    data,
    isLoaded,
    getJournalForDate,
    getTodayStats,
    addJournal: handleAddJournal,
    updateJournal: handleUpdateJournal,
    markReading: handleMarkReading,
    setPlan: handleSetPlan,
    advanceDay: handleAdvanceDay,
    addGoal: handleAddGoal,
    updateGoal: handleUpdateGoal,
    resetData: handleResetData,
  };
}
