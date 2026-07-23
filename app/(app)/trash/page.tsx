"use client";

import { useMemo } from "react";
import { Trash2, RotateCcw, NotebookText, Blocks, FolderKanban, BookOpen, HandHelping, LayoutTemplate } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLessonPlans } from "@/lib/store";
import { useActivities } from "@/lib/activities-store";
import { useCollections } from "@/lib/collections-store";
import { useScripture } from "@/lib/scripture-store";
import { usePrayers } from "@/lib/prayers-store";
import { useTemplates } from "@/lib/templates-store";
import { TRASH_RETENTION_DAYS } from "@/lib/trash";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface TrashRow {
  id: string;
  type: string;
  icon: LucideIcon;
  title: string;
  trashedAt: string;
  restore: () => void;
  permanentlyDelete: () => void;
}

function daysLeft(trashedAt: string): number {
  const elapsedMs = Date.now() - new Date(trashedAt).getTime();
  const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
  return Math.max(0, TRASH_RETENTION_DAYS - elapsedDays);
}

export default function TrashPage() {
  const lessonPlans = useLessonPlans();
  const activities = useActivities();
  const collections = useCollections();
  const scripture = useScripture();
  const prayers = usePrayers();
  const templates = useTemplates();
  const showToast = useToast();

  const loaded =
    lessonPlans.loaded && activities.loaded && collections.loaded && scripture.loaded && prayers.loaded && templates.loaded;

  const rows: TrashRow[] = useMemo(() => {
    const items: TrashRow[] = [
      ...lessonPlans.trashedLessons.map((l) => ({
        id: l.id,
        type: "Lesson plan",
        icon: NotebookText,
        title: l.title || "Untitled lesson",
        trashedAt: l.trashedAt!,
        restore: () => lessonPlans.restoreLesson(l.id),
        permanentlyDelete: () => lessonPlans.permanentlyDeleteLesson(l.id),
      })),
      ...activities.trashedActivities.map((a) => ({
        id: a.id,
        type: "Activity",
        icon: Blocks,
        title: a.title || "Untitled activity",
        trashedAt: a.trashedAt!,
        restore: () => activities.restoreActivity(a.id),
        permanentlyDelete: () => activities.permanentlyDeleteActivity(a.id),
      })),
      ...collections.trashedCollections.map((c) => ({
        id: c.id,
        type: "Collection",
        icon: FolderKanban,
        title: c.name || "Untitled collection",
        trashedAt: c.trashedAt!,
        restore: () => collections.restoreCollection(c.id),
        permanentlyDelete: () => collections.permanentlyDeleteCollection(c.id),
      })),
      ...scripture.trashedPassages.map((p) => ({
        id: p.id,
        type: "Scripture passage",
        icon: BookOpen,
        title: p.title || "Untitled passage",
        trashedAt: p.trashedAt!,
        restore: () => scripture.restorePassage(p.id),
        permanentlyDelete: () => scripture.permanentlyDeletePassage(p.id),
      })),
      ...prayers.trashedPrayers.map((p) => ({
        id: p.id,
        type: "Prayer",
        icon: HandHelping,
        title: p.title || "Untitled prayer",
        trashedAt: p.trashedAt!,
        restore: () => prayers.restorePrayer(p.id),
        permanentlyDelete: () => prayers.permanentlyDeletePrayer(p.id),
      })),
      ...templates.trashedTemplates.map((t) => ({
        id: t.id,
        type: "Template",
        icon: LayoutTemplate,
        title: t.name || "Untitled template",
        trashedAt: t.trashedAt!,
        restore: () => templates.restoreTemplate(t.id),
        permanentlyDelete: () => templates.permanentlyDeleteTemplate(t.id),
      })),
    ];
    return items.sort((a, b) => (a.trashedAt < b.trashedAt ? 1 : -1));
  }, [lessonPlans, activities, collections, scripture, prayers, templates]);

  if (!loaded) return <LoadingState label="Loading Trash…" />;

  function handleRestore(row: TrashRow) {
    row.restore();
    showToast(`Restored "${row.title}"`);
  }

  function handlePermanentlyDelete(row: TrashRow) {
    if (window.confirm(`Permanently delete "${row.title}"? This cannot be undone.`)) {
      row.permanentlyDelete();
      showToast(`Permanently deleted "${row.title}"`);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <Trash2 size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Trash</h1>
          <p className="text-sm text-charcoal-soft">
            Deleted items stay here for {TRASH_RETENTION_DAYS} days before being permanently removed.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState icon={Trash2} title="Trash is empty" description="Anything you delete will appear here first, so it can be restored if deleted by mistake." />
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-md border border-border shadow-soft lg:block">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-charcoal-soft">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Item</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Deleted</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <tr key={`${row.type}-${row.id}`} className="border-t border-border">
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2 font-medium text-navy">
                            <Icon size={14} className="text-charcoal-soft" /> {row.title}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-charcoal-soft">{row.type}</td>
                        <td className="px-4 py-3 text-charcoal-soft">{daysLeft(row.trashedAt)} days left</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleRestore(row)}>
                              <RotateCcw size={13} /> Restore
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handlePermanentlyDelete(row)}>
                              <Trash2 size={13} /> Delete permanently
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="space-y-3 lg:hidden">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={`${row.type}-${row.id}`} className="rounded-md border border-border bg-paper p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 flex-1 items-center gap-2 font-medium text-navy">
                        <Icon size={14} className="shrink-0 text-charcoal-soft" /> {row.title}
                      </span>
                      <span className="shrink-0 text-xs text-charcoal-soft">{daysLeft(row.trashedAt)}d left</span>
                    </div>
                    <p className="mt-1 text-xs text-charcoal-soft">{row.type}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleRestore(row)}>
                        <RotateCcw size={13} /> Restore
                      </Button>
                      <Button size="sm" variant="danger" className="flex-1" onClick={() => handlePermanentlyDelete(row)}>
                        <Trash2 size={13} /> Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
