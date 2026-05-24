"use client";

import { useState } from "react";
import { useAppData } from "@/hooks/useAppData";
import { useSession } from "@/lib/auth-client";
import Nav, { Tab } from "@/components/ui/Nav";
import HomeView from "@/components/tracker/HomeView";
import JournalView from "@/components/journal/JournalView";
import PlannerView from "@/components/planner/PlannerView";
import GoalsView from "@/components/tracker/GoalsView";

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [journalDefaultTime, setJournalDefaultTime] = useState<"morning" | "evening">("morning");
  const { data: session, isPending } = useSession();
  const appData = useAppData();

  // Show loading while checking auth
  if (isPending) {
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
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading…</p>
      </div>
    );
  }

  if (!appData.isLoaded || (!session && !appData.data)) {
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
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {session ? "Loading your practice…" : "Welcome to Sanctuary"}
        </p>
      </div>
    );
  }

  function openJournal(time: "morning" | "evening") {
    setJournalDefaultTime(time);
    setTab("journal");
  }

  // Show limited UI for unauthenticated users
  if (!session || !appData.data) {
    return (
      <>
        {tab === "home" && (
          <HomeView
            data={appData.data || {
              streak: 0,
              readingEntries: [],
              journalEntries: [],
              goals: [],
              readingPlan: null,
              lastReadDate: null,
            }}
            onNavigate={setTab}
            onOpenJournal={openJournal}
            isGuest={true}
          />
        )}
        <Nav active={tab} onChange={setTab} isGuest={true} />
      </>
    );
  }

  return (
    <>
      {tab === "home" && (
        <HomeView
          data={appData.data}
          onNavigate={setTab}
          onOpenJournal={openJournal}
          isGuest={false}
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

      <Nav active={tab} onChange={setTab} session={session} isGuest={false} />
    </>
  );
}
