"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLessonPlans } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { LessonDetailView, type PrintMode } from "@/components/lessons/detail/lesson-detail-view";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

function LessonDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getLesson, loaded, duplicateLesson, archiveLesson, deleteLesson, saveLesson, toggleFavorite } = useLessonPlans();
  const showToast = useToast();

  const printRequested = searchParams.get("print") === "1";
  const mode = (searchParams.get("mode") as PrintMode) || "full";

  useEffect(() => {
    if (printRequested) {
      const timer = setTimeout(() => window.print(), 350);
      return () => clearTimeout(timer);
    }
  }, [printRequested, mode]);

  if (!loaded) return <LoadingState label="Loading lesson…" />;

  const lesson = getLesson(params.id);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <EmptyState
          icon={FileQuestion}
          title="Lesson not found"
          description="This lesson may have been deleted or archived."
          action={<Button onClick={() => router.push("/lessons")}>Back to Lesson Plans</Button>}
        />
      </div>
    );
  }

  return (
    <LessonDetailView
      lesson={lesson}
      initialPrintMode={printRequested ? mode : "full"}
      onEdit={() => router.push(`/lessons/${lesson.id}/edit`)}
      onDuplicate={() => {
        const copy = duplicateLesson(lesson.id);
        if (copy) {
          showToast("Lesson duplicated");
          router.push(`/lessons/${copy.id}/edit`);
        }
      }}
      onExport={(m) => router.push(`/lessons/${lesson.id}?print=1&mode=${m}`)}
      onArchive={() => {
        archiveLesson(lesson.id);
        showToast("Lesson archived");
        router.push("/lessons");
      }}
      onDelete={() => {
        if (window.confirm("Move this lesson plan to Trash? You can restore it from Trash for 30 days.")) {
          deleteLesson(lesson.id);
          showToast("Moved to Trash");
          router.push("/lessons");
        }
      }}
      onUpdateLesson={saveLesson}
      onToggleFavorite={() => toggleFavorite(lesson.id)}
    />
  );
}

export default function LessonDetailPage() {
  return (
    <Suspense fallback={null}>
      <LessonDetailContent />
    </Suspense>
  );
}
