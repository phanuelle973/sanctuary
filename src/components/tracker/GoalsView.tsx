"use client";

import { useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { AppData, ReadingGoal } from "@/types";
import { loadData, saveData } from "@/lib/storage";

interface GoalsViewProps {
  data: AppData;
  onAddGoal: (goal: Omit<ReadingGoal, "id">) => void;
  onUpdateGoal: (id: string, current: number) => void;
}

const GOAL_TYPES = [
  { key: "chapters_per_week", label: "Chapters per week", unit: "chapters" },
  { key: "books_per_year",    label: "Books this year",   unit: "books" },
  { key: "finish_testament",  label: "Finish Testament",  unit: "chapters" },
  { key: "custom",            label: "Custom goal",       unit: "units" },
] as const;

export default function GoalsView({ data, onAddGoal, onUpdateGoal }: GoalsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReadingGoal["type"]>("chapters_per_week");
  const [target, setTarget] = useState(5);
  const [deadline, setDeadline] = useState("");

  function handleAdd() {
    if (!title.trim() || target <= 0) return;
    onAddGoal({ title: title.trim(), type, target, current: 0, deadline: deadline || undefined });
    setTitle(""); setTarget(5); setDeadline(""); setShowForm(false);
  }

  function handleDelete(id: string) {
    const d = loadData();
    saveData({ ...d, goals: d.goals.filter((g) => g.id !== id) });
    // Force re-render by triggering a reload
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1 style={{ fontSize: "1.75rem" }}>Goals</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={15} /> New Goal
        </button>
      </header>

      <main className="container" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Add form */}
        {showForm && (
          <div className="card animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "1rem", borderColor: "var(--rose)" }}>
            <h2 style={{ fontSize: "1.15rem" }}>New Goal</h2>

            <div className="field">
              <label className="label">Goal title</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Read through the Gospels" />
            </div>

            <div className="field">
              <label className="label">Type</label>
              <select className="select" value={type} onChange={(e) => setType(e.target.value as ReadingGoal["type"])}>
                {GOAL_TYPES.map((g) => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Target ({GOAL_TYPES.find((g) => g.key === type)?.unit})</label>
              <input className="input" type="number" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
            </div>

            <div className="field">
              <label className="label">Deadline (optional)</label>
              <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button className="btn btn-primary" onClick={handleAdd}>Save Goal</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Goals list */}
        {data.goals.length === 0 && !showForm ? (
          <div className="empty-state">
            <span className="empty-state-icon"><Target size={48} color="var(--border)" /></span>
            <p>Set a reading goal to stay inspired.</p>
            <button className="btn btn-primary" style={{ marginTop: "1.25rem" }} onClick={() => setShowForm(true)}>
              <Plus size={15} /> Add Your First Goal
            </button>
          </div>
        ) : (
          data.goals.map((goal, i) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={i}
              onUpdate={(v) => onUpdateGoal(goal.id, v)}
              onDelete={() => handleDelete(goal.id)}
            />
          ))
        )}

        {/* Stats Summary */}
        {data.readingEntries.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Reading Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Stat label="Total chapters" value={data.readingEntries.length} />
              <Stat label="Day streak" value={`${data.streak} 🔥`} />
              <Stat label="Journals written" value={data.journalEntries.length} />
              <Stat label="Books touched" value={new Set(data.readingEntries.map((e) => e.book)).size} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function GoalCard({ goal, index, onUpdate, onDelete }: { goal: ReadingGoal; index: number; onUpdate: (v: number) => void; onDelete: () => void }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const done = goal.current >= goal.target;
  const colors = ["rose", "sage", "lavender", "gold"];
  const color = colors[index % colors.length];

  return (
    <div className={`card animate-fade-up delay-${Math.min(index + 1, 4)}`} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>{goal.title}</h3>
          <span className={`tag tag-${color}`}>{GOAL_TYPES.find((g) => g.key === goal.type)?.label}</span>
        </div>
        <button className="btn btn-ghost" style={{ padding: "0.3rem", color: "var(--text-muted)" }} onClick={onDelete}>
          <Trash2 size={14} />
        </button>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{goal.current} / {goal.target}</span>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: done ? "var(--sage-dark)" : "var(--text-muted)" }}>
            {done ? "✓ Complete!" : `${pct}%`}
          </span>
        </div>
        <div className="progress-bar">
          <div className={`progress-bar-fill ${color === "sage" ? "sage" : color === "lavender" ? "lavender" : ""}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button className="btn btn-ghost" style={{ padding: "0.3rem 0.75rem" }} onClick={() => onUpdate(Math.max(0, goal.current - 1))}>−</button>
        <span style={{ flex: 1, textAlign: "center", fontSize: "1.1rem", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
          {goal.current}
        </span>
        <button className="btn btn-primary" style={{ padding: "0.3rem 0.75rem" }} onClick={() => onUpdate(goal.current + 1)}>+</button>
      </div>

      {goal.deadline && (
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          🗓 By {new Date(goal.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-soft" style={{ padding: "0.875rem", borderRadius: "var(--r-md)" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)" }}>{value}</p>
    </div>
  );
}
