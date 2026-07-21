"use client";

import { useState } from "react";
import { blankLessonPlan } from "@/lib/types";
import { LessonEditor } from "@/components/lessons/lesson-editor";

export default function NewLessonPage() {
  const [lesson] = useState(() => blankLessonPlan());
  return <LessonEditor initialLesson={lesson} />;
}
