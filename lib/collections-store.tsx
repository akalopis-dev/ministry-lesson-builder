"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Collection } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

interface CollectionsContextValue {
  collections: Collection[];
  trashedCollections: Collection[];
  loaded: boolean;
  getCollection: (id: string) => Collection | undefined;
  addCollection: (name: string, description: string) => Collection;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  restoreCollection: (id: string) => void;
  permanentlyDeleteCollection: (id: string) => void;
  addLessonToCollection: (collectionId: string, lessonId: string) => void;
  removeLessonFromCollection: (collectionId: string, lessonId: string) => void;
  addActivityToCollection: (collectionId: string, activityId: string) => void;
  removeActivityFromCollection: (collectionId: string, activityId: string) => void;
}

const CollectionsContext = createContext<CollectionsContextValue | null>(null);

export function useCollections(): CollectionsContextValue {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollections must be used within CollectionsProvider");
  return ctx;
}

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Collection>("collections")
      .then((data) => {
        if (cancelled) return;
        const expired = data.filter((c) => c.trashedAt && isTrashExpired(c.trashedAt));
        for (const c of expired) deleteRow("collections", c.id).catch(() => {});
        const expiredIds = new Set(expired.map((c) => c.id));
        const keep = data.filter((c) => !expiredIds.has(c.id));
        // Merge rather than replace: a mutation can complete locally before this
        // initial fetch resolves — replacing state outright would wipe it back out.
        setAllCollections((prev) => {
          const knownIds = new Set(prev.map((c) => c.id));
          return [...prev, ...keep.filter((c) => !knownIds.has(c.id))];
        });
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load collections — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const collections = useMemo(() => allCollections.filter((c) => !c.trashedAt), [allCollections]);
  const trashedCollections = useMemo(() => allCollections.filter((c) => !!c.trashedAt), [allCollections]);

  const getCollection = useCallback((id: string) => allCollections.find((c) => c.id === id), [allCollections]);

  // Shared helper: apply `updater` to the collection matching `collectionId`, optimistically,
  // then persist just that row — rolling the whole list back on failure.
  const mutateCollection = useCallback(
    (collectionId: string, updater: (c: Collection) => Collection, failureMessage: string) => {
      let previous: Collection[] = [];
      let updated: Collection | undefined;
      setAllCollections((prev) => {
        previous = prev;
        return prev.map((c) => {
          if (c.id !== collectionId) return c;
          updated = updater(c);
          return updated;
        });
      });
      if (updated) {
        upsertRow("collections", updated).catch(() => {
          setAllCollections(previous);
          showToast(failureMessage);
        });
      }
    },
    [showToast]
  );

  const addCollection = useCallback(
    (name: string, description: string) => {
      const created: Collection = {
        id: makeId("collection"),
        name,
        description,
        lessonIds: [],
        activityIds: [],
        createdAt: new Date().toISOString(),
      };
      setAllCollections((prev) => [created, ...prev]);
      upsertRow("collections", created).catch(() => {
        setAllCollections((prev) => prev.filter((c) => c.id !== created.id));
        showToast("Couldn't create the collection — try again");
      });
      return created;
    },
    [showToast]
  );

  const updateCollection = useCallback(
    (collection: Collection) => {
      let previous: Collection[] = [];
      setAllCollections((prev) => {
        previous = prev;
        return prev.map((c) => (c.id === collection.id ? collection : c));
      });
      upsertRow("collections", collection).catch(() => {
        setAllCollections(previous);
        showToast("Couldn't save the collection — try again");
      });
    },
    [showToast]
  );

  const deleteCollection = useCallback(
    (id: string) =>
      mutateCollection(
        id,
        (c) => ({ ...c, trashedAt: new Date().toISOString() }),
        "Couldn't move the collection to Trash — try again"
      ),
    [mutateCollection]
  );

  const restoreCollection = useCallback(
    (id: string) => mutateCollection(id, (c) => ({ ...c, trashedAt: undefined }), "Couldn't restore the collection — try again"),
    [mutateCollection]
  );

  const permanentlyDeleteCollection = useCallback(
    (id: string) => {
      let previous: Collection[] = [];
      setAllCollections((prev) => {
        previous = prev;
        return prev.filter((c) => c.id !== id);
      });
      deleteRow("collections", id).catch(() => {
        setAllCollections(previous);
        showToast("Couldn't permanently delete the collection — try again");
      });
    },
    [showToast]
  );

  const addLessonToCollection = useCallback(
    (collectionId: string, lessonId: string) =>
      mutateCollection(
        collectionId,
        (c) => (c.lessonIds.includes(lessonId) ? c : { ...c, lessonIds: [...c.lessonIds, lessonId] }),
        "Couldn't add that lesson — try again"
      ),
    [mutateCollection]
  );

  const removeLessonFromCollection = useCallback(
    (collectionId: string, lessonId: string) =>
      mutateCollection(
        collectionId,
        (c) => ({ ...c, lessonIds: c.lessonIds.filter((id) => id !== lessonId) }),
        "Couldn't remove that lesson — try again"
      ),
    [mutateCollection]
  );

  const addActivityToCollection = useCallback(
    (collectionId: string, activityId: string) =>
      mutateCollection(
        collectionId,
        (c) => (c.activityIds.includes(activityId) ? c : { ...c, activityIds: [...c.activityIds, activityId] }),
        "Couldn't add that activity — try again"
      ),
    [mutateCollection]
  );

  const removeActivityFromCollection = useCallback(
    (collectionId: string, activityId: string) =>
      mutateCollection(
        collectionId,
        (c) => ({ ...c, activityIds: c.activityIds.filter((id) => id !== activityId) }),
        "Couldn't remove that activity — try again"
      ),
    [mutateCollection]
  );

  const value = useMemo(
    () => ({
      collections,
      trashedCollections,
      loaded,
      getCollection,
      addCollection,
      updateCollection,
      deleteCollection,
      restoreCollection,
      permanentlyDeleteCollection,
      addLessonToCollection,
      removeLessonFromCollection,
      addActivityToCollection,
      removeActivityFromCollection,
    }),
    [
      collections,
      trashedCollections,
      loaded,
      getCollection,
      addCollection,
      updateCollection,
      deleteCollection,
      restoreCollection,
      permanentlyDeleteCollection,
      addLessonToCollection,
      removeLessonFromCollection,
      addActivityToCollection,
      removeActivityFromCollection,
    ]
  );

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}
