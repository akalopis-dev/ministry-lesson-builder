"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId } from "@/lib/types";
import type { LessonTemplate } from "@/lib/data/templates";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface TemplatesContextValue {
  customTemplates: LessonTemplate[];
  loaded: boolean;
  addTemplate: (template: Omit<LessonTemplate, "id">) => LessonTemplate;
  deleteTemplate: (id: string) => void;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

export function useTemplates(): TemplatesContextValue {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error("useTemplates must be used within TemplatesProvider");
  return ctx;
}

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [customTemplates, setCustomTemplates] = useState<LessonTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<LessonTemplate>("templates")
      .then((data) => {
        if (!cancelled) {
          setCustomTemplates((prev) => {
            const knownIds = new Set(prev.map((t) => t.id));
            return [...prev, ...data.filter((t) => !knownIds.has(t.id))];
          });
        }
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

  const addTemplate = useCallback(
    (template: Omit<LessonTemplate, "id">) => {
      const created: LessonTemplate = { ...template, id: makeId("template") };
      setCustomTemplates((prev) => [created, ...prev]);
      upsertRow("templates", created).catch(() => {
        setCustomTemplates((prev) => prev.filter((t) => t.id !== created.id));
        showToast("Couldn't save the template — try again");
      });
      return created;
    },
    [showToast]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      let previous: LessonTemplate[] = [];
      setCustomTemplates((prev) => {
        previous = prev;
        return prev.filter((t) => t.id !== id);
      });
      deleteRow("templates", id).catch(() => {
        setCustomTemplates(previous);
        showToast("Couldn't delete the template — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ customTemplates, loaded, addTemplate, deleteTemplate }),
    [customTemplates, loaded, addTemplate, deleteTemplate]
  );

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>;
}
