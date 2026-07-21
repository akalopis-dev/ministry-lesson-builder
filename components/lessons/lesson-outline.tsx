"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface OutlineStep {
  id: string;
  label: string;
  complete: boolean;
}

export function LessonOutline({
  steps,
  active,
  onSelect,
}: {
  steps: OutlineStep[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="space-y-0.5">
      {steps.map((step, i) => {
        const isActive = step.id === active;
        return (
          <button
            key={step.id}
            onClick={() => onSelect(step.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
              isActive ? "bg-surface text-navy font-medium" : "text-charcoal-soft hover:bg-surface/60"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]",
                step.complete
                  ? "border-olive bg-olive-soft text-olive"
                  : isActive
                    ? "border-navy text-navy"
                    : "border-border-strong text-charcoal-soft"
              )}
            >
              {step.complete ? <Check size={12} /> : i + 1}
            </span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
