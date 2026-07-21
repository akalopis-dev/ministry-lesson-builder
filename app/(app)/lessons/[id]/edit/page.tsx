"use client";

import { useParams, useRouter } from "next/navigation";
import { useLessonPlans } from "@/lib/store";
import { LessonEditor } from "@/components/lessons/lesson-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function EditLessonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getLesson, loaded } = useLessonPlans();

  if (!loaded) return null;

  const lesson = getLesson(params.id);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <EmptyState
          icon={FileQuestion}
          title="Lesson not found"
          description="This lesson may have been deleted. Return to the library to keep working."
          action={<Button onClick={() => router.push("/lessons")}>Back to Lesson Plans</Button>}
        />
      </div>
    );
  }

  return <LessonEditor key={lesson.id} initialLesson={lesson} />;
}
