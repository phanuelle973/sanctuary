"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { JournalEntry, SpeckAnswers, AppData } from "@/types";
import { getJournalForDate } from "@/lib/storage";

function Save({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12l2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M6 10h12" />
      <path d="M9 4v4h6V4" />
    </svg>
  );
}

function ChevronLeft({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BookOpen({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5C4 18.12 4 17.44 4.22 16.89A2 2 0 0 1 6 15h5a2 2 0 0 1 2 2v2.5" />
      <path d="M20 19.5C20 18.12 20 17.44 19.78 16.89A2 2 0 0 0 18 15h-5a2 2 0 0 0-2 2v2.5" />
      <path d="M4 6.5C4 7.88 4 8.56 4.22 9.11A2 2 0 0 0 6 11h5a2 2 0 0 0 2-2V6.5" />
      <path d="M20 6.5C20 7.88 20 8.56 19.78 9.11A2 2 0 0 1 18 11h-5a2 2 0 0 1-2-2V6.5" />
    </svg>
  );
}

const MOODS = [
  { key: "grateful", emoji: "🙏", label: "Grateful" },
  { key: "peaceful", emoji: "🕊️", label: "Peaceful" },
  { key: "hopeful", emoji: "🌱", label: "Hopeful" },
  { key: "struggling", emoji: "💙", label: "Struggling" },
  { key: "joyful", emoji: "✨", label: "Joyful" },
] as const;

type Mood = (typeof MOODS)[number]["key"];

const SPECK_FIELDS: { key: keyof SpeckAnswers; letter: string; label: string; prompt: string; color: string }[] = [
  { key: "sin", letter: "S", label: "Sin to Avoid", prompt: "Is there a sin warned against or an attitude I need to check?", color: "var(--dusty-rose)" },
  { key: "promise", letter: "P", label: "Promise to Claim", prompt: "Is there a promise from God I can hold onto today?", color: "var(--sage-dark)" },
  { key: "example", letter: "E", label: "Example to Follow", prompt: "Is there a person or action in this passage worth imitating?", color: "var(--lavender-mid)" },
  { key: "command", letter: "C", label: "Command to Obey", prompt: "Is there a direct instruction God is asking me to follow?", color: "var(--gold)" },
  { key: "know", letter: "K", label: "Something to Know About God", prompt: "What does this passage reveal about God's character or nature?", color: "var(--sky)" },
];

interface JournalViewProps {
  data: AppData;
  defaultTime?: "morning" | "evening";
  onSave: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
}

type SoapStep = "S" | "O" | "A" | "P" | "history";

export default function JournalView({ data, defaultTime = "morning", onSave }: JournalViewProps) {
  const [activeTime, setActiveTime] = useState<"morning" | "evening">(defaultTime);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [step, setStep] = useState<SoapStep>("S");

  // SOAP fields
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [speck, setSpeck] = useState<SpeckAnswers>({});
  const [prayer, setPrayer] = useState("");
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  // Load existing entry when tab/date changes
  useEffect(() => {
    const journals = getJournalForDate(date);
    const entry = journals[activeTime];
    setScripture(entry?.scripture ?? "");
    setObservation(entry?.observation ?? "");
    setSpeck(entry?.speck ?? {});
    setPrayer(entry?.prayer ?? "");
    setMood(entry?.mood);
    setSaved(false);
  }, [activeTime, date]);

  function handleSave() {
    const hasContent = scripture || observation || Object.values(speck).some(Boolean) || prayer;
    if (!hasContent) return;
    onSave({
      date,
      time: activeTime,
      content: [scripture, observation, prayer].filter(Boolean).join(" | "),
      scripture: scripture || undefined,
      observation: observation || undefined,
      speck: Object.values(speck).some(Boolean) ? speck : undefined,
      prayer: prayer || undefined,
      mood,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function shiftDate(delta: number) {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + delta);
    setDate(format(d, "yyyy-MM-dd"));
  }

  const isToday = date === format(new Date(), "yyyy-MM-dd");
  const recent = data.journalEntries.slice(0, 10);

  const STEPS: SoapStep[] = ["S", "O", "A", "P"];
  const stepLabels: Record<SoapStep, string> = {
    S: "Scripture", O: "Observation", A: "Application", P: "Prayer", history: "History"
  };

  return (
    <div className="page">
      <header className="app-header">
        <h1 style={{ fontSize: "1.75rem" }}>Journal</h1>
        <button
          className={`btn ${saved ? "btn-sage" : "btn-primary"}`}
          onClick={handleSave}
          style={{ fontSize: "0.8125rem" }}
        >
          <Save size={14} /> {saved ? "Saved ✓" : "Save"}
        </button>
      </header>

      <main className="container" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Date + Time navigator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
            <button className="btn btn-ghost" style={{ padding: "0.4rem" }} onClick={() => shiftDate(-1)}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontStyle: "italic", minWidth: "12rem", textAlign: "center" }}>
              {isToday ? "Today" : format(new Date(date + "T12:00:00"), "EEEE, MMMM d")}
            </span>
            <button className="btn btn-ghost" style={{ padding: "0.4rem" }} onClick={() => shiftDate(1)} disabled={isToday}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="tab-bar">
            <button className={`tab${activeTime === "morning" ? " active" : ""}`} onClick={() => setActiveTime("morning")}>
              🌅 Morning
            </button>
            <button className={`tab${activeTime === "evening" ? " active" : ""}`} onClick={() => setActiveTime("evening")}>
              🌙 Evening
            </button>
          </div>
        </div>

        {/* SOAP step nav */}
        <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto", paddingBottom: "2px" }}>
          {STEPS.map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              style={{
                flex: "0 0 auto",
                padding: "0.4rem 1rem",
                borderRadius: "var(--r-md)",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.03em",
                transition: "all var(--dur) var(--ease)",
                background: step === s ? "var(--dusty-rose)" : "var(--surface-alt)",
                color: step === s ? "#fff" : "var(--text-muted)",
                boxShadow: step === s ? "0 2px 8px rgba(201,123,119,0.3)" : "none",
              }}
            >
              {s} — {stepLabels[s]}
            </button>
          ))}
          <button
            onClick={() => setStep("history")}
            style={{
              flex: "0 0 auto",
              padding: "0.4rem 1rem",
              borderRadius: "var(--r-md)",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8125rem",
              letterSpacing: "0.03em",
              transition: "all var(--dur) var(--ease)",
              background: step === "history" ? "var(--dusty-rose)" : "var(--surface-alt)",
              color: step === "history" ? "#fff" : "var(--text-muted)",
            }}
          >
            History
          </button>
        </div>

        {/* ── S — SCRIPTURE ── */}
        {step === "S" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SoapHeader
              letter="S"
              title="Scripture"
              verse="Romans 10:17 — faith comes by hearing, and hearing by the word of God."
              tip="Pick a translation that speaks to you. Read slowly. Let it land."
            />
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="field">
                <label className="label">Passage &amp; Translation</label>
                <input
                  className="input"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  placeholder="e.g. John 3:16–21 (NIV)"
                />
              </div>
              <div className="field">
                <label className="label">Mood as I come to the Word</label>
                <div className="mood-grid">
                  {MOODS.map((m) => (
                    <button
                      key={m.key}
                      className={`mood-chip${mood === m.key ? " selected" : ""}`}
                      onClick={() => setMood(mood === m.key ? undefined : m.key)}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <NextStepBtn onClick={() => setStep("O")} />
            </div>
          </div>
        )}

        {/* ── O — OBSERVATION ── */}
        {step === "O" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SoapHeader
              letter="O"
              title="Observation"
              verse="Acts 17:11 — They examined the Scriptures every day."
              tip="Look at the text. Listen for God's voice. Learn what it's saying."
            />
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {["👀 Look", "👂 Listen", "📚 Learn"].map((label) => (
                  <div key={label} style={{ background: "var(--surface-alt)", borderRadius: "var(--r-sm)", padding: "0.5rem 0.625rem", textAlign: "center", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)" }}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="field">
                <label className="label">What do you observe?</label>
                <textarea
                  className="textarea"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="What stands out? What's the context? What's repeated? What surprised you?"
                  rows={6}
                />
              </div>
              <NextStepBtn onClick={() => setStep("A")} />
            </div>
          </div>
        )}

        {/* ── A — APPLICATION (SPECK) ── */}
        {step === "A" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SoapHeader
              letter="A"
              title="Application — SPECK"
              verse="Jeremiah 15:16 — Your words were my joy and my heart's delight."
              tip="Ask each SPECK question. Answer only the ones that apply — not every passage hits every letter."
            />

            {SPECK_FIELDS.map(({ key, letter, label, prompt, color }, i) => (
              <div
                key={key}
                className={`card animate-fade-up delay-${i + 1}`}
                style={{ borderLeft: `3px solid ${color}`, paddingLeft: "1.25rem" }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem", marginBottom: "0.625rem" }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 500,
                    lineHeight: 1,
                    color,
                  }}>
                    {letter}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)" }}>{label}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.625rem", fontStyle: "italic" }}>
                  {prompt}
                </p>
                <textarea
                  className="textarea"
                  style={{ minHeight: 72 }}
                  value={speck[key] ?? ""}
                  onChange={(e) => setSpeck((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder="Write your response, or leave blank if not applicable…"
                  rows={3}
                />
              </div>
            ))}

            <NextStepBtn onClick={() => setStep("P")} />
          </div>
        )}

        {/* ── P — PRAYER / PLAN ── */}
        {step === "P" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SoapHeader
              letter="P"
              title="Prayer &amp; Plan"
              verse="Matthew 6:33 — Seek first his kingdom and his righteousness."
              tip="Respond to God in prayer. What will you do today because of what you read?"
            />
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="field">
                <label className="label">Your prayer &amp; commitment</label>
                <textarea
                  className="textarea"
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  placeholder="Lord, today I want to… / Because of this passage I will…"
                  rows={7}
                />
              </div>

              <button
                className={`btn ${saved ? "btn-sage" : "btn-primary"}`}
                onClick={handleSave}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Save size={15} /> {saved ? "Entry Saved! ✓" : "Save Journal Entry"}
              </button>
            </div>

            {/* SOAP summary */}
            {(scripture || observation || Object.values(speck).some(Boolean) || prayer) && (
              <div className="card-soft" style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <p className="label" style={{ marginBottom: 0 }}>Today&rsquo;s Entry Summary</p>
                {scripture && <SummaryRow letter="S" color="var(--dusty-rose)" text={scripture} />}
                {observation && <SummaryRow letter="O" color="var(--sage-dark)" text={observation} truncate />}
                {Object.entries(speck).filter(([, v]) => v).map(([k, v]) => {
                  const f = SPECK_FIELDS.find((x) => x.key === k);
                  return f ? <SummaryRow key={k} letter={f.letter} color={f.color} text={v!} truncate /> : null;
                })}
                {prayer && <SummaryRow letter="P" color="var(--lavender-mid)" text={prayer} truncate />}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ── */}
        {step === "history" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recent.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon"><BookOpen size={40} color="var(--border)" /></span>
                <p>No entries yet. Start your first reflection!</p>
                <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setStep("S")}>
                  Begin Today&rsquo;s Entry
                </button>
              </div>
            ) : (
              recent.map((entry) => <HistoryCard key={entry.id} entry={entry} />)
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function SoapHeader({ letter, title, verse, tip }: { letter: string; title: string; verse: string; tip: string }) {
  return (
    <div className="verse-card" style={{ textAlign: "left", padding: "1.25rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 500, lineHeight: 1, color: "var(--dusty-rose)" }}>
          {letter}
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontStyle: "italic", color: "var(--ink-light)" }}>
          {title}
        </span>
      </div>
      <p style={{ fontSize: "0.8125rem", fontStyle: "italic", color: "var(--ink-muted)", marginBottom: "0.375rem" }}>{verse}</p>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{tip}</p>
    </div>
  );
}

function NextStepBtn({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-secondary" style={{ alignSelf: "flex-end" }} onClick={onClick}>
      Next step →
    </button>
  );
}

function SummaryRow({ letter, color, text, truncate }: { letter: string; color: string; text: string; truncate?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
      <span style={{
        flexShrink: 0,
        width: 22, height: 22, borderRadius: "50%",
        background: color, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.6875rem", fontWeight: 700,
      }}>
        {letter}
      </span>
      <p style={{
        fontSize: "0.8125rem", color: "var(--text-light)", lineHeight: 1.5, flex: 1,
        ...(truncate ? { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } : {}),
      }}>
        {text}
      </p>
    </div>
  );
}

function HistoryCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false);
  const hasSpeck = entry.speck && Object.values(entry.speck).some(Boolean);

  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span className={`tag ${entry.time === "morning" ? "tag-gold" : "tag-lavender"}`}>
            {entry.time === "morning" ? "🌅 Morning" : "🌙 Evening"}
          </span>
          {entry.scripture && <span className="tag tag-rose">📖 {entry.scripture}</span>}
          {entry.mood && <span className="tag tag-sage">{MOODS.find((m) => m.key === entry.mood)?.emoji}</span>}
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>
          {format(new Date(entry.date + "T12:00:00"), "MMM d")}
        </span>
      </div>

      {entry.observation && (
        <p style={{ fontSize: "0.875rem", color: "var(--text-light)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: expanded ? undefined : 2, WebkitBoxOrient: "vertical", overflow: expanded ? "visible" : "hidden" }}>
          {entry.observation}
        </p>
      )}

      {expanded && hasSpeck && (
        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p className="label">SPECK</p>
          {SPECK_FIELDS.map(({ key, letter, label, color }) =>
            entry.speck?.[key] ? (
              <SummaryRow key={key} letter={letter} color={color} text={`${label}: ${entry.speck[key]}`} />
            ) : null
          )}
        </div>
      )}

      {expanded && entry.prayer && (
        <div style={{ marginTop: "0.75rem" }}>
          <p className="label">Prayer</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-light)", lineHeight: 1.6, fontStyle: "italic" }}>{entry.prayer}</p>
        </div>
      )}

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
        {expanded ? "Tap to collapse" : "Tap to expand"}
      </p>
    </div>
  );
}
