"use client";

import { useRouter } from "next/navigation";
import { useLessonPlans } from "@/lib/store";
import { useActivities } from "@/lib/activities-store";
import { TEMPLATES } from "@/lib/data/templates";
import { RESOURCE_COUNTS } from "@/lib/data/seed";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { UpcomingLessons } from "@/components/dashboard/upcoming-lessons";
import { RecentLessonsTable } from "@/components/dashboard/recent-lessons-table";
import { QuickStart } from "@/components/dashboard/quick-start";
import { ResourceOverview } from "@/components/dashboard/resource-overview";
import { SeasonalSuggestions } from "@/components/dashboard/seasonal-suggestions";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const { lessons, loaded } = useLessonPlans();
  const { activities, loaded: activitiesLoaded } = useActivities();

  if (!loaded || !activitiesLoaded) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-gold/25 bg-gold-soft/60 px-6 py-6 shadow-soft">
        <div className="flex items-center gap-4">
          <Avatar name="Angela Kalopisis" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-semibold text-navy">{greeting()}, Angela</h1>
            <p className="mt-1 text-sm text-charcoal-soft">Continue planning your youth ministry sessions.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push("/templates")}>
            Browse templates
          </Button>
          <Button onClick={() => router.push("/lessons/new")}>Create lesson plan</Button>
        </div>
      </div>

      <section className="mt-9">
        <h2 className="font-heading text-base font-semibold text-navy">Upcoming lessons</h2>
        <div className="mt-3">
          <UpcomingLessons lessons={lessons} />
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-heading text-base font-semibold text-navy">Recent lesson plans</h2>
        <div className="mt-3">
          <RecentLessonsTable lessons={lessons} />
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-heading text-base font-semibold text-navy">Quick start</h2>
        <div className="mt-3">
          <QuickStart />
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-heading text-base font-semibold text-navy">Resource overview</h2>
        <div className="mt-3">
          <ResourceOverview
            lessonPlans={lessons.filter((l) => !l.archived).length}
            activities={activities.length}
            prayers={RESOURCE_COUNTS.prayers}
            scripturePassages={RESOURCE_COUNTS.scripturePassages}
            templates={TEMPLATES.length}
          />
        </div>
      </section>

      <section className="mt-9 pb-4">
        <h2 className="font-heading text-base font-semibold text-navy">Seasonal suggestions</h2>
        <p className="text-sm text-charcoal-soft">Browse lessons connected to the liturgical calendar.</p>
        <div className="mt-3">
          <SeasonalSuggestions />
        </div>
      </section>
    </div>
  );
}
