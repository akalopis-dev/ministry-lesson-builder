"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Download } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge, MinistryTag } from "@/components/ui/badge";
import { useLessonPlans } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentLessonsTable({ lessons }: { lessons: LessonPlan[] }) {
  const router = useRouter();
  const { duplicateLesson } = useLessonPlans();
  const showToast = useToast();

  const recent = [...lessons]
    .filter((l) => !l.archived)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 6);

  function handleDuplicate(lessonId: string) {
    const copy = duplicateLesson(lessonId);
    if (copy) {
      showToast("Lesson duplicated");
      router.push(`/lessons/${copy.id}/edit`);
    }
  }

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-md border border-border shadow-soft lg:block">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-charcoal-soft">
            <tr>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Ministry</th>
              <th className="px-4 py-2.5 font-medium">Theme</th>
              <th className="px-4 py-2.5 font-medium">Last edited</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((lesson) => (
              <tr key={lesson.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/lessons/${lesson.id}`} className="font-medium text-navy hover:underline">
                    {lesson.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <MinistryTag ministry={lesson.ministry} />
                </td>
                <td className="px-4 py-3 text-charcoal-soft">{lesson.theme}</td>
                <td className="px-4 py-3 text-charcoal-soft">{timeAgo(lesson.updatedAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lesson.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button title="Duplicate" onClick={() => handleDuplicate(lesson.id)} className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
                      <Copy size={14} />
                    </button>
                    <button
                      title="Print / export"
                      onClick={() => router.push(`/lessons/${lesson.id}?print=1`)}
                      className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: simplified stacked list */}
      <div className="divide-y divide-border rounded-md border border-border bg-paper shadow-soft lg:hidden">
        {recent.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href={`/lessons/${lesson.id}`} className="min-w-0 flex-1">
              <p className="truncate font-medium text-navy">{lesson.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-soft">
                <MinistryTag ministry={lesson.ministry} /> · {timeAgo(lesson.updatedAt)}
              </p>
            </Link>
            <StatusBadge status={lesson.status} />
          </div>
        ))}
      </div>
    </>
  );
}
