"use client";

import { cn } from "@/lib/cn";

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-px",
            active === tab
              ? "border-navy text-navy"
              : "border-transparent text-charcoal-soft hover:text-charcoal"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
