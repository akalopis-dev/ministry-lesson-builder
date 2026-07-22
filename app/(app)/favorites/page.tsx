"use client";

import Link from "next/link";
import { Star, NotebookText, Blocks } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import { useActivities } from "@/lib/activities-store";
import { StatusBadge, ActivityCategoryTag, MinistryTag } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";

export default function FavoritesPage() {
  const { lessons, loaded: lessonsLoaded } = useLessonPlans();
  const { activities, loaded: activitiesLoaded } = useActivities();

  if (!lessonsLoaded || !activitiesLoaded) return <LoadingState label="Loading favorites…" />;

  const favoriteLessons = lessons.filter((l) => l.favorite && !l.archived);
  const favoriteActivities = activities.filter((a) => a.favorite);
  const total = favoriteLessons.length + favoriteActivities.length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <Star size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Favorites</h1>
          <p className="text-sm text-charcoal-soft">Lesson plans and activities you&rsquo;ve starred.</p>
        </div>
      </div>

      <div className="mt-8">
        {total === 0 ? (
          <EmptyState
            icon={Star}
            title="No favorites yet"
            description="Star a lesson plan or activity to find it quickly here."
          />
        ) : (
          <div className="space-y-8">
            {favoriteLessons.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                  <NotebookText size={14} /> Lesson plans ({favoriteLessons.length})
                </h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {favoriteLessons.map((l) => (
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

            {favoriteActivities.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                  <Blocks size={14} /> Activities ({favoriteActivities.length})
                </h2>
                <div className="mt-2 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
                  {favoriteActivities.map((a) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
