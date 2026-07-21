"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import type { ActivityCategory, BlockType, LessonBlock, Ministry } from "@/lib/types";
import { makeId } from "@/lib/types";
import { buildTimelineSlots } from "@/lib/time";
import { TimelineRow } from "./timeline-row";
import { BlockEditorDrawer } from "./block-editor-drawer";
import { useToast } from "@/components/ui/toast";
import { useActivities } from "@/lib/activities-store";

const TEACHING_TYPES: BlockType[] = ["Scripture reading", "Teaching", "Group discussion", "Small-group discussion", "Reflection"];

function categoryForBlockType(type: BlockType): ActivityCategory {
  if (type === "Icebreaker") return "Icebreakers";
  if (TEACHING_TYPES.includes(type)) return "Knowledge & faith games";
  return "Active games";
}

export function Timeline({
  blocks,
  onChange,
  ministry,
}: {
  blocks: LessonBlock[];
  onChange: (blocks: LessonBlock[]) => void;
  ministry: Ministry;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const showToast = useToast();
  const { addActivity } = useActivities();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const slots = buildTimelineSlots(blocks);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    onChange(arrayMove(blocks, oldIndex, newIndex));
  }

  function updateBlock(id: string, patch: Partial<LessonBlock>) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function duplicateBlock(id: string) {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const copy: LessonBlock = { ...blocks[index], id: makeId("block") };
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    onChange(next);
  }

  function deleteBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
  }

  function saveToLibrary(block: LessonBlock) {
    addActivity({
      title: block.title || block.type,
      category: categoryForBlockType(block.type),
      ministries: [ministry],
      duration: `${block.durationMinutes} min`,
      suppliesLevel: block.materials.trim() ? "Some supplies" : "No supplies",
      summary: block.instructions || block.purpose || "",
      source: "Saved from a lesson timeline",
      adaptationNote: "",
      tags: [],
    });
    showToast(`Saved "${block.title || block.type}" to the Activity Library`);
  }

  const editingBlock = blocks.find((b) => b.id === editingId) ?? null;

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {slots.map(({ block, startLabel, endLabel }) => (
              <TimelineRow
                key={block.id}
                block={block}
                startLabel={startLabel}
                endLabel={endLabel}
                onEdit={() => setEditingId(block.id)}
                onDuplicate={() => duplicateBlock(block.id)}
                onDelete={() => deleteBlock(block.id)}
                onToggleCollapse={() => updateBlock(block.id, { collapsed: !block.collapsed })}
                onSaveToLibrary={() => saveToLibrary(block)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <BlockEditorDrawer
        key={editingId ?? "closed"}
        block={editingBlock}
        open={editingId !== null}
        onClose={() => setEditingId(null)}
        onSave={(updated) => updateBlock(updated.id, updated)}
      />
    </>
  );
}
