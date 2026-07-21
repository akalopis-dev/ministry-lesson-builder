"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Collection } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface CollectionsContextValue {
  collections: Collection[];
  loaded: boolean;
  getCollection: (id: string) => Collection | undefined;
  addCollection: (name: string, description: string) => Collection;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Collection>("collections")
      .then((data) => {
        if (!cancelled) setCollections(data);
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

  const getCollection = useCallback((id: string) => collections.find((c) => c.id === id), [collections]);

  // Shared helper: apply `updater` to the collection matching `collectionId`, optimistically,
  // then persist just that row — rolling the whole list back on failure.
  const mutateCollection = useCallback(
    (collectionId: string, updater: (c: Collection) => Collection, failureMessage: string) => {
      let previous: Collection[] = [];
      let updated: Collection | undefined;
      setCollections((prev) => {
        previous = prev;
        return prev.map((c) => {
          if (c.id !== collectionId) return c;
          updated = updater(c);
          return updated;
        });
      });
      if (updated) {
        upsertRow("collections", updated).catch(() => {
          setCollections(previous);
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
      setCollections((prev) => [created, ...prev]);
      upsertRow("collections", created).catch(() => {
        setCollections((prev) => prev.filter((c) => c.id !== created.id));
        showToast("Couldn't create the collection — try again");
      });
      return created;
    },
    [showToast]
  );

  const updateCollection = useCallback(
    (collection: Collection) => {
      let previous: Collection[] = [];
      setCollections((prev) => {
        previous = prev;
        return prev.map((c) => (c.id === collection.id ? collection : c));
      });
      upsertRow("collections", collection).catch(() => {
        setCollections(previous);
        showToast("Couldn't save the collection — try again");
      });
    },
    [showToast]
  );

  const deleteCollection = useCallback(
    (id: string) => {
      let previous: Collection[] = [];
      setCollections((prev) => {
        previous = prev;
        return prev.filter((c) => c.id !== id);
      });
      deleteRow("collections", id).catch(() => {
        setCollections(previous);
        showToast("Couldn't delete the collection — try again");
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
      loaded,
      getCollection,
      addCollection,
      updateCollection,
      deleteCollection,
      addLessonToCollection,
      removeLessonFromCollection,
      addActivityToCollection,
      removeActivityFromCollection,
    }),
    [
      collections,
      loaded,
      getCollection,
      addCollection,
      updateCollection,
      deleteCollection,
      addLessonToCollection,
      removeLessonFromCollection,
      addActivityToCollection,
      removeActivityFromCollection,
    ]
  );

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}
