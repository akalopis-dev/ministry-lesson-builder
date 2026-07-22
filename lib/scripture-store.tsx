"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type ScripturePassage } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface ScriptureContextValue {
  passages: ScripturePassage[];
  loaded: boolean;
  getPassage: (id: string) => ScripturePassage | undefined;
  addPassage: (passage: Omit<ScripturePassage, "id">) => ScripturePassage;
  updatePassage: (passage: ScripturePassage) => void;
  deletePassage: (id: string) => void;
}

const ScriptureContext = createContext<ScriptureContextValue | null>(null);

export function useScripture(): ScriptureContextValue {
  const ctx = useContext(ScriptureContext);
  if (!ctx) throw new Error("useScripture must be used within ScriptureProvider");
  return ctx;
}

export function ScriptureProvider({ children }: { children: React.ReactNode }) {
  const [passages, setPassages] = useState<ScripturePassage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<ScripturePassage>("scripture")
      .then((data) => {
        if (!cancelled) {
          setPassages((prev) => {
            const knownIds = new Set(prev.map((p) => p.id));
            return [...prev, ...data.filter((p) => !knownIds.has(p.id))];
          });
        }
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load the Scripture Library — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const getPassage = useCallback((id: string) => passages.find((p) => p.id === id), [passages]);

  const addPassage = useCallback(
    (passage: Omit<ScripturePassage, "id">) => {
      const created: ScripturePassage = { ...passage, id: makeId("scripture") };
      setPassages((prev) => [created, ...prev]);
      upsertRow("scripture", created).catch(() => {
        setPassages((prev) => prev.filter((p) => p.id !== created.id));
        showToast("Couldn't save the passage — try again");
      });
      return created;
    },
    [showToast]
  );

  const updatePassage = useCallback(
    (passage: ScripturePassage) => {
      let previous: ScripturePassage[] = [];
      setPassages((prev) => {
        previous = prev;
        return prev.map((p) => (p.id === passage.id ? passage : p));
      });
      upsertRow("scripture", passage).catch(() => {
        setPassages(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deletePassage = useCallback(
    (id: string) => {
      let previous: ScripturePassage[] = [];
      setPassages((prev) => {
        previous = prev;
        return prev.filter((p) => p.id !== id);
      });
      deleteRow("scripture", id).catch(() => {
        setPassages(previous);
        showToast("Couldn't delete — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ passages, loaded, getPassage, addPassage, updatePassage, deletePassage }),
    [passages, loaded, getPassage, addPassage, updatePassage, deletePassage]
  );

  return <ScriptureContext.Provider value={value}>{children}</ScriptureContext.Provider>;
}
