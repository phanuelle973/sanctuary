"use client";

import { BookOpen, BookMarked, Target, PenLine } from "lucide-react";

export type Tab = "home" | "journal" | "planner" | "goals";

interface NavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const items: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home",    label: "Today",    Icon: BookOpen },
  { id: "journal", label: "Journal",  Icon: PenLine },
  { id: "planner", label: "Plan",     Icon: BookMarked },
  { id: "goals",   label: "Goals",    Icon: Target },
];

export default function Nav({ active, onChange }: NavProps) {
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
    </nav>
  );
}
