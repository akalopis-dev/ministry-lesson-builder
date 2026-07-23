"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Table2, LayoutGrid, Archive, X } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { FiltersBar, type LessonFilters } from "@/components/lessons/filters-bar";
import { LessonTable } from "@/components/lessons/lesson-table";
import { LessonCardGrid } from "@/components/lessons/lesson-card-grid";
import type { LiturgicalSeason } from "@/lib/types";

function LessonsLibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lessons, loaded, duplicateLesson, archiveLessons, archiveLesson, deleteLesson, toggleFavorite } = useLessonPlans();
  const showToast = useToast();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [view, setView] = useState<"table" | "card">("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<LessonFilters>({
    ministry: null,
    status: null,
    season: (searchParams.get("season") as LiturgicalSeason) || null,
    theme: null,
  });

  const themes = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l) => l.theme && set.add(l.theme));
    return Array.from(set).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((l) => {
      if (l.archived) return false;
      if (filters.ministry && l.ministry !== filters.ministry) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.season && l.season !== filters.season) return false;
      if (filters.theme && l.theme !== filters.theme) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.theme.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.ministry.toLowerCase().includes(q) ||
        l.sources.some((s) => s.reference.toLowerCase().includes(q))
      );
    });
  }, [lessons, query, filters]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      if (filtered.every((l) => prev.has(l.id))) return new Set();
      return new Set(filtered.map((l) => l.id));
    });
  }

  function handleDuplicate(id: string) {
    const copy = duplicateLesson(id);
    if (copy) {
      showToast("Lesson duplicated");
      router.push(`/lessons/${copy.id}/edit`);
    }
  }

  function handleDelete(id: string) {
    if (window.confirm("Move this lesson plan to Trash? You can restore it from Trash for 30 days.")) {
      deleteLesson(id);
      showToast("Moved to Trash");
    }
  }

  function handleArchive(id: string) {
    archiveLesson(id);
    showToast("Lesson archived");
  }

  function handleBulkArchive() {
    archiveLessons(Array.from(selected));
    showToast(`${selected.size} lesson${selected.size === 1 ? "" : "s"} archived`);
    setSelected(new Set());
  }

  const hasAnyLessons = lessons.filter((l) => !l.archived).length > 0;

  if (!loaded) return <LoadingState label="Loading lesson plans…" />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Lesson Plans</h1>
          <p className="mt-1 text-sm text-charcoal-soft">Browse, filter, and manage every lesson in your ministry.</p>
        </div>
        <Button onClick={() => router.push("/lessons/new")}>Create lesson plan</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lesson plans..."
            className="w-full rounded-md border border-border-strong bg-paper py-2 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border-strong p-0.5">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium ${view === "table" ? "bg-navy text-paper" : "text-charcoal-soft hover:bg-surface"}`}
          >
            <Table2 size={13} /> Table
          </button>
          <button
            onClick={() => setView("card")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium ${view === "card" ? "bg-navy text-paper" : "text-charcoal-soft hover:bg-surface"}`}
          >
            <LayoutGrid size={13} /> Card
          </button>
        </div>
      </div>

      <div className="mt-5">
        <FiltersBar filters={filters} onChange={setFilters} themes={themes} />
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-md border border-gold/40 bg-gold-soft px-4 py-2.5">
          <span className="text-sm font-medium text-[#7a5a20]">{selected.size} selected</span>
          <Button size="sm" variant="secondary" onClick={handleBulkArchive}>
            <Archive size={13} /> Archive selected
          </Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-charcoal-soft hover:text-charcoal">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="mt-5">
        {!hasAnyLessons ? (
          <EmptyState
            title="No lesson plans yet"
            description="Create your first lesson plan or begin with a ministry template."
            action={
              <>
                <Button onClick={() => router.push("/lessons/new")}>Create lesson</Button>
                <Button variant="secondary" onClick={() => router.push("/templates")}>
                  Browse templates
                </Button>
              </>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No lessons match these filters"
            description="Remove a filter or adjust your search to see more lesson plans."
            action={
              <Button variant="secondary" onClick={() => setFilters({ ministry: null, status: null, season: null, theme: null })}>
                Clear filters
              </Button>
            }
          />
        ) : view === "table" ? (
          <LessonTable
            lessons={filtered}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <LessonCardGrid lessons={filtered} onDuplicate={handleDuplicate} onToggleFavorite={toggleFavorite} />
        )}
      </div>
    </div>
  );
}

export default function LessonsLibraryPage() {
  return (
    <Suspense fallback={null}>
      <LessonsLibraryContent />
    </Suspense>
  );
}
