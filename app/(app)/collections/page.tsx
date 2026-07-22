"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, NotebookText, Blocks } from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import { CollectionFormDrawer } from "@/components/collections/collection-form-drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";

export default function CollectionsPage() {
  const { collections, loaded, addCollection } = useCollections();
  const [formOpen, setFormOpen] = useState(false);

  if (!loaded) return <LoadingState label="Loading collections…" />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
            <FolderKanban size={17} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-navy">Collections</h1>
            <p className="text-sm text-charcoal-soft">Curated groups of lessons and activities — like Great Lent or First GOYA Meeting.</p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={15} /> New collection
        </Button>
      </div>

      <div className="mt-8">
        {collections.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No collections yet"
            description="Group related lessons and activities together — like Great Lent, First GOYA Meeting, or No-Supply Activities."
            action={
              <Button onClick={() => setFormOpen(true)}>
                <Plus size={15} /> New collection
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="flex flex-col rounded-md border border-border bg-paper p-4 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <h2 className="font-heading text-base font-semibold text-navy">{c.name}</h2>
                {c.description && <p className="mt-1 text-sm text-charcoal-soft">{c.description}</p>}
                <div className="mt-3 flex items-center gap-4 text-xs text-charcoal-soft">
                  <span className="flex items-center gap-1.5">
                    <NotebookText size={13} /> {c.lessonIds.length} lesson{c.lessonIds.length === 1 ? "" : "s"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Blocks size={13} /> {c.activityIds.length} activit{c.activityIds.length === 1 ? "y" : "ies"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CollectionFormDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        collection={null}
        onSave={(name, description) => addCollection(name, description)}
      />
    </div>
  );
}
