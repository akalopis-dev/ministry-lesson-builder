"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type LessonPlan } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

const DRAFT_KEY_PREFIX = "mlb.draft.";

interface LessonPlansContextValue {
  lessons: LessonPlan[];
  trashedLessons: LessonPlan[];
  loaded: boolean;
  getLesson: (id: string) => LessonPlan | undefined;
  saveLesson: (lesson: LessonPlan) => void;
  duplicateLesson: (id: string) => LessonPlan | undefined;
  archiveLesson: (id: string) => void;
  archiveLessons: (ids: string[]) => void;
  deleteLesson: (id: string) => void;
  restoreLesson: (id: string) => void;
  permanentlyDeleteLesson: (id: string) => void;
  toggleFavorite: (id: string) => void;
  saveDraft: (draft: LessonPlan) => void;
  getDraft: (id: string) => LessonPlan | undefined;
  clearDraft: (id: string) => void;
}

const LessonPlansContext = createContext<LessonPlansContextValue | null>(null);

export function useLessonPlans(): LessonPlansContextValue {
  const ctx = useContext(LessonPlansContext);
  if (!ctx) throw new Error("useLessonPlans must be used within LessonPlansProvider");
  return ctx;
}

export function LessonPlansProvider({ children }: { children: React.ReactNode }) {
  const [allLessons, setAllLessons] = useState<LessonPlan[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<LessonPlan>("lessons")
      .then((data) => {
        if (cancelled) return;
        // Trash past its retention window gets purged for good, everything else kept.
        const expired = data.filter((l) => l.trashedAt && isTrashExpired(l.trashedAt));
        for (const l of expired) deleteRow("lessons", l.id).catch(() => {});
        const expiredIds = new Set(expired.map((l) => l.id));
        const keep = data.filter((l) => !expiredIds.has(l.id));
        // Merge rather than replace: a mutation (e.g. creating a lesson from a
        // template) can complete locally before this initial fetch resolves —
        // replacing state outright would wipe it back out.
        setAllLessons((prev) => {
          const knownIds = new Set(prev.map((l) => l.id));
          return [...prev, ...keep.filter((l) => !knownIds.has(l.id))];
        });
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load lesson plans — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const lessons = useMemo(() => allLessons.filter((l) => !l.trashedAt), [allLessons]);
  const trashedLessons = useMemo(() => allLessons.filter((l) => !!l.trashedAt), [allLessons]);

  const getLesson = useCallback((id: string) => allLessons.find((l) => l.id === id), [allLessons]);

  const saveLesson = useCallback(
    (lesson: LessonPlan) => {
      const updated = { ...lesson, updatedAt: new Date().toISOString() };
      let previous: LessonPlan[] = [];
      setAllLessons((prev) => {
        previous = prev;
        const exists = prev.some((l) => l.id === lesson.id);
        return exists ? prev.map((l) => (l.id === lesson.id ? updated : l)) : [updated, ...prev];
      });
      upsertRow("lessons", updated).catch(() => {
        setAllLessons(previous);
        showToast("Couldn't save the lesson — try again");
      });
    },
    [showToast]
  );

  const duplicateLesson = useCallback(
    (id: string) => {
      const original = allLessons.find((l) => l.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      const copy: LessonPlan = {
        ...original,
        id: makeId("lesson"),
        title: `${original.title} (Copy)`,
        status: "Draft",
        date: undefined,
        isSample: false,
        trashedAt: undefined,
        createdAt: now,
        updatedAt: now,
        revisions: [{ id: makeId("rev"), label: "Duplicated from existing lesson", timestamp: now }],
      };
      setAllLessons((prev) => [copy, ...prev]);
      upsertRow("lessons", copy).catch(() => {
        setAllLessons((prev) => prev.filter((l) => l.id !== copy.id));
        showToast("Couldn't duplicate the lesson — try again");
      });
      return copy;
    },
    [allLessons, showToast]
  );

  const archiveLesson = useCallback(
    (id: string) => {
      let previous: LessonPlan[] = [];
      let updated: LessonPlan | undefined;
      setAllLessons((prev) => {
        previous = prev;
        return prev.map((l) => {
          if (l.id !== id) return l;
          updated = { ...l, archived: true };
          return updated;
        });
      });
      if (updated) {
        upsertRow("lessons", updated).catch(() => {
          setAllLessons(previous);
          showToast("Couldn't archive the lesson — try again");
        });
      }
    },
    [showToast]
  );

  const archiveLessons = useCallback(
    (ids: string[]) => {
      const idSet = new Set(ids);
      let previous: LessonPlan[] = [];
      let updatedLessons: LessonPlan[] = [];
      setAllLessons((prev) => {
        previous = prev;
        const next = prev.map((l) => (idSet.has(l.id) ? { ...l, archived: true } : l));
        updatedLessons = next.filter((l) => idSet.has(l.id));
        return next;
      });
      Promise.all(updatedLessons.map((l) => upsertRow("lessons", l))).catch(() => {
        setAllLessons(previous);
        showToast("Couldn't archive those lessons — try again");
      });
    },
    [showToast]
  );

  const deleteLesson = useCallback(
    (id: string) => {
      let previous: LessonPlan[] = [];
      let updated: LessonPlan | undefined;
      setAllLessons((prev) => {
        previous = prev;
        return prev.map((l) => {
          if (l.id !== id) return l;
          updated = { ...l, trashedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (updated) {
        upsertRow("lessons", updated).catch(() => {
          setAllLessons(previous);
          showToast("Couldn't move the lesson to Trash — try again");
        });
      }
    },
    [showToast]
  );

  const restoreLesson = useCallback(
    (id: string) => {
      let previous: LessonPlan[] = [];
      let updated: LessonPlan | undefined;
      setAllLessons((prev) => {
        previous = prev;
        return prev.map((l) => {
          if (l.id !== id) return l;
          updated = { ...l, trashedAt: undefined };
          return updated;
        });
      });
      if (updated) {
        upsertRow("lessons", updated).catch(() => {
          setAllLessons(previous);
          showToast("Couldn't restore the lesson — try again");
        });
      }
    },
    [showToast]
  );

  const permanentlyDeleteLesson = useCallback(
    (id: string) => {
      let previous: LessonPlan[] = [];
      setAllLessons((prev) => {
        previous = prev;
        return prev.filter((l) => l.id !== id);
      });
      deleteRow("lessons", id).catch(() => {
        setAllLessons(previous);
        showToast("Couldn't permanently delete the lesson — try again");
      });
    },
    [showToast]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      let previous: LessonPlan[] = [];
      let updated: LessonPlan | undefined;
      setAllLessons((prev) => {
        previous = prev;
        return prev.map((l) => {
          if (l.id !== id) return l;
          updated = { ...l, favorite: !l.favorite };
          return updated;
        });
      });
      if (updated) {
        upsertRow("lessons", updated).catch(() => {
          setAllLessons(previous);
          showToast("Couldn't update favorites — try again");
        });
      }
    },
    [showToast]
  );

  const saveDraft = useCallback((draft: LessonPlan) => {
    try {
      window.localStorage.setItem(`${DRAFT_KEY_PREFIX}${draft.id}`, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, []);

  const getDraft = useCallback((id: string) => {
    try {
      const raw = window.localStorage.getItem(`${DRAFT_KEY_PREFIX}${id}`);
      return raw ? (JSON.parse(raw) as LessonPlan) : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const clearDraft = useCallback((id: string) => {
    try {
      window.localStorage.removeItem(`${DRAFT_KEY_PREFIX}${id}`);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      lessons,
      trashedLessons,
      loaded,
      getLesson,
      saveLesson,
      duplicateLesson,
      archiveLesson,
      archiveLessons,
      deleteLesson,
      restoreLesson,
      permanentlyDeleteLesson,
      toggleFavorite,
      saveDraft,
      getDraft,
      clearDraft,
    }),
    [
      lessons,
      trashedLessons,
      loaded,
      getLesson,
      saveLesson,
      duplicateLesson,
      archiveLesson,
      archiveLessons,
      deleteLesson,
      restoreLesson,
      permanentlyDeleteLesson,
      toggleFavorite,
      saveDraft,
      getDraft,
      clearDraft,
    ]
  );

  return <LessonPlansContext.Provider value={value}>{children}</LessonPlansContext.Provider>;
}
