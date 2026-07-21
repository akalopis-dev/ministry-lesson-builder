"use client";

import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { formatMinutes } from "@/lib/time";

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function UpcomingLessons({ lessons }: { lessons: LessonPlan[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = lessons
    .filter((l) => !l.archived && l.date && l.date >= today)
    .sort((a, b) => (a.date! < b.date! ? -1 : 1))
    .slice(0, 4);

  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No upcoming lessons scheduled"
        description="Schedule a lesson from the Lesson Plans Library to see it here."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border shadow-soft">
      {upcoming.map((lesson) => (
        <li key={lesson.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3.5">
          <div className="min-w-[180px] flex-1">
            <Link href={`/lessons/${lesson.id}`} className="font-medium text-navy hover:underline">
              {lesson.title}
            </Link>
            <p className="text-xs text-charcoal-soft">{lesson.ministry}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-charcoal-soft">
            <CalendarDays size={13} /> {formatDate(lesson.date!)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-charcoal-soft">
            <Clock size={13} /> {formatMinutes(lesson.durationMinutes)}
          </span>
          <span className="flex items-center gap-2 text-xs text-charcoal-soft">
            <Avatar name={lesson.leadFacilitator || "Unassigned"} size="sm" />
            {lesson.leadFacilitator || "Unassigned"}
          </span>
          <StatusBadge status={lesson.status} />
          <Link
            href={`/lessons/${lesson.id}`}
            className="text-xs font-medium text-navy hover:underline"
          >
            Open
          </Link>
        </li>
      ))}
    </ul>
  );
}
