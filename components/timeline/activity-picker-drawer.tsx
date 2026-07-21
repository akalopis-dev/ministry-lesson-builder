"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Chip, Tag, ActivityCategoryTag } from "@/components/ui/badge";
import { ACCENT_DOT_CLASSES, ACTIVITY_CATEGORY_ACCENTS } from "@/lib/category-colors";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/lib/activities-store";
import { ACTIVITY_CATEGORIES, type Activity, type ActivityCategory, type BlockType } from "@/lib/types";

function blockTypeForCategory(category: ActivityCategory): BlockType {
  return category === "Icebreakers" ? "Icebreaker" : "Game";
}

function firstNumber(text: string): number {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 10;
}

export function activityToBlockFields(activity: Activity) {
  const notes = [`Source: ${activity.source}`, activity.adaptationNote].filter(Boolean).join(" — ");
  return {
    type: blockTypeForCategory(activity.category),
    title: activity.title,
    durationMinutes: firstNumber(activity.duration),
    purpose: `${activity.category} · ${activity.ministries.join(", ")}`,
    instructions: activity.summary,
    materials: activity.suppliesLevel === "Some supplies" ? "See Activity Library for full supply list" : "",
    internalNotes: notes,
  };
}

export function ActivityPickerDrawer({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (activity: Activity) => void;
}) {
  const { activities } = useActivities();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ActivityCategory | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities
      .filter((a) => {
        if (category && a.category !== category) return false;
        if (!q) return true;
        return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
      })
      .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
  }, [activities, query, category]);

  return (
    <Drawer open={open} onClose={onClose} title="Insert from Activity Library">
      <div className="relative mb-3">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities..."
          className="w-full rounded-md border border-border-strong bg-paper py-2 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Chip active={category === null} onClick={() => setCategory(null)}>
          All
        </Chip>
        {ACTIVITY_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c === category ? null : c)}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${ACCENT_DOT_CLASSES[ACTIVITY_CATEGORY_ACCENTS[c]]}`} />
            {c}
          </Chip>
        ))}
      </div>
      <div className="space-y-2.5">
        {filtered.map((a) => (
          <div key={a.id} className="rounded-md border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                {a.favorite && <Star size={12} className="fill-current text-gold" />}
                {a.title}
              </p>
              <Tag>{a.duration}</Tag>
            </div>
            <p className="mt-1 text-xs text-charcoal-soft">{a.summary}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                <ActivityCategoryTag category={a.category} />
                {a.ministries.map((m) => (
                  <Tag key={m}>{m}</Tag>
                ))}
                <Tag>{a.suppliesLevel}</Tag>
              </div>
              <Button size="sm" onClick={() => onInsert(a)}>
                Insert
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-charcoal-soft">No activities match these filters.</p>}
      </div>
    </Drawer>
  );
}
