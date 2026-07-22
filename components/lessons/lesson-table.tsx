"use client";

import Link from "next/link";
import { Copy, Download, Archive, Trash2, Star } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge, MinistryTag } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AddToCollectionMenu } from "@/components/collections/add-to-collection-menu";
import { formatMinutes } from "@/lib/time";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function LessonTable({
  lessons,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onDuplicate,
  onArchive,
  onDelete,
  onToggleFavorite,
}: {
  lessons: LessonPlan[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const allSelected = lessons.length > 0 && lessons.every((l) => selected.has(l.id));

  return (
    <div className="overflow-x-auto rounded-md border border-border shadow-soft">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-charcoal-soft">
          <tr>
            <th className="w-10 px-4 py-2.5">
              <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} aria-label="Select all" />
            </th>
            <th className="w-8 px-2 py-2.5" />
            <th className="px-4 py-2.5 font-medium">Lesson title</th>
            <th className="px-4 py-2.5 font-medium">Ministry</th>
            <th className="px-4 py-2.5 font-medium">Theme</th>
            <th className="px-4 py-2.5 font-medium">Duration</th>
            <th className="px-4 py-2.5 font-medium">Season</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Author</th>
            <th className="px-4 py-2.5 font-medium">Last edited</th>
            <th className="px-4 py-2.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id} className="border-t border-border hover:bg-surface/40">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(lesson.id)}
                  onChange={() => onToggleSelect(lesson.id)}
                  aria-label={`Select ${lesson.title}`}
                />
              </td>
              <td className="px-2 py-3">
                <button
                  onClick={() => onToggleFavorite(lesson.id)}
                  title={lesson.favorite ? "Remove from favorites" : "Add to favorites"}
                  className={`rounded p-1 hover:bg-gold-soft ${lesson.favorite ? "text-gold" : "text-charcoal-soft hover:text-gold"}`}
                >
                  <Star size={13} className={lesson.favorite ? "fill-current" : ""} />
                </button>
              </td>
              <td className="px-4 py-3">
                <Link href={`/lessons/${lesson.id}`} className="font-medium text-navy hover:underline">
                  {lesson.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <MinistryTag ministry={lesson.ministry} />
              </td>
              <td className="px-4 py-3 text-charcoal-soft">{lesson.theme}</td>
              <td className="px-4 py-3 text-charcoal-soft">{formatMinutes(lesson.durationMinutes)}</td>
              <td className="px-4 py-3 text-charcoal-soft">{lesson.season}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lesson.status} />
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-2 text-charcoal-soft">
                  <Avatar name={lesson.author || "Unassigned"} size="sm" />
                  {lesson.author || "Unassigned"}
                </span>
              </td>
              <td className="px-4 py-3 text-charcoal-soft">{formatDate(lesson.updatedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/lessons/${lesson.id}/edit`}
                    title="Open"
                    className="rounded-md px-2 py-1 text-xs font-medium text-navy hover:bg-surface"
                  >
                    Open
                  </Link>
                  <button title="Duplicate" onClick={() => onDuplicate(lesson.id)} className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
                    <Copy size={14} />
                  </button>
                  <Link
                    href={`/lessons/${lesson.id}?print=1`}
                    title="Export"
                    className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy"
                  >
                    <Download size={14} />
                  </Link>
                  <AddToCollectionMenu itemId={lesson.id} itemType="lesson" className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy" />
                  <button title="Archive" onClick={() => onArchive(lesson.id)} className="rounded-md p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy">
                    <Archive size={14} />
                  </button>
                  <button title="Delete" onClick={() => onDelete(lesson.id)} className="rounded-md p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
