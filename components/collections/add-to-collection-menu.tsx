"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderPlus, Check } from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import type { Collection } from "@/lib/types";

export function AddToCollectionMenu({
  itemId,
  itemType,
  className,
}: {
  itemId: string;
  itemType: "lesson" | "activity";
  className?: string;
}) {
  const { collections, addLessonToCollection, removeLessonFromCollection, addActivityToCollection, removeActivityFromCollection } =
    useCollections();
  const [open, setOpen] = useState(false);

  function isIn(c: Collection) {
    return itemType === "lesson" ? c.lessonIds.includes(itemId) : c.activityIds.includes(itemId);
  }

  function toggle(c: Collection) {
    const already = isIn(c);
    if (itemType === "lesson") {
      if (already) removeLessonFromCollection(c.id, itemId);
      else addLessonToCollection(c.id, itemId);
    } else {
      if (already) removeActivityFromCollection(c.id, itemId);
      else addActivityToCollection(c.id, itemId);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title="Add to collection"
        className={className ?? "rounded p-1.5 text-charcoal-soft hover:bg-surface hover:text-navy"}
      >
        <FolderPlus size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-border bg-paper py-1 shadow-floating">
            {collections.length === 0 ? (
              <div className="px-3 py-2 text-xs text-charcoal-soft">
                No collections yet.{" "}
                <Link href="/collections" className="underline">
                  Create one
                </Link>
              </div>
            ) : (
              collections.map((c) => (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(c);
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm text-charcoal hover:bg-surface"
                >
                  <span className="truncate">{c.name}</span>
                  {isIn(c) && <Check size={13} className="shrink-0 text-olive" />}
                </button>
              ))
            )}
            <div className="mt-1 border-t border-border pt-1">
              <Link href="/collections" className="block px-3 py-1.5 text-xs text-charcoal-soft hover:bg-surface">
                Manage collections →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
