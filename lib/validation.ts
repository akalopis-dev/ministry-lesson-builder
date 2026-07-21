import type { LessonPlan } from "./types";

export interface CompletenessItem {
  label: string;
  done: boolean;
}

export function completenessChecklist(lesson: LessonPlan): CompletenessItem[] {
  return [
    {
      label: "Lesson details complete",
      done: Boolean(lesson.title && lesson.ministry && lesson.ageRange && lesson.theme),
    },
    { label: "Objectives added", done: lesson.objectives.length > 0 },
    { label: "Scripture or source added", done: lesson.sources.length > 0 },
    { label: "Timeline complete", done: lesson.blocks.length > 0 },
    {
      label: "Materials confirmed",
      done: lesson.materials.length === 0 || lesson.materials.every((m) => m.alreadyAvailable || m.assignedPurchaser),
    },
    { label: "Discussion questions added", done: lesson.discussionQuestions.length > 0 },
    {
      label: "Safety review completed",
      done: Boolean(
        lesson.safety.hazards ||
          lesson.safety.medicalConsiderations ||
          lesson.safety.supervisionRequirements
      ),
    },
    { label: "Leader roles assigned", done: Boolean(lesson.leadFacilitator) },
    { label: "Parent summary prepared", done: Boolean(lesson.communication.parentDescription) },
  ];
}

export function completenessScore(lesson: LessonPlan): { done: number; total: number } {
  const items = completenessChecklist(lesson);
  return { done: items.filter((i) => i.done).length, total: items.length };
}
