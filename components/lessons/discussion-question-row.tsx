"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { DiscussionQuestion, Difficulty } from "@/lib/types";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Deep"];

export function DiscussionQuestionRow({
  question,
  onUpdate,
  onDelete,
}: {
  question: DiscussionQuestion;
  onUpdate: (patch: Partial<DiscussionQuestion>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("rounded-md border border-border bg-paper p-3", isDragging && "opacity-60 shadow-md")}
    >
      <div className="flex items-start gap-2.5">
        <button
          {...attributes}
          {...listeners}
          className="mt-1.5 cursor-grab touch-none rounded p-1 text-charcoal-soft/50 hover:text-charcoal-soft active:cursor-grabbing"
        >
          <GripVertical size={15} />
        </button>
        <div className="flex-1 space-y-2">
          <Textarea rows={2} value={question.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Question text" />
          <div className="flex flex-wrap gap-2">
            <Input
              className="w-28"
              value={question.ageGroup ?? ""}
              onChange={(e) => onUpdate({ ageGroup: e.target.value })}
              placeholder="Age group"
            />
            <Select className="w-32" value={question.difficulty ?? ""} onChange={(e) => onUpdate({ difficulty: e.target.value as Difficulty })}>
              <option value="">Difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Input
              className="flex-1 min-w-[160px]"
              value={question.leaderNote ?? ""}
              onChange={(e) => onUpdate({ leaderNote: e.target.value })}
              placeholder="Leader note (optional)"
            />
            <Input
              className="flex-1 min-w-[160px]"
              value={question.followUp ?? ""}
              onChange={(e) => onUpdate({ followUp: e.target.value })}
              placeholder="Follow-up question (optional)"
            />
          </div>
        </div>
        <button onClick={onDelete} className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
