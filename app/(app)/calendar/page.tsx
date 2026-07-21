"use client";

import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMinutes } from "@/lib/time";

function monthLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function dayLabel(dateStr: string): { weekday: string; day: string } {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function groupByMonth(lessons: LessonPlan[]): [string, LessonPlan[]][] {
  const groups = new Map<string, LessonPlan[]>();
  for (const lesson of lessons) {
    const key = monthLabel(lesson.date!);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(lesson);
  }
  return Array.from(groups.entries());
}

export default function CalendarPage() {
  const { lessons, loaded } = useLessonPlans();

  if (!loaded) return null;

  const dated = lessons
    .filter((l) => !l.archived && l.date)
    .sort((a, b) => (a.date! < b.date! ? -1 : 1));
  const grouped = groupByMonth(dated);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <CalendarDays size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Calendar</h1>
          <p className="text-sm text-charcoal-soft">An agenda view of every lesson with a scheduled date.</p>
        </div>
      </div>

      <div className="mt-8">
        {dated.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No lessons scheduled yet"
            description="Set a date on a lesson in the Lesson Plans Library to see it appear here."
          />
        ) : (
          <div className="space-y-8">
            {grouped.map(([month, monthLessons]) => (
              <section key={month}>
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-charcoal-soft">{month}</h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {monthLessons.map((lesson) => {
                    const { weekday, day } = dayLabel(lesson.date!);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3.5 hover:bg-surface/40"
                      >
                        <div className="w-20 shrink-0">
                          <p className="text-xs uppercase tracking-wide text-charcoal-soft">{weekday}</p>
                          <p className="text-sm font-semibold text-navy">{day}</p>
                        </div>
                        <div className="min-w-[180px] flex-1">
                          <p className="font-medium text-navy">{lesson.title}</p>
                          <p className="text-xs text-charcoal-soft">{lesson.ministry}{lesson.location ? ` · ${lesson.location}` : ""}</p>
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
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
