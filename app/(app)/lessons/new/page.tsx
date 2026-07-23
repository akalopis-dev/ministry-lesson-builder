"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { blankLessonPlan } from "@/lib/types";
import { LessonEditor } from "@/components/lessons/lesson-editor";

function NewLessonForm() {
  const [lesson] = useState(() => blankLessonPlan());
  const searchParams = useSearchParams();
  const fromActivity = searchParams.get("from") === "activity";

  return (
    <LessonEditor
      initialLesson={lesson}
      initialStep={fromActivity ? "timeline" : undefined}
      openActivityPicker={fromActivity}
    />
  );
}

export default function NewLessonPage() {
  return (
    <Suspense fallback={null}>
      <NewLessonForm />
    </Suspense>
  );
}
