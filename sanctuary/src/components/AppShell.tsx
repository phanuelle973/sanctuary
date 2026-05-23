"use client";

import { useState } from "react";
import { useAppData } from "@/hooks/useAppData";
import Nav, { Tab } from "@/components/ui/Nav";
import HomeView from "@/components/tracker/HomeView";
import JournalView from "@/components/journal/JournalView";
import PlannerView from "@/components/planner/PlannerView";
import GoalsView from "@/components/tracker/GoalsView";

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [journalDefaultTime, setJournalDefaultTime] = useState<"morning" | "evening">("morning");
  const appData = useAppData();

  if (!appData.isLoaded || !appData.data) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontStyle: "italic", color: "var(--dusty-rose)" }}>
          Sanctuary
        </span>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading your practice…</p>
      </div>
    );
  }

  function openJournal(time: "morning" | "evening") {
    setJournalDefaultTime(time);
    setTab("journal");
  }

  return (
    <>
      {tab === "home" && (
        <HomeView
          data={appData.data}
          onNavigate={setTab}
          onOpenJournal={openJournal}
        />
      )}
      {tab === "journal" && (
        <JournalView
          data={appData.data}
          defaultTime={journalDefaultTime}
          onSave={(entry) => {
            appData.addJournal(entry);
          }}
        />
      )}
      {tab === "planner" && (
        <PlannerView
          data={appData.data}
          onMarkReading={appData.markReading}
          onSetPlan={appData.setPlan}
          onAdvanceDay={appData.advanceDay}
        />
      )}
      {tab === "goals" && (
        <GoalsView
          data={appData.data}
          onAddGoal={appData.addGoal}
          onUpdateGoal={appData.updateGoal}
        />
      )}

      <Nav active={tab} onChange={setTab} />
    </>
  );
}
