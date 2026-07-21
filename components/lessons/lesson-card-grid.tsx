"use client";

import Link from "next/link";
import { Clock, Users2, Copy, Star } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge, MinistryTag } from "@/components/ui/badge";
import { AddToCollectionMenu } from "@/components/collections/add-to-collection-menu";
import { formatMinutes } from "@/lib/time";

export function LessonCardGrid({
  lessons,
  onDuplicate,
  onToggleFavorite,
}: {
  lessons: LessonPlan[];
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex flex-col rounded-md border border-border bg-paper p-4 shadow-soft transition-shadow hover:shadow-elevated">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/lessons/${lesson.id}`} className="font-heading text-sm font-semibold text-navy hover:underline">
              {lesson.title}
            </Link>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => onToggleFavorite(lesson.id)}
                title={lesson.favorite ? "Remove from favorites" : "Add to favorites"}
                className={`rounded p-1 hover:bg-gold-soft ${lesson.favorite ? "text-gold" : "text-charcoal-soft hover:text-gold"}`}
              >
                <Star size={13} className={lesson.favorite ? "fill-current" : ""} />
              </button>
              <StatusBadge status={lesson.status} />
            </div>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-soft">
            <MinistryTag ministry={lesson.ministry} /> &middot; {lesson.theme}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-charcoal-soft">{lesson.summary}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-charcoal-soft">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatMinutes(lesson.durationMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Users2 size={12} /> {lesson.ageRange}
            </span>
          </div>
          <div className="mt-4 flex gap-2 border-t border-border pt-3">
            <Link
              href={`/lessons/${lesson.id}/edit`}
              className="flex-1 rounded-md border border-border-strong px-2.5 py-1.5 text-center text-xs font-medium text-navy hover:bg-surface"
            >
              Open
            </Link>
            <button
              onClick={() => onDuplicate(lesson.id)}
              className="rounded-md border border-border-strong px-2.5 py-1.5 text-xs font-medium text-charcoal-soft hover:bg-surface"
              title="Duplicate"
            >
              <Copy size={13} />
            </button>
            <AddToCollectionMenu
              itemId={lesson.id}
              itemType="lesson"
              className="rounded-md border border-border-strong px-2.5 py-1.5 text-xs font-medium text-charcoal-soft hover:bg-surface"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
