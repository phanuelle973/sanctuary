export type JournalTime = "morning" | "evening";

// SPECK application questions (from SOAP method)
export interface SpeckAnswers {
  sin?: string;       // S — Sin to avoid
  promise?: string;   // P — Promise to claim
  example?: string;   // E — Example to follow
  command?: string;   // C — Command to obey
  know?: string;      // K — Something to know about God
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  time: JournalTime;
  // SOAP fields
  scripture?: string;       // S — passage reference + translation
  observation?: string;     // O — Look, Listen, Learn
  speck?: SpeckAnswers;     // A — Application (SPECK)
  prayer?: string;          // P — Prayer / Plan response
  // General / legacy
  content: string;          // general notes (kept for backward compat)
  mood?: "grateful" | "peaceful" | "hopeful" | "struggling" | "joyful";
  verse?: string;
  createdAt: string;
}

export interface ReadingEntry {
  id: string;
  date: string;
  book: string;
  chapter: number;
  completed: boolean;
  notes?: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  schedule: PlanDay[];
  currentDayIndex: number;
}

export interface PlanDay {
  dayNumber: number;
  passages: Passage[];
  completed: boolean;
}

export interface Passage {
  book: string;
  startChapter: number;
  endChapter?: number;
  startVerse?: number;
  endVerse?: number;
}

export interface ReadingGoal {
  id: string;
  title: string;
  type: "chapters_per_week" | "books_per_year" | "finish_testament" | "custom";
  target: number;
  current: number;
  deadline?: string;
}

export interface AppData {
  journalEntries: JournalEntry[];
  readingEntries: ReadingEntry[];
  readingPlan: ReadingPlan | null;
  goals: ReadingGoal[];
  streak: number;
  lastReadDate: string | null;
}
