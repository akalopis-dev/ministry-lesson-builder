"use client";

import { useState } from "react";
import { AlertTriangle, Plus, CalendarClock, BookOpen } from "lucide-react";
import type { LessonPlan, BlockType, Activity } from "@/lib/types";
import { BLOCK_TYPES, makeBlock } from "@/lib/types";
import { totalBlockDuration, formatMinutes } from "@/lib/time";
import { Timeline } from "@/components/timeline/timeline";
import { ActivityPickerDrawer, activityToBlockFields } from "@/components/timeline/activity-picker-drawer";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function StepTimeline({
  lesson,
  onChange,
  autoOpenPicker,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
  autoOpenPicker?: boolean;
}) {
  const [newType, setNewType] = useState<BlockType>("Icebreaker");
  const [pickerOpen, setPickerOpen] = useState(() => Boolean(autoOpenPicker));
  const showToast = useToast();
  const total = totalBlockDuration(lesson.blocks);
  const overBy = total - lesson.durationMinutes;

  function addBlock() {
    onChange({
      blocks: [...lesson.blocks, makeBlock({ type: newType, title: newType, durationMinutes: 10 })],
    });
  }

  function insertActivity(activity: Activity) {
    onChange({ blocks: [...lesson.blocks, makeBlock(activityToBlockFields(activity))] });
    showToast(`Added "${activity.title}" to the timeline`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Lesson timeline</h2>
        <p className="mt-1 text-sm text-charcoal-soft">
          Build the session block by block. Drag the handle to reorder, or click{" "}
          <span className="font-medium text-navy">Insert from Activity Library</span> below to add a ready-made icebreaker,
          game, or activity instead of writing one from scratch.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-md border border-border bg-surface/50 px-4 py-2.5 text-sm">
        <span className="font-medium text-charcoal">Running total: {formatMinutes(total)}</span>
        <span className="text-charcoal-soft">planned {formatMinutes(lesson.durationMinutes)}</span>
        {overBy > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-burgundy">
            <AlertTriangle size={13} /> {formatMinutes(overBy)} over
          </span>
        )}
      </div>

      {lesson.blocks.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Build your lesson timeline"
          description="Browse ready-made icebreakers, games, and activities from the Activity Library, or add a blank block and write your own."
          action={
            <>
              <Button onClick={() => setPickerOpen(true)}>
                <BookOpen size={14} /> Browse Activity Library
              </Button>
              <Button variant="secondary" onClick={addBlock}>
                <Plus size={14} /> Add a blank block
              </Button>
            </>
          }
        />
      ) : (
        <Timeline blocks={lesson.blocks} onChange={(blocks) => onChange({ blocks })} ministry={lesson.ministry} />
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button size="sm" onClick={() => setPickerOpen(true)}>
          <BookOpen size={14} /> Insert from Activity Library
        </Button>
        <span className="text-xs text-charcoal-soft">or</span>
        <Select className="max-w-xs" value={newType} onChange={(e) => setNewType(e.target.value as BlockType)}>
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Button variant="secondary" size="sm" onClick={addBlock}>
          <Plus size={14} /> Add block
        </Button>
      </div>

      <ActivityPickerDrawer open={pickerOpen} onClose={() => setPickerOpen(false)} onInsert={insertActivity} />
    </div>
  );
}
