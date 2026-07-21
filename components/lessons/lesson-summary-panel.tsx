"use client";

import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { totalBlockDuration, formatMinutes } from "@/lib/time";
import { completenessChecklist } from "@/lib/validation";

export function LessonSummaryPanel({ lesson, savedAt }: { lesson: LessonPlan; savedAt: Date | null }) {
  const total = totalBlockDuration(lesson.blocks);
  const target = lesson.durationMinutes;
  const overBy = total - target;
  const checklist = completenessChecklist(lesson);
  const done = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">Timeline duration</p>
        <p className="mt-1 font-heading text-xl font-semibold text-navy">
          {formatMinutes(total)}{" "}
          <span className="text-sm font-normal text-charcoal-soft">/ {formatMinutes(target)} planned</span>
        </p>
        {overBy > 0 ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-burgundy">
            <AlertTriangle size={13} /> {formatMinutes(overBy)} over the planned duration
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-charcoal-soft">
            {overBy === 0 ? "Exactly on time." : `${formatMinutes(-overBy)} of buffer remaining.`}
          </p>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">At a glance</p>
        <dl className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal-soft">Objectives</dt>
            <dd className="text-charcoal">{lesson.objectives.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal-soft">Scripture &amp; sources</dt>
            <dd className="text-charcoal">{lesson.sources.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal-soft">Timeline blocks</dt>
            <dd className="text-charcoal">{lesson.blocks.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal-soft">Discussion questions</dt>
            <dd className="text-charcoal">{lesson.discussionQuestions.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal-soft">Materials</dt>
            <dd className="text-charcoal">{lesson.materials.length}</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
          Completeness ({done}/{checklist.length})
        </p>
        <ul className="mt-2 space-y-1.5">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-xs text-charcoal-soft">
              {item.done ? (
                <CheckCircle2 size={13} className="text-olive" />
              ) : (
                <Circle size={13} className="text-border-strong" />
              )}
              <span className={item.done ? "text-charcoal" : ""}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-4 text-xs text-charcoal-soft">
        {savedAt ? `Saved ${savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Not yet saved"}
      </div>
    </div>
  );
}
