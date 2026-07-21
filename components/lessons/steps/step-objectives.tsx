"use client";

import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import type { LessonObjective, LessonPlan, ObjectiveKind } from "@/lib/types";
import { makeId } from "@/lib/types";
import { Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Target } from "lucide-react";

const KINDS: ObjectiveKind[] = ["Faith", "Knowledge", "Personal reflection", "Practical application", "Community or service"];

export function StepObjectives({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  const objectives = lesson.objectives;

  function update(id: string, patch: Partial<LessonObjective>) {
    onChange({ objectives: objectives.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  }

  function remove(id: string) {
    onChange({ objectives: objectives.filter((o) => o.id !== id) });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...objectives];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ objectives: next });
  }

  function add() {
    if (objectives.length >= 5) return;
    onChange({
      objectives: [...objectives, { id: makeId("obj"), kind: "Faith", text: "" }],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Learning objectives</h2>
        <p className="mt-1 text-sm text-charcoal-soft">Add 1–5 objectives that describe what participants will take away.</p>
      </div>

      {objectives.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No objectives yet"
          description="Add at least one objective so leaders and reviewers know the purpose of this lesson."
          action={
            <Button size="sm" onClick={add}>
              <Plus size={14} /> Add objective
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {objectives.map((obj, i) => (
            <div key={obj.id} className="rounded-md border border-border bg-paper p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-0.5 pt-1">
                  <button
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="rounded p-0.5 text-charcoal-soft hover:bg-surface disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={i === objectives.length - 1}
                    onClick={() => move(i, 1)}
                    className="rounded p-0.5 text-charcoal-soft hover:bg-surface disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div className="flex-1 space-y-2.5">
                  <Select
                    className="max-w-xs"
                    value={obj.kind}
                    onChange={(e) => update(obj.id, { kind: e.target.value as ObjectiveKind })}
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k} objective
                      </option>
                    ))}
                  </Select>
                  <Textarea
                    rows={2}
                    value={obj.text}
                    onChange={(e) => update(obj.id, { text: e.target.value })}
                    placeholder="Participants will..."
                  />
                </div>
                <button onClick={() => remove(obj.id)} className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {objectives.length < 5 && (
            <Button variant="secondary" size="sm" onClick={add}>
              <Plus size={14} /> Add objective
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
