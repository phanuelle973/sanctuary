"use client";

import { BookOpen, BookMarked, Target, PenLine, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";

export type Tab = "home" | "journal" | "planner" | "goals";

interface NavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  session?: any;
  isGuest?: boolean;
}

const items: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Today", Icon: BookOpen },
  { id: "journal", label: "Journal", Icon: PenLine },
  { id: "planner", label: "Plan", Icon: BookMarked },
  { id: "goals", label: "Goals", Icon: Target },
];

export default function Nav({ active, onChange, session, isGuest }: NavProps) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <nav className="nav">
      {!isGuest && items.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item${active === id ? " active" : ""}`}
          onClick={() => onChange(id)}
          aria-label={label}
        >
          <Icon size={20} strokeWidth={1.75} />
          {label}
        </button>
      ))}

      {isGuest ? (
        <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
          <button
            onClick={handleSignIn}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Sign In
          </button>
          <button
            onClick={handleSignIn}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "var(--dusty-rose)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <button
          className="nav-item"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={20} strokeWidth={1.75} />
          {signingOut ? "..." : "Sign Out"}
        </button>
      )}
    </nav>
  );
}
