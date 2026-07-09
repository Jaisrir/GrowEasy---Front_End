"use client";

import { Check } from "lucide-react";
import { StepId } from "@/lib/types";

const STEPS: { id: StepId; label: string }[] = [
  { id: "upload", label: "Upload CSV" },
  { id: "preview", label: "Preview & Confirm" },
  { id: "results", label: "Import Result" },
];

export default function Stepper({ current }: { current: StepId }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex items-center w-full max-w-xl mx-auto">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <li key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                style={{
                  background: isDone
                    ? "var(--ge-good)"
                    : isActive
                    ? "var(--ge-brand)"
                    : "var(--ge-neutral-bg)",
                  color: isDone || isActive ? "#fff" : "var(--ge-ink-soft)",
                }}
              >
                {isDone ? <Check size={16} /> : i + 1}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color: isActive ? "var(--ge-ink)" : "var(--ge-ink-soft)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-[2px] flex-1 mx-2 -mt-5 rounded-full"
                style={{
                  background: isDone ? "var(--ge-good)" : "var(--ge-line)",
                }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
