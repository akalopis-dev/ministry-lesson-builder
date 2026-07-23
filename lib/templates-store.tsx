"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId } from "@/lib/types";
import type { LessonTemplate } from "@/lib/data/templates";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

interface TemplatesContextValue {
  customTemplates: LessonTemplate[];
  trashedTemplates: LessonTemplate[];
  loaded: boolean;
  addTemplate: (template: Omit<LessonTemplate, "id">) => LessonTemplate;
  deleteTemplate: (id: string) => void;
  restoreTemplate: (id: string) => void;
  permanentlyDeleteTemplate: (id: string) => void;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

export function useTemplates(): TemplatesContextValue {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error("useTemplates must be used within TemplatesProvider");
  return ctx;
}

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [allTemplates, setAllTemplates] = useState<LessonTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<LessonTemplate>("templates")
      .then((data) => {
        if (cancelled) return;
        const expired = data.filter((t) => t.trashedAt && isTrashExpired(t.trashedAt));
        for (const t of expired) deleteRow("templates", t.id).catch(() => {});
        const expiredIds = new Set(expired.map((t) => t.id));
        const keep = data.filter((t) => !expiredIds.has(t.id));
        setAllTemplates((prev) => {
          const knownIds = new Set(prev.map((t) => t.id));
          return [...prev, ...keep.filter((t) => !knownIds.has(t.id))];
        });
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load your saved templates — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const customTemplates = useMemo(() => allTemplates.filter((t) => !t.trashedAt), [allTemplates]);
  const trashedTemplates = useMemo(() => allTemplates.filter((t) => !!t.trashedAt), [allTemplates]);

  const addTemplate = useCallback(
    (template: Omit<LessonTemplate, "id">) => {
      const created: LessonTemplate = { ...template, id: makeId("template") };
      setAllTemplates((prev) => [created, ...prev]);
      upsertRow("templates", created).catch(() => {
        setAllTemplates((prev) => prev.filter((t) => t.id !== created.id));
        showToast("Couldn't save the template — try again");
      });
      return created;
    },
    [showToast]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      let previous: LessonTemplate[] = [];
      let updated: LessonTemplate | undefined;
      setAllTemplates((prev) => {
        previous = prev;
        return prev.map((t) => {
          if (t.id !== id) return t;
          updated = { ...t, trashedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (updated) {
        upsertRow("templates", updated).catch(() => {
          setAllTemplates(previous);
          showToast("Couldn't move the template to Trash — try again");
        });
      }
    },
    [showToast]
  );

  const restoreTemplate = useCallback(
    (id: string) => {
      let previous: LessonTemplate[] = [];
      let updated: LessonTemplate | undefined;
      setAllTemplates((prev) => {
        previous = prev;
        return prev.map((t) => {
          if (t.id !== id) return t;
          updated = { ...t, trashedAt: undefined };
          return updated;
        });
      });
      if (updated) {
        upsertRow("templates", updated).catch(() => {
          setAllTemplates(previous);
          showToast("Couldn't restore the template — try again");
        });
      }
    },
    [showToast]
  );

  const permanentlyDeleteTemplate = useCallback(
    (id: string) => {
      let previous: LessonTemplate[] = [];
      setAllTemplates((prev) => {
        previous = prev;
        return prev.filter((t) => t.id !== id);
      });
      deleteRow("templates", id).catch(() => {
        setAllTemplates(previous);
        showToast("Couldn't permanently delete the template — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      customTemplates,
      trashedTemplates,
      loaded,
      addTemplate,
      deleteTemplate,
      restoreTemplate,
      permanentlyDeleteTemplate,
    }),
    [customTemplates, trashedTemplates, loaded, addTemplate, deleteTemplate, restoreTemplate, permanentlyDeleteTemplate]
  );

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>;
}
