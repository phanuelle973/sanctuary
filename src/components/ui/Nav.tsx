"use client";

import { BookOpen, BookMarked, Target, PenLine, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";

export type Tab = "home" | "journal" | "planner" | "goals";

interface NavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const items: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Today", Icon: BookOpen },
  { id: "journal", label: "Journal", Icon: PenLine },
  { id: "planner", label: "Plan", Icon: BookMarked },
  { id: "goals", label: "Goals", Icon: Target },
];

export default function Nav({ active, onChange }: NavProps) {
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

  return (
    <nav className="nav">
      {items.map(({ id, label, Icon }) => (
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
    </nav>
  );
}
