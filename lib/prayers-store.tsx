"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Prayer } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

interface PrayersContextValue {
  prayers: Prayer[];
  trashedPrayers: Prayer[];
  loaded: boolean;
  getPrayer: (id: string) => Prayer | undefined;
  addPrayer: (prayer: Omit<Prayer, "id">) => Prayer;
  updatePrayer: (prayer: Prayer) => void;
  deletePrayer: (id: string) => void;
  restorePrayer: (id: string) => void;
  permanentlyDeletePrayer: (id: string) => void;
}

const PrayersContext = createContext<PrayersContextValue | null>(null);

export function usePrayers(): PrayersContextValue {
  const ctx = useContext(PrayersContext);
  if (!ctx) throw new Error("usePrayers must be used within PrayersProvider");
  return ctx;
}

export function PrayersProvider({ children }: { children: React.ReactNode }) {
  const [allPrayers, setAllPrayers] = useState<Prayer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Prayer>("prayers")
      .then((data) => {
        if (cancelled) return;
        const expired = data.filter((p) => p.trashedAt && isTrashExpired(p.trashedAt));
        for (const p of expired) deleteRow("prayers", p.id).catch(() => {});
        const expiredIds = new Set(expired.map((p) => p.id));
        const keep = data.filter((p) => !expiredIds.has(p.id));
        setAllPrayers((prev) => {
          const knownIds = new Set(prev.map((p) => p.id));
          return [...prev, ...keep.filter((p) => !knownIds.has(p.id))];
        });
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load the Prayer Library — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const prayers = useMemo(() => allPrayers.filter((p) => !p.trashedAt), [allPrayers]);
  const trashedPrayers = useMemo(() => allPrayers.filter((p) => !!p.trashedAt), [allPrayers]);

  const getPrayer = useCallback((id: string) => allPrayers.find((p) => p.id === id), [allPrayers]);

  const addPrayer = useCallback(
    (prayer: Omit<Prayer, "id">) => {
      const created: Prayer = { ...prayer, id: makeId("prayer") };
      setAllPrayers((prev) => [created, ...prev]);
      upsertRow("prayers", created).catch(() => {
        setAllPrayers((prev) => prev.filter((p) => p.id !== created.id));
        showToast("Couldn't save the prayer — try again");
      });
      return created;
    },
    [showToast]
  );

  const updatePrayer = useCallback(
    (prayer: Prayer) => {
      let previous: Prayer[] = [];
      setAllPrayers((prev) => {
        previous = prev;
        return prev.map((p) => (p.id === prayer.id ? prayer : p));
      });
      upsertRow("prayers", prayer).catch(() => {
        setAllPrayers(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deletePrayer = useCallback(
    (id: string) => {
      let previous: Prayer[] = [];
      let updated: Prayer | undefined;
      setAllPrayers((prev) => {
        previous = prev;
        return prev.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, trashedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (updated) {
        upsertRow("prayers", updated).catch(() => {
          setAllPrayers(previous);
          showToast("Couldn't move the prayer to Trash — try again");
        });
      }
    },
    [showToast]
  );

  const restorePrayer = useCallback(
    (id: string) => {
      let previous: Prayer[] = [];
      let updated: Prayer | undefined;
      setAllPrayers((prev) => {
        previous = prev;
        return prev.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, trashedAt: undefined };
          return updated;
        });
      });
      if (updated) {
        upsertRow("prayers", updated).catch(() => {
          setAllPrayers(previous);
          showToast("Couldn't restore the prayer — try again");
        });
      }
    },
    [showToast]
  );

  const permanentlyDeletePrayer = useCallback(
    (id: string) => {
      let previous: Prayer[] = [];
      setAllPrayers((prev) => {
        previous = prev;
        return prev.filter((p) => p.id !== id);
      });
      deleteRow("prayers", id).catch(() => {
        setAllPrayers(previous);
        showToast("Couldn't permanently delete the prayer — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      prayers,
      trashedPrayers,
      loaded,
      getPrayer,
      addPrayer,
      updatePrayer,
      deletePrayer,
      restorePrayer,
      permanentlyDeletePrayer,
    }),
    [
      prayers,
      trashedPrayers,
      loaded,
      getPrayer,
      addPrayer,
      updatePrayer,
      deletePrayer,
      restorePrayer,
      permanentlyDeletePrayer,
    ]
  );

  return <PrayersContext.Provider value={value}>{children}</PrayersContext.Provider>;
}
