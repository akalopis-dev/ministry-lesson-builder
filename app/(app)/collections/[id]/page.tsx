"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, FileQuestion } from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import { useLessonPlans } from "@/lib/store";
import { useActivities } from "@/lib/activities-store";
import { StatusBadge, ActivityCategoryTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Drawer } from "@/components/ui/drawer";
import { CollectionFormDrawer } from "@/components/collections/collection-form-drawer";

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getCollection, updateCollection, deleteCollection, addLessonToCollection, removeLessonFromCollection, addActivityToCollection, removeActivityFromCollection, loaded: collectionsLoaded } = useCollections();
  const { lessons, loaded: lessonsLoaded } = useLessonPlans();
  const { activities, loaded: activitiesLoaded } = useActivities();
  const [editOpen, setEditOpen] = useState(false);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);

  if (!collectionsLoaded || !lessonsLoaded || !activitiesLoaded) return <LoadingState label="Loading collection…" />;

  const collection = getCollection(params.id);

  if (!collection) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <EmptyState
          icon={FileQuestion}
          title="Collection not found"
          description="This collection may have been deleted."
          action={<Button onClick={() => router.push("/collections")}>Back to Collections</Button>}
        />
      </div>
    );
  }

  const collectionLessons = collection.lessonIds.map((id) => lessons.find((l) => l.id === id)).filter((l) => l !== undefined);
  const collectionActivities = collection.activityIds.map((id) => activities.find((a) => a.id === id)).filter((a) => a !== undefined);
  const availableLessons = lessons.filter((l) => !l.archived && !collection.lessonIds.includes(l.id));
  const availableActivities = activities.filter((a) => !collection.activityIds.includes(a.id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <Link href="/collections" className="text-xs font-medium text-charcoal-soft hover:text-navy">
        ← Back to Collections
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">{collection.name}</h1>
          {collection.description && <p className="mt-1 text-sm text-charcoal-soft">{collection.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil size={13} /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  `Move the "${collection.name}" collection to Trash? This does not delete the lessons or activities inside it. You can restore it from Trash for 30 days.`
                )
              ) {
                deleteCollection(collection.id);
                router.push("/collections");
              }
            }}
          >
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-navy">Lessons ({collectionLessons.length})</h2>
          <Button size="sm" variant="secondary" onClick={() => setAddLessonOpen(true)}>
            <Plus size={13} /> Add lesson
          </Button>
        </div>
        {collectionLessons.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal-soft">No lessons in this collection yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
            {collectionLessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <Link href={`/lessons/${l.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy hover:underline">{l.title}</p>
                  <p className="text-xs text-charcoal-soft">{l.ministry}</p>
                </Link>
                <StatusBadge status={l.status} />
                <button
                  onClick={() => removeLessonFromCollection(collection.id, l.id)}
                  className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy"
                  title="Remove from collection"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-navy">Activities ({collectionActivities.length})</h2>
          <Button size="sm" variant="secondary" onClick={() => setAddActivityOpen(true)}>
            <Plus size={13} /> Add activity
          </Button>
        </div>
        {collectionActivities.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal-soft">No activities in this collection yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-md border border-border bg-paper shadow-soft">
            {collectionActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy">{a.title}</p>
                  <p className="text-xs text-charcoal-soft">{a.summary}</p>
                </div>
                <ActivityCategoryTag category={a.category} />
                <button
                  onClick={() => removeActivityFromCollection(collection.id, a.id)}
                  className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy"
                  title="Remove from collection"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <CollectionFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        collection={collection}
        onSave={(name, description) => updateCollection({ ...collection, name, description })}
      />

      <Drawer open={addLessonOpen} onClose={() => setAddLessonOpen(false)} title="Add lesson to collection">
        <div className="space-y-2">
          {availableLessons.length === 0 ? (
            <p className="text-sm text-charcoal-soft">Every lesson is already in this collection, or you have none yet.</p>
          ) : (
            availableLessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{l.title}</p>
                  <p className="text-xs text-charcoal-soft">{l.ministry}</p>
                </div>
                <Button size="sm" onClick={() => addLessonToCollection(collection.id, l.id)}>
                  Add
                </Button>
              </div>
            ))
          )}
        </div>
      </Drawer>

      <Drawer open={addActivityOpen} onClose={() => setAddActivityOpen(false)} title="Add activity to collection">
        <div className="space-y-2">
          {availableActivities.length === 0 ? (
            <p className="text-sm text-charcoal-soft">Every activity is already in this collection.</p>
          ) : (
            availableActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{a.title}</p>
                  <p className="text-xs text-charcoal-soft">{a.summary}</p>
                </div>
                <Button size="sm" onClick={() => addActivityToCollection(collection.id, a.id)}>
                  Add
                </Button>
              </div>
            ))
          )}
        </div>
      </Drawer>
    </div>
  );
}
