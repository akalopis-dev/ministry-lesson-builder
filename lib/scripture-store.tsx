"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type ScripturePassage } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

interface ScriptureContextValue {
  passages: ScripturePassage[];
  trashedPassages: ScripturePassage[];
  loaded: boolean;
  getPassage: (id: string) => ScripturePassage | undefined;
  addPassage: (passage: Omit<ScripturePassage, "id">) => ScripturePassage;
  updatePassage: (passage: ScripturePassage) => void;
  deletePassage: (id: string) => void;
  restorePassage: (id: string) => void;
  permanentlyDeletePassage: (id: string) => void;
}

const ScriptureContext = createContext<ScriptureContextValue | null>(null);

export function useScripture(): ScriptureContextValue {
  const ctx = useContext(ScriptureContext);
  if (!ctx) throw new Error("useScripture must be used within ScriptureProvider");
  return ctx;
}

export function ScriptureProvider({ children }: { children: React.ReactNode }) {
  const [allPassages, setAllPassages] = useState<ScripturePassage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<ScripturePassage>("scripture")
      .then((data) => {
        if (cancelled) return;
        const expired = data.filter((p) => p.trashedAt && isTrashExpired(p.trashedAt));
        for (const p of expired) deleteRow("scripture", p.id).catch(() => {});
        const expiredIds = new Set(expired.map((p) => p.id));
        const keep = data.filter((p) => !expiredIds.has(p.id));
        setAllPassages((prev) => {
          const knownIds = new Set(prev.map((p) => p.id));
          return [...prev, ...keep.filter((p) => !knownIds.has(p.id))];
        });
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

  const passages = useMemo(() => allPassages.filter((p) => !p.trashedAt), [allPassages]);
  const trashedPassages = useMemo(() => allPassages.filter((p) => !!p.trashedAt), [allPassages]);

  const getPassage = useCallback((id: string) => allPassages.find((p) => p.id === id), [allPassages]);

  const addPassage = useCallback(
    (passage: Omit<ScripturePassage, "id">) => {
      const created: ScripturePassage = { ...passage, id: makeId("scripture") };
      setAllPassages((prev) => [created, ...prev]);
      upsertRow("scripture", created).catch(() => {
        setAllPassages((prev) => prev.filter((p) => p.id !== created.id));
        showToast("Couldn't save the passage — try again");
      });
      return created;
    },
    [showToast]
  );

  const updatePassage = useCallback(
    (passage: ScripturePassage) => {
      let previous: ScripturePassage[] = [];
      setAllPassages((prev) => {
        previous = prev;
        return prev.map((p) => (p.id === passage.id ? passage : p));
      });
      upsertRow("scripture", passage).catch(() => {
        setAllPassages(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deletePassage = useCallback(
    (id: string) => {
      let previous: ScripturePassage[] = [];
      let updated: ScripturePassage | undefined;
      setAllPassages((prev) => {
        previous = prev;
        return prev.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, trashedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (updated) {
        upsertRow("scripture", updated).catch(() => {
          setAllPassages(previous);
          showToast("Couldn't move the passage to Trash — try again");
        });
      }
    },
    [showToast]
  );

  const restorePassage = useCallback(
    (id: string) => {
      let previous: ScripturePassage[] = [];
      let updated: ScripturePassage | undefined;
      setAllPassages((prev) => {
        previous = prev;
        return prev.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, trashedAt: undefined };
          return updated;
        });
      });
      if (updated) {
        upsertRow("scripture", updated).catch(() => {
          setAllPassages(previous);
          showToast("Couldn't restore the passage — try again");
        });
      }
    },
    [showToast]
  );

  const permanentlyDeletePassage = useCallback(
    (id: string) => {
      let previous: ScripturePassage[] = [];
      setAllPassages((prev) => {
        previous = prev;
        return prev.filter((p) => p.id !== id);
      });
      deleteRow("scripture", id).catch(() => {
        setAllPassages(previous);
        showToast("Couldn't permanently delete the passage — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      passages,
      trashedPassages,
      loaded,
      getPassage,
      addPassage,
      updatePassage,
      deletePassage,
      restorePassage,
      permanentlyDeletePassage,
    }),
    [
      passages,
      trashedPassages,
      loaded,
      getPassage,
      addPassage,
      updatePassage,
      deletePassage,
      restorePassage,
      permanentlyDeletePassage,
    ]
  );

  return <ScriptureContext.Provider value={value}>{children}</ScriptureContext.Provider>;
}
