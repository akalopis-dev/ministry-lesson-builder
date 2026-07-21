"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Plus, MessagesSquare } from "lucide-react";
import type { LessonPlan, DiscussionQuestion, DiscussionCategory } from "@/lib/types";
import { DISCUSSION_CATEGORIES, makeId } from "@/lib/types";
import { DiscussionQuestionRow } from "@/components/lessons/discussion-question-row";
import { EmptyState } from "@/components/ui/empty-state";

function CategorySection({
  category,
  questions,
  onChange,
}: {
  category: DiscussionCategory;
  questions: DiscussionQuestion[];
  onChange: (updated: DiscussionQuestion[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const items = questions.filter((q) => q.category === category);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    const others = questions.filter((q) => q.category !== category);
    onChange([...others, ...reordered]);
  }

  function updateItem(id: string, patch: Partial<DiscussionQuestion>) {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function deleteItem(id: string) {
    onChange(questions.filter((q) => q.id !== id));
  }

  function addItem() {
    onChange([...questions, { id: makeId("q"), category, text: "" }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy">{category}</h3>
        <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-navy hover:underline">
          <Plus size={13} /> Add
        </button>
      </div>
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-2 space-y-2">
              {items.map((q) => (
                <DiscussionQuestionRow
                  key={q.id}
                  question={q}
                  onUpdate={(patch) => updateItem(q.id, patch)}
                  onDelete={() => deleteItem(q.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export function StepDiscussion({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Discussion questions</h2>
        <p className="mt-1 text-sm text-charcoal-soft">Organize questions by purpose, from opening the session to leader follow-up.</p>
      </div>

      {lesson.discussionQuestions.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No discussion questions yet"
          description="Add questions under the categories below to guide conversation during the lesson."
        />
      ) : null}

      <div className="space-y-6">
        {DISCUSSION_CATEGORIES.map((category) => (
          <CategorySection
            key={category}
            category={category}
            questions={lesson.discussionQuestions}
            onChange={(discussionQuestions) => onChange({ discussionQuestions })}
          />
        ))}
      </div>
    </div>
  );
}
