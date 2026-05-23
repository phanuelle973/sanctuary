"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, BookOpen, Plus } from "lucide-react";
import { AppData, ReadingPlan, ReadingEntry } from "@/types";
import { BIBLE_BOOKS, READING_PLAN_TEMPLATES, getChapterCount } from "@/lib/bible";

interface PlannerViewProps {
  data: AppData;
  onMarkReading: (entry: Omit<ReadingEntry, "id">) => void;
  onSetPlan: (plan: ReadingPlan) => void;
  onAdvanceDay: () => void;
}

export default function PlannerView({ data, onMarkReading, onSetPlan, onAdvanceDay }: PlannerViewProps) {
  const [view, setView] = useState<"plan" | "log" | "choose">("plan");
  const [logBook, setLogBook] = useState(BIBLE_BOOKS[0].name);
  const [logChapter, setLogChapter] = useState(1);
  const [logNotes, setLogNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const plan = data.readingPlan;
  const today = format(new Date(), "yyyy-MM-dd");
  const todayReadings = data.readingEntries.filter((e) => e.date === today);

  function handleLogReading() {
    onMarkReading({ date: today, book: logBook, chapter: logChapter, completed: true, notes: logNotes || undefined });
    setSaved(true);
    setLogNotes("");
    setTimeout(() => setSaved(false), 2000);
  }

  function handleChoosePlan(templateId: string) {
    const tmpl = READING_PLAN_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    // Build a simple schedule (for demo, each day = one passage)
    const schedule = buildSchedule(templateId, tmpl.daysTotal);
    const newPlan: ReadingPlan = {
      id: crypto.randomUUID(),
      name: tmpl.name,
      description: tmpl.description,
      startDate: today,
      schedule,
      currentDayIndex: 0,
    };
    onSetPlan(newPlan);
    setView("plan");
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1 style={{ fontSize: "1.75rem" }}>Reading Plan</h1>
        <button className="btn btn-ghost" style={{ fontSize: "0.8125rem" }} onClick={() => setView("log")}>
          <Plus size={15} /> Log Reading
        </button>
      </header>

      <main className="container" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <div className="tab-bar">
          <button className={`tab${view === "plan" ? " active" : ""}`} onClick={() => setView("plan")}>📋 My Plan</button>
          <button className={`tab${view === "log" ? " active" : ""}`} onClick={() => setView("log")}>✍️ Log</button>
          <button className={`tab${view === "choose" ? " active" : ""}`} onClick={() => setView("choose")}>🗺️ Plans</button>
        </div>

        {/* ── PLAN TAB ── */}
        {view === "plan" && (
          <>
            {plan ? (
              <div className="animate-fade-in">
                {/* Plan header */}
                <div className="card" style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h2 style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>{plan.name}</h2>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{plan.description}</p>
                    </div>
                    <span className="tag tag-sage">Day {plan.currentDayIndex + 1}/{plan.schedule.length}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: "1rem", width: "100%" }}>
                    <div
                      className="progress-bar-fill sage"
                      style={{ width: `${Math.round((plan.currentDayIndex / plan.schedule.length) * 100)}%` }}
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    {Math.round((plan.currentDayIndex / plan.schedule.length) * 100)}% complete
                  </p>
                </div>

                {/* Today's passage */}
                {plan.schedule[plan.currentDayIndex] && (
                  <div className="verse-card" style={{ marginBottom: "1rem", textAlign: "left" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                      Today&rsquo;s Passage
                    </p>
                    {plan.schedule[plan.currentDayIndex].passages.map((p, i) => (
                      <p key={i} className="verse-text" style={{ fontSize: "1.3rem", fontStyle: "italic" }}>
                        {p.book} {p.startChapter}{p.endChapter && p.endChapter !== p.startChapter ? `–${p.endChapter}` : ""}
                      </p>
                    ))}
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "1rem" }}
                      onClick={() => {
                        const p = plan.schedule[plan.currentDayIndex].passages[0];
                        onMarkReading({ date: today, book: p.book, chapter: p.startChapter, completed: true });
                        onAdvanceDay();
                      }}
                    >
                      <CheckCircle2 size={15} /> Mark Complete
                    </button>
                  </div>
                )}

                {/* Upcoming days */}
                <h3 className="section-title" style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Upcoming</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {plan.schedule.slice(plan.currentDayIndex + 1, plan.currentDayIndex + 6).map((day, i) => (
                    <div key={i} className="card" style={{ padding: "0.875rem", opacity: 0.75 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                          Day {plan.currentDayIndex + 2 + i} &mdash;&nbsp;
                          {day.passages.map((p) => `${p.book} ${p.startChapter}${p.endChapter && p.endChapter !== p.startChapter ? `–${p.endChapter}` : ""}`).join(", ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state animate-fade-in">
                <span className="empty-state-icon">📜</span>
                <p>No reading plan active yet.</p>
                <button className="btn btn-primary" style={{ marginTop: "1.25rem" }} onClick={() => setView("choose")}>
                  Choose a Plan
                </button>
              </div>
            )}
          </>
        )}

        {/* ── LOG TAB ── */}
        {view === "log" && (
          <div className="card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem" }}>Log a Reading</h2>

            <div className="field">
              <label className="label">Book</label>
              <select className="select" value={logBook} onChange={(e) => { setLogBook(e.target.value); setLogChapter(1); }}>
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Chapter</label>
              <select className="select" value={logChapter} onChange={(e) => setLogChapter(Number(e.target.value))}>
                {Array.from({ length: getChapterCount(logBook) }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Notes (optional)</label>
              <textarea className="textarea" value={logNotes} onChange={(e) => setLogNotes(e.target.value)} placeholder="Any reflections or notes…" rows={3} />
            </div>

            <button className={`btn ${saved ? "btn-sage" : "btn-primary"}`} onClick={handleLogReading}>
              <BookOpen size={15} /> {saved ? "Logged! ✓" : "Log Reading"}
            </button>

            {todayReadings.length > 0 && (
              <div>
                <div className="divider" />
                <p className="label" style={{ marginBottom: "0.5rem" }}>Today&rsquo;s readings</p>
                {todayReadings.map((r) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0", borderBottom: "1px solid var(--border-soft)" }}>
                    <CheckCircle2 size={14} color="var(--sage-dark)" />
                    <span style={{ fontSize: "0.875rem" }}>{r.book} {r.chapter}</span>
                    {r.notes && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>&mdash; {r.notes}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CHOOSE TAB ── */}
        {view === "choose" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Choose a structured reading plan to guide your daily scripture practice.
            </p>
            {READING_PLAN_TEMPLATES.map((tmpl) => (
              <div key={tmpl.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>{tmpl.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{tmpl.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="tag tag-sage">{tmpl.daysTotal} days</span>
                  <button className="btn btn-primary" onClick={() => handleChoosePlan(tmpl.id)}>
                    Start Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

// ─── Schedule builder ─────────────────────────────────────────
function buildSchedule(templateId: string, days: number): ReadingPlan["schedule"] {
  type BibleBook = { name: string; chapters: number; testament: string };
  let books: BibleBook[] = [];

  if (templateId === "nt-90") {
    books = BIBLE_BOOKS.filter((b) => b.testament === "NT") as unknown as BibleBook[];
  } else if (templateId === "gospels") {
    books = BIBLE_BOOKS.filter((b) => ["Matthew","Mark","Luke","John"].includes(b.name)) as unknown as BibleBook[];
  } else if (templateId === "psalms-proverbs") {
    books = BIBLE_BOOKS.filter((b) => ["Psalms","Proverbs"].includes(b.name)) as unknown as BibleBook[];
  } else {
    books = [...BIBLE_BOOKS] as unknown as BibleBook[];
  }

  const allPassages: { book: string; chapter: number }[] = [];
  for (const book of books) {
    for (let c = 1; c <= book.chapters; c++) {
      allPassages.push({ book: book.name, chapter: c });
    }
  }

  const perDay = Math.ceil(allPassages.length / days);
  const schedule = [];
  for (let i = 0; i < days; i++) {
    const slice = allPassages.slice(i * perDay, (i + 1) * perDay);
    if (slice.length === 0) {
      schedule.push({ dayNumber: i + 1, passages: [{ book: "Psalms", startChapter: 1 }], completed: false });
      continue;
    }
    // Group consecutive chapters in the same book
    const groups: { book: string; startChapter: number; endChapter: number }[] = [];
    let cur = { book: slice[0].book, startChapter: slice[0].chapter, endChapter: slice[0].chapter };
    for (let j = 1; j < slice.length; j++) {
      const s = slice[j];
      if (s.book === cur.book && s.chapter === cur.endChapter + 1) {
        cur.endChapter = s.chapter;
      } else {
        groups.push(cur);
        cur = { book: s.book, startChapter: s.chapter, endChapter: s.chapter };
      }
    }
    groups.push(cur);
    schedule.push({
      dayNumber: i + 1,
      passages: groups.map((g) => ({ book: g.book, startChapter: g.startChapter, endChapter: g.endChapter })),
      completed: false,
    });
  }
  return schedule;
}
