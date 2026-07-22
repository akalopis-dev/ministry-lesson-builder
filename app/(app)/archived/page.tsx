"use client";

import Link from "next/link";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import { StatusBadge, MinistryTag } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function ArchivedPage() {
  const { lessons, loaded, saveLesson, deleteLesson } = useLessonPlans();
  const showToast = useToast();
  const archived = lessons.filter((l) => l.archived);

  if (!loaded) return <LoadingState label="Loading archived lessons…" />;

  function restore(lesson: (typeof archived)[number]) {
    saveLesson({ ...lesson, archived: false });
    showToast("Lesson restored");
  }

  function remove(lessonId: string) {
    deleteLesson(lessonId);
    showToast("Lesson deleted");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <Archive size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Archived</h1>
          <p className="text-sm text-charcoal-soft">Lesson plans that have been archived out of the active library.</p>
        </div>
      </div>

      <div className="mt-8">
        {archived.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="Nothing archived"
            description="Lessons you archive from the Lesson Plans Library will appear here for safekeeping."
          />
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-md border border-border shadow-soft lg:block">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-charcoal-soft">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Lesson</th>
                    <th className="px-4 py-2.5 font-medium">Ministry</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archived.map((lesson) => (
                    <tr key={lesson.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link href={`/lessons/${lesson.id}`} className="font-medium text-navy hover:underline">
                          {lesson.title || "Untitled lesson"}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <MinistryTag ministry={lesson.ministry} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lesson.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => restore(lesson)}>
                            <RotateCcw size={13} /> Restore
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => remove(lesson.id)}>
                            <Trash2 size={13} /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="space-y-3 lg:hidden">
              {archived.map((lesson) => (
                <div key={lesson.id} className="rounded-md border border-border bg-paper p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/lessons/${lesson.id}`} className="min-w-0 flex-1 font-medium text-navy">
                      {lesson.title || "Untitled lesson"}
                    </Link>
                    <StatusBadge status={lesson.status} />
                  </div>
                  <div className="mt-1"><MinistryTag ministry={lesson.ministry} /></div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => restore(lesson)}>
                      <RotateCcw size={13} /> Restore
                    </Button>
                    <Button size="sm" variant="danger" className="flex-1" onClick={() => remove(lesson.id)}>
                      <Trash2 size={13} /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
