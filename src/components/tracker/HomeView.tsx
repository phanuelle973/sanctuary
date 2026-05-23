"use client";

import { format } from "date-fns";
import { Flame, BookOpen, CheckCircle2 } from "lucide-react";
import { getDailyVerse } from "@/lib/bible";
import { AppData } from "@/types";
import { getJournalForDate } from "@/lib/storage";
import type { Tab } from "@/components/ui/Nav";

interface HomeViewProps {
  data: AppData;
  onNavigate: (tab: Tab) => void;
  onOpenJournal: (time: "morning" | "evening") => void;
}

export default function HomeView({ data, onNavigate, onOpenJournal }: HomeViewProps) {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const verse = getDailyVerse(today);
  const journals = getJournalForDate(todayStr);
  const todayReadings = data.readingEntries.filter((e) => e.date === todayStr);
  const isMorning = today.getHours() < 12;

  const plan = data.readingPlan;
  const currentDay = plan?.schedule[plan.currentDayIndex];

  const greeting = isMorning
    ? "Good morning"
    : today.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-text"><em>Sanctuary</em></span>
        </div>
        <div className="streak-badge">
          <Flame size={14} />
          {data.streak} day{data.streak !== 1 ? "s" : ""}
        </div>
      </header>

      <main className="container" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Greeting */}
        <div className="animate-fade-up">
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
            {format(today, "EEEE, MMMM d")}
          </p>
          <h1 style={{ marginTop: "0.25rem" }}>{greeting} 🌿</h1>
        </div>

        {/* Daily Verse */}
        <div className="verse-card animate-fade-up delay-1">
          <p className="verse-text">{verse.verse}</p>
          <p className="verse-ref">{verse.ref}</p>
        </div>

        {/* Today's Progress */}
        <div className="animate-fade-up delay-2">
          <div className="section-header">
            <h2 className="section-title">Today&rsquo;s Practice</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <CheckCard
              label="Morning Journal"
              done={!!journals.morning}
              icon="🌅"
              onClick={() => onOpenJournal("morning")}
            />
            <CheckCard
              label="Evening Journal"
              done={!!journals.evening}
              icon="🌙"
              onClick={() => onOpenJournal("evening")}
            />
            <CheckCard
              label="Reading"
              done={todayReadings.length > 0}
              icon="📖"
              onClick={() => onNavigate("planner")}
            />
            <CheckCard
              label="On Track"
              done={data.streak > 0 && data.lastReadDate === todayStr}
              icon="✨"
              static
            />
          </div>
        </div>

        {/* Reading Plan Summary */}
        {plan && currentDay && (
          <div className="card animate-fade-up delay-3">
            <div className="section-header" style={{ marginBottom: "0.75rem" }}>
              <h3 className="section-title" style={{ fontSize: "1.15rem" }}>{plan.name}</h3>
              <span className="tag tag-sage">Day {plan.currentDayIndex + 1}</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {currentDay.passages.map((p) =>
                `${p.book} ${p.startChapter}${p.endChapter && p.endChapter !== p.startChapter ? `–${p.endChapter}` : ""}`
              ).join(" · ")}
            </p>
            <div className="progress-bar" style={{ width: "100%" }}>
              <div
                className="progress-bar-fill sage"
                style={{
                  width: `${Math.round(((plan.currentDayIndex) / plan.schedule.length) * 100)}%`,
                }}
              />
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {plan.currentDayIndex} of {plan.schedule.length} days complete
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => onNavigate("planner")}
            >
              <BookOpen size={15} /> View Plan
            </button>
          </div>
        )}

        {/* Activity Heatmap */}
        <div className="card animate-fade-up delay-4">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: "1.15rem" }}>This Month</h3>
          </div>
          <Heatmap data={data} />
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--sage)", display: "inline-block" }} /> Read
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--rose)", display: "inline-block" }} /> Journaled
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--sage-dark)", display: "inline-block" }} /> Both
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}

function CheckCard({
  label, done, icon, onClick, static: isStatic,
}: {
  label: string; done: boolean; icon: string; onClick?: () => void; static?: boolean;
}) {
  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        textAlign: "left",
        cursor: isStatic ? "default" : "pointer",
        border: done ? "1.5px solid var(--sage)" : "1px solid var(--border)",
        background: done ? "rgba(181, 196, 168, 0.15)" : "var(--surface)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-light)" }}>{label}</span>
      {done && (
        <CheckCircle2 size={16} color="var(--sage-dark)" />
      )}
    </button>
  );
}

function Heatmap({ data }: { data: AppData }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const readDates = new Set(data.readingEntries.map((e) => e.date));
  const journalDates = new Set(data.journalEntries.map((e) => e.date));

  const cells = [];
  // padding
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`p${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isRead = readDates.has(dateStr);
    const isJournaled = journalDates.has(dateStr);
    const isToday = d === today.getDate();
    let cls = "heatmap-cell";
    if (isRead && isJournaled) cls += " both";
    else if (isRead) cls += " read";
    else if (isJournaled) cls += " journaled";
    if (isToday) cls += " today";
    cells.push(<div key={d} className={cls} title={dateStr} />);
  }

  return <div className="heatmap-grid">{cells}</div>;
}
