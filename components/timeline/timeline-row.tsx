"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, Copy, Bookmark, Trash2, Pencil } from "lucide-react";
import type { LessonBlock } from "@/lib/types";
import { BlockTypeTag } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function TimelineRow({
  block,
  startLabel,
  endLabel,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleCollapse,
  onSaveToLibrary,
}: {
  block: LessonBlock;
  startLabel: string;
  endLabel: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleCollapse: () => void;
  onSaveToLibrary: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-md border border-border bg-paper",
        isDragging && "opacity-60 shadow-md"
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5">
        <div className="flex min-w-[160px] flex-1 items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 cursor-grab touch-none rounded p-1 text-charcoal-soft/50 hover:text-charcoal-soft active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical size={15} />
          </button>
          <span className="shrink-0 text-xs font-medium text-charcoal-soft">
            {startLabel}–{endLabel}
          </span>
          <button onClick={onToggleCollapse} className="min-w-0 flex-1 truncate text-left font-medium text-charcoal">
            {block.title || "Untitled block"}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BlockTypeTag type={block.type} className="shrink-0" />
          <span className="shrink-0 text-xs text-charcoal-soft">{block.durationMinutes} min</span>
          <div className="flex shrink-0 items-center gap-0.5">
            <button title="Edit" onClick={onEdit} className="rounded p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
              <Pencil size={14} />
            </button>
            <button title="Duplicate" onClick={onDuplicate} className="rounded p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
              <Copy size={14} />
            </button>
            <button title="Save to activity library" onClick={onSaveToLibrary} className="rounded p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
              <Bookmark size={14} />
            </button>
            <button title="Delete" onClick={onDelete} className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
              <Trash2 size={14} />
            </button>
            <button
              title={block.collapsed ? "Expand" : "Collapse"}
              onClick={onToggleCollapse}
              className="rounded p-1.5 text-charcoal-soft hover:bg-surface"
            >
              <ChevronDown size={14} className={cn("transition-transform", !block.collapsed && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>
      {!block.collapsed && (block.purpose || block.instructions) && (
        <div className="space-y-1 border-t border-border px-3 py-2.5 pl-16 text-xs text-charcoal-soft">
          {block.purpose && <p><span className="font-medium text-charcoal">Purpose: </span>{block.purpose}</p>}
          {block.instructions && <p><span className="font-medium text-charcoal">Instructions: </span>{block.instructions}</p>}
          {block.materials && <p><span className="font-medium text-charcoal">Materials: </span>{block.materials}</p>}
        </div>
      )}
    </div>
  );
}
