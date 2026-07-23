"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LessonPlan } from "@/lib/types";
import { useLessonPlans } from "@/lib/store";
import { useTemplates } from "@/lib/templates-store";
import { LessonOutline, type OutlineStep } from "@/components/lessons/lesson-outline";
import { LessonSummaryPanel } from "@/components/lessons/lesson-summary-panel";
import { StepDetails } from "@/components/lessons/steps/step-details";
import { StepObjectives } from "@/components/lessons/steps/step-objectives";
import { StepSources } from "@/components/lessons/steps/step-sources";
import { StepTimeline } from "@/components/lessons/steps/step-timeline";
import { StepDiscussion } from "@/components/lessons/steps/step-discussion";
import { StepMaterials } from "@/components/lessons/steps/step-materials";
import { StepSafety } from "@/components/lessons/steps/step-safety";
import { StepCommunication } from "@/components/lessons/steps/step-communication";
import { StepReview } from "@/components/lessons/steps/step-review";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEP_IDS = [
  "details",
  "objectives",
  "sources",
  "timeline",
  "discussion",
  "materials",
  "safety",
  "communication",
  "review",
] as const;

const STEP_LABELS: Record<(typeof STEP_IDS)[number], string> = {
  details: "1. Lesson details",
  objectives: "2. Learning objectives",
  sources: "3. Scripture & sources",
  timeline: "4. Lesson timeline",
  discussion: "5. Discussion questions",
  materials: "6. Materials & preparation",
  safety: "7. Safety & accessibility",
  communication: "8. Parent & leader communication",
  review: "9. Review & export",
};

function stepComplete(id: string, lesson: LessonPlan): boolean {
  switch (id) {
    case "details":
      return Boolean(lesson.title && lesson.ministry && lesson.ageRange && lesson.theme);
    case "objectives":
      return lesson.objectives.length > 0;
    case "sources":
      return lesson.sources.length > 0;
    case "timeline":
      return lesson.blocks.length > 0;
    case "discussion":
      return lesson.discussionQuestions.length > 0;
    case "materials":
      return lesson.materials.length > 0 || lesson.preparationTasks.length > 0;
    case "safety":
      return Object.values(lesson.safety).some((v) => v.trim().length > 0);
    case "communication":
      return Boolean(lesson.communication.parentDescription);
    default:
      return false;
  }
}

export function LessonEditor({
  initialLesson,
  initialStep,
  openActivityPicker,
}: {
  initialLesson: LessonPlan;
  initialStep?: string;
  openActivityPicker?: boolean;
}) {
  const router = useRouter();
  const { saveLesson } = useLessonPlans();
  const { addTemplate } = useTemplates();
  const [lesson, setLesson] = useState<LessonPlan>(initialLesson);
  const [activeStep, setActiveStep] = useState<string>(initialStep ?? "details");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirtyEnough = useRef(Boolean(initialLesson.title));

  function patch(p: Partial<LessonPlan>) {
    setLesson((prev) => {
      const next = { ...prev, ...p };
      if (next.title.trim()) isDirtyEnough.current = true;
      return next;
    });
  }

  useEffect(() => {
    if (!isDirtyEnough.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveLesson(lesson);
      setSavedAt(new Date());
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  const steps: OutlineStep[] = STEP_IDS.map((id) => ({
    id,
    label: STEP_LABELS[id],
    complete: stepComplete(id, lesson),
  }));

  const currentIndex = STEP_IDS.indexOf(activeStep as (typeof STEP_IDS)[number]);

  function goTo(index: number) {
    if (index < 0 || index >= STEP_IDS.length) return;
    setActiveStep(STEP_IDS[index]);
  }

  function handleSaveAsTemplate() {
    addTemplate({
      name: lesson.title || "Untitled template",
      description: lesson.summary,
      ministry: lesson.ministry,
      durationMinutes: lesson.durationMinutes,
      blocks: lesson.blocks.map((b) => ({ type: b.type, title: b.title, durationMinutes: b.durationMinutes })),
    });
  }

  function renderStep() {
    switch (activeStep) {
      case "details":
        return <StepDetails lesson={lesson} onChange={patch} />;
      case "objectives":
        return <StepObjectives lesson={lesson} onChange={patch} />;
      case "sources":
        return <StepSources lesson={lesson} onChange={patch} />;
      case "timeline":
        return <StepTimeline lesson={lesson} onChange={patch} autoOpenPicker={openActivityPicker} />;
      case "discussion":
        return <StepDiscussion lesson={lesson} onChange={patch} />;
      case "materials":
        return <StepMaterials lesson={lesson} onChange={patch} />;
      case "safety":
        return <StepSafety lesson={lesson} onChange={patch} />;
      case "communication":
        return <StepCommunication lesson={lesson} onChange={patch} />;
      case "review":
        return <StepReview lesson={lesson} onSaveAsTemplate={handleSaveAsTemplate} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 border-r border-border px-4 py-6 lg:block">
        <button onClick={() => router.push("/lessons")} className="mb-4 text-xs font-medium text-charcoal-soft hover:text-navy">
          ← Back to Lesson Plans
        </button>
        <p className="mb-3 truncate font-heading text-sm font-semibold text-navy">{lesson.title || "Untitled lesson"}</p>
        <LessonOutline steps={steps} active={activeStep} onSelect={setActiveStep} />
      </aside>

      <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 lg:hidden">
            <button onClick={() => router.push("/lessons")} className="mb-3 text-xs font-medium text-charcoal-soft hover:text-navy">
              ← Back to Lesson Plans
            </button>
            <Select value={activeStep} onChange={(e) => setActiveStep(e.target.value)}>
              {steps.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.complete ? "✓ " : ""}
                  {step.label}
                </option>
              ))}
            </Select>
          </div>

          {renderStep()}

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button variant="secondary" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}>
              <ChevronLeft size={15} /> Back
            </Button>
            {currentIndex < STEP_IDS.length - 1 ? (
              <Button onClick={() => goTo(currentIndex + 1)}>
                Next <ChevronRight size={15} />
              </Button>
            ) : (
              <Button onClick={() => router.push(`/lessons/${lesson.id}`)}>View lesson</Button>
            )}
          </div>
        </div>
      </main>

      <aside className="hidden w-72 shrink-0 border-l border-border px-5 py-6 xl:block">
        <LessonSummaryPanel lesson={lesson} savedAt={savedAt} />
      </aside>
    </div>
  );
}
