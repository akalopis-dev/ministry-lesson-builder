import { HelpCircle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

const STEPS = [
  { title: "Lesson details", body: "Title, ministry, ages, theme, season, duration, and who's leading." },
  { title: "Learning objectives", body: "Add 1–5 goals for what participants should walk away with." },
  { title: "Scripture & sources", body: "Add the passages, prayers, or texts the lesson draws on." },
  { title: "Lesson timeline", body: "Build the session block by block — drag to reorder, or insert a ready-made activity from the Activity Library." },
  { title: "Discussion questions", body: "Organize questions by opening, comprehension, reflection, and application." },
  { title: "Materials & preparation", body: "“Import from timeline” collects supplies automatically; add a prep checklist." },
  { title: "Safety & accessibility", body: "Note any hazards, accommodations, or a weather backup plan." },
  { title: "Parent & leader communication", body: "Write the parent summary, leader briefing, and take-home content." },
  { title: "Review & export", body: "Check the completeness list, then print or export the version you need." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <HelpCircle size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Help &amp; how to use</h1>
          <p className="text-sm text-charcoal-soft">A quick guide to planning lessons with this tool.</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader title="Getting started" subtitle="No account, no sign-in — just open and go." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              This tool opens straight into the <b>Dashboard</b>, where you&rsquo;ll see upcoming lessons, recently
              edited plans, and a few quick-start shortcuts. There&rsquo;s nothing to log into — everything you create
              is saved automatically on this device as you work.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Creating a lesson plan" subtitle="Nine steps, in whatever order you like." />
          <div className="px-5 py-4">
            <p className="text-sm text-charcoal">
              Click <b>Create Lesson</b> in the sidebar, or start from a template on the Templates page. The left-hand
              outline lets you jump between steps in any order — a green check means a step is complete, but nothing
              is locked or required until you&rsquo;re ready to export.
            </p>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong text-[11px] text-charcoal-soft">
                    {i + 1}
                  </span>
                  <span>
                    <b className="text-navy">{step.title}</b> — <span className="text-charcoal-soft">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <Card>
          <CardHeader title="Activity Library" subtitle="Icebreakers, games, and faith-teaching activities, ready to drop in." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              Browse or search the library, filter by ministry, category, or &ldquo;No supplies needed,&rdquo; and click{" "}
              <b>Insert from Activity Library</b> on the Timeline step of any lesson to add one straight into your
              schedule with its timing already set. Click the bookmark icon on any timeline block to save it back to
              the library for reuse. Use <b>Add activity</b> to build your own from scratch, or the star icon to mark
              favorites.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Collections" subtitle="Group related lessons and activities together." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              Create a collection — like <i>Great Lent</i> or <i>First GOYA Meeting</i> — then add any lesson or
              activity to it from the collection&rsquo;s own page. Nothing is duplicated; a collection just points at
              existing lessons and activities, so removing something from a collection doesn&rsquo;t delete it.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Calendar and search" subtitle="Two ways to find what you're looking for." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              <b>Calendar</b> shows every lesson with a scheduled date, grouped by month. The search bar at the top of
              every page searches across lesson plans, activities, and templates at once, with results grouped by
              type.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Finding and managing lessons" subtitle="The Lesson Plans Library." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              Search, filter by ministry/status/season/theme, and switch between Table and Card views. Select multiple
              lessons with the checkboxes to archive them in bulk. Archived lessons aren&rsquo;t deleted — find and
              restore them from <b>Archived</b> in the sidebar.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Exporting and printing" subtitle="From any lesson's detail page." />
          <div className="px-5 py-4 text-sm text-charcoal">
            <p>
              Open a lesson and use the <b>Export</b> menu to print the full lesson, or generate a Leader version,
              Parent summary, Materials checklist, One-page run sheet, or Participant handout — each shows only the
              sections that version needs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
