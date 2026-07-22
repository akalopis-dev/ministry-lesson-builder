"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatMinutes } from "@/lib/time";
import { cn } from "@/lib/cn";
import { MINISTRY_ACCENTS } from "@/lib/ministry-colors";
import { ACCENT_DOT_CLASSES } from "@/lib/category-colors";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface CalendarCell {
  date: Date;
  key: string;
  inMonth: boolean;
}

function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push({ date, key: toDateKey(date), inMonth: date.getMonth() === month });
  }
  return cells;
}

export default function CalendarPage() {
  const { lessons, loaded } = useLessonPlans();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string>(() => toDateKey(today));

  const lessonsByDate = useMemo(() => {
    const map = new Map<string, LessonPlan[]>();
    for (const lesson of lessons) {
      if (lesson.archived || !lesson.date) continue;
      if (!map.has(lesson.date)) map.set(lesson.date, []);
      map.get(lesson.date)!.push(lesson);
    }
    return map;
  }, [lessons]);

  if (!loaded) return <LoadingState label="Loading your calendar…" />;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedLessons = lessonsByDate.get(selectedKey) ?? [];
  const selectedDateLabel = new Date(`${selectedKey}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function goToMonth(offset: number) {
    setViewDate(new Date(year, month + offset, 1));
  }

  function goToToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedKey(toDateKey(today));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <CalendarDays size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Calendar</h1>
          <p className="text-sm text-charcoal-soft">Every lesson with a scheduled date.</p>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border bg-paper p-3 shadow-soft sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-semibold text-navy sm:text-lg">{monthLabel}</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-charcoal-soft hover:bg-surface"
            >
              Today
            </button>
            <button
              onClick={() => goToMonth(-1)}
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-soft hover:bg-surface"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goToMonth(1)}
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-soft hover:bg-surface"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-charcoal-soft sm:text-xs">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const dayLessons = cell.inMonth ? lessonsByDate.get(cell.key) ?? [] : [];
            const isToday = isSameDay(cell.date, today);
            const isSelected = cell.inMonth && cell.key === selectedKey;
            return (
              <button
                key={cell.key}
                onClick={() => cell.inMonth && setSelectedKey(cell.key)}
                disabled={!cell.inMonth}
                className={cn(
                  "flex aspect-square flex-col items-center justify-start gap-0.5 rounded-md pt-1 text-xs transition-colors sm:gap-1 sm:pt-1.5 sm:text-sm",
                  !cell.inMonth && "text-charcoal-soft/30",
                  cell.inMonth && !isSelected && "text-charcoal hover:bg-surface",
                  isSelected && "bg-navy font-semibold text-paper"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full sm:h-6 sm:w-6",
                    isToday && !isSelected && "bg-gold-soft font-semibold text-navy"
                  )}
                >
                  {cell.date.getDate()}
                </span>
                {dayLessons.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    {dayLessons.slice(0, 3).map((lesson) => (
                      <span
                        key={lesson.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isSelected ? "bg-paper" : ACCENT_DOT_CLASSES[MINISTRY_ACCENTS[lesson.ministry]]
                        )}
                      />
                    ))}
                    {dayLessons.length > 3 && (
                      <span className={cn("text-[9px] leading-none", isSelected ? "text-paper/80" : "text-charcoal-soft")}>
                        +{dayLessons.length - 3}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-charcoal-soft">{selectedDateLabel}</h2>
        <div className="mt-2">
          {selectedLessons.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No lessons scheduled"
              description="Set a date on a lesson in the Lesson Plans Library to see it appear here."
            />
          ) : (
            <div className="divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
              {selectedLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3.5 hover:bg-surface/40"
                >
                  <div className="min-w-[180px] flex-1">
                    <p className="font-medium text-navy">{lesson.title}</p>
                    <p className="text-xs text-charcoal-soft">
                      {lesson.ministry}
                      {lesson.location ? ` · ${lesson.location}` : ""}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-charcoal-soft">
                    <Clock size={13} /> {formatMinutes(lesson.durationMinutes)}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-charcoal-soft">
                    <Avatar name={lesson.leadFacilitator || "Unassigned"} size="sm" />
                    {lesson.leadFacilitator || "Unassigned"}
                  </span>
                  <StatusBadge status={lesson.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
