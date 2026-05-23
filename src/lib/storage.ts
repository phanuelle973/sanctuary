import { AppData, JournalEntry, ReadingEntry, ReadingGoal, ReadingPlan } from "@/types";
import { format } from "date-fns";

const STORAGE_KEY = "sanctuary_data";

export const defaultData: AppData = {
  journalEntries: [],
  readingEntries: [],
  readingPlan: null,
  goals: [],
  streak: 0,
  lastReadDate: null,
};

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">): JournalEntry {
  const data = loadData();
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  // Replace existing entry for same date+time if it exists
  const filtered = data.journalEntries.filter(
    (e) => !(e.date === entry.date && e.time === entry.time)
  );
  saveData({ ...data, journalEntries: [newEntry, ...filtered] });
  return newEntry;
}

export function updateJournalEntry(id: string, updates: Partial<JournalEntry>): void {
  const data = loadData();
  saveData({
    ...data,
    journalEntries: data.journalEntries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    ),
  });
}

export function getJournalForDate(date: string): { morning?: JournalEntry; evening?: JournalEntry } {
  const data = loadData();
  const entries = data.journalEntries.filter((e) => e.date === date);
  return {
    morning: entries.find((e) => e.time === "morning"),
    evening: entries.find((e) => e.time === "evening"),
  };
}

export function markReadingComplete(entry: Omit<ReadingEntry, "id">): ReadingEntry {
  const data = loadData();
  const newEntry: ReadingEntry = { ...entry, id: crypto.randomUUID() };
  const today = format(new Date(), "yyyy-MM-dd");

  // Update streak
  let streak = data.streak;
  const last = data.lastReadDate;
  if (!last) {
    streak = 1;
  } else if (last === today) {
    // already read today, no change
  } else {
    const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
    streak = last === yesterday ? streak + 1 : 1;
  }

  saveData({
    ...data,
    readingEntries: [newEntry, ...data.readingEntries],
    streak,
    lastReadDate: today,
  });
  return newEntry;
}

export function setReadingPlan(plan: ReadingPlan): void {
  const data = loadData();
  saveData({ ...data, readingPlan: plan });
}

export function advancePlanDay(): void {
  const data = loadData();
  if (!data.readingPlan) return;
  const plan = { ...data.readingPlan };
  if (plan.schedule[plan.currentDayIndex]) {
    plan.schedule[plan.currentDayIndex].completed = true;
  }
  plan.currentDayIndex = Math.min(plan.currentDayIndex + 1, plan.schedule.length - 1);
  saveData({ ...data, readingPlan: plan });
}

export function updateGoal(id: string, current: number): void {
  const data = loadData();
  saveData({
    ...data,
    goals: data.goals.map((g) => (g.id === id ? { ...g, current } : g)),
  });
}

export function addGoal(goal: Omit<ReadingGoal, "id">): ReadingGoal {
  const data = loadData();
  const newGoal: ReadingGoal = { ...goal, id: crypto.randomUUID() };
  saveData({ ...data, goals: [...data.goals, newGoal] });
  return newGoal;
}

export function getTodayStats() {
  const data = loadData();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayReadings = data.readingEntries.filter((e) => e.date === today);
  const journals = getJournalForDate(today);
  return {
    streak: data.streak,
    readingsToday: todayReadings.length,
    hasMorningJournal: !!journals.morning,
    hasEveningJournal: !!journals.evening,
    lastReadDate: data.lastReadDate,
  };
}
