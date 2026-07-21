"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, NotebookText, Blocks, LayoutTemplate } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import { useActivities } from "@/lib/activities-store";
import { TEMPLATES } from "@/lib/data/templates";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge, ActivityCategoryTag, MinistryTag } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

function lessonMatches(lesson: LessonPlan, q: string): boolean {
  if (
    lesson.title.toLowerCase().includes(q) ||
    lesson.theme.toLowerCase().includes(q) ||
    lesson.summary.toLowerCase().includes(q) ||
    lesson.ministry.toLowerCase().includes(q) ||
    lesson.author.toLowerCase().includes(q)
  ) {
    return true;
  }
  if (lesson.sources.some((s) => s.reference.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q))) return true;
  if (lesson.discussionQuestions.some((d) => d.text.toLowerCase().includes(q))) return true;
  if (lesson.materials.some((m) => m.name.toLowerCase().includes(q))) return true;
  return false;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lessons, loaded: lessonsLoaded } = useLessonPlans();
  const { activities, loaded: activitiesLoaded } = useActivities();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const q = query.trim().toLowerCase();

  const matchedLessons = useMemo(() => {
    if (!q) return [];
    return lessons.filter((l) => !l.archived && lessonMatches(l, q));
  }, [lessons, q]);

  const matchedActivities = useMemo(() => {
    if (!q) return [];
    return activities.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }, [activities, q]);

  const matchedTemplates = useMemo(() => {
    if (!q) return [];
    return TEMPLATES.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [q]);

  const totalResults = matchedLessons.length + matchedActivities.length + matchedTemplates.length;

  if (!lessonsLoaded || !activitiesLoaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-heading text-2xl font-semibold text-navy">Search</h1>
      <p className="mt-1 text-sm text-charcoal-soft">Search across lesson plans, activities, and templates.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
        }}
        className="relative mt-6"
      >
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search lessons, activities, templates..."
          className="w-full rounded-md border border-border-strong bg-paper py-2.5 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </form>

      <div className="mt-8">
        {!q ? (
          <EmptyState icon={Search} title="Search everything in one place" description="Try a lesson title, a theme, a Scripture reference, an activity name, or a material." />
        ) : totalResults === 0 ? (
          <EmptyState icon={Search} title="No results" description={`Nothing matched "${query}". Try a different word or check your spelling.`} />
        ) : (
          <div className="space-y-8">
            {matchedLessons.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                  <NotebookText size={14} /> Lesson plans ({matchedLessons.length})
                </h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {matchedLessons.map((l) => (
                    <Link key={l.id} href={`/lessons/${l.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface/40">
                      <div>
                        <p className="font-medium text-navy">{l.title}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-soft">
                          <MinistryTag ministry={l.ministry} /> · {l.theme}
                        </p>
                      </div>
                      <StatusBadge status={l.status} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {matchedActivities.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                  <Blocks size={14} /> Activities ({matchedActivities.length})
                </h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {matchedActivities.map((a) => (
                    <Link key={a.id} href="/activities" className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface/40">
                      <div>
                        <p className="font-medium text-navy">{a.title}</p>
                        <p className="text-xs text-charcoal-soft">{a.summary}</p>
                      </div>
                      <ActivityCategoryTag category={a.category} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {matchedTemplates.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                  <LayoutTemplate size={14} /> Templates ({matchedTemplates.length})
                </h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {matchedTemplates.map((t) => (
                    <Link key={t.id} href="/templates" className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface/40">
                      <div>
                        <p className="font-medium text-navy">{t.name}</p>
                        <p className="text-xs text-charcoal-soft">{t.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
