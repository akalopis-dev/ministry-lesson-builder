"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Prayer } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface PrayersContextValue {
  prayers: Prayer[];
  loaded: boolean;
  getPrayer: (id: string) => Prayer | undefined;
  addPrayer: (prayer: Omit<Prayer, "id">) => Prayer;
  updatePrayer: (prayer: Prayer) => void;
  deletePrayer: (id: string) => void;
}

const PrayersContext = createContext<PrayersContextValue | null>(null);

export function usePrayers(): PrayersContextValue {
  const ctx = useContext(PrayersContext);
  if (!ctx) throw new Error("usePrayers must be used within PrayersProvider");
  return ctx;
}

export function PrayersProvider({ children }: { children: React.ReactNode }) {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Prayer>("prayers")
      .then((data) => {
        if (!cancelled) {
          setPrayers((prev) => {
            const knownIds = new Set(prev.map((p) => p.id));
            return [...prev, ...data.filter((p) => !knownIds.has(p.id))];
          });
        }
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

  const getPrayer = useCallback((id: string) => prayers.find((p) => p.id === id), [prayers]);

  const addPrayer = useCallback(
    (prayer: Omit<Prayer, "id">) => {
      const created: Prayer = { ...prayer, id: makeId("prayer") };
      setPrayers((prev) => [created, ...prev]);
      upsertRow("prayers", created).catch(() => {
        setPrayers((prev) => prev.filter((p) => p.id !== created.id));
        showToast("Couldn't save the prayer — try again");
      });
      return created;
    },
    [showToast]
  );

  const updatePrayer = useCallback(
    (prayer: Prayer) => {
      let previous: Prayer[] = [];
      setPrayers((prev) => {
        previous = prev;
        return prev.map((p) => (p.id === prayer.id ? prayer : p));
      });
      upsertRow("prayers", prayer).catch(() => {
        setPrayers(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deletePrayer = useCallback(
    (id: string) => {
      let previous: Prayer[] = [];
      setPrayers((prev) => {
        previous = prev;
        return prev.filter((p) => p.id !== id);
      });
      deleteRow("prayers", id).catch(() => {
        setPrayers(previous);
        showToast("Couldn't delete — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ prayers, loaded, getPrayer, addPrayer, updatePrayer, deletePrayer }),
    [prayers, loaded, getPrayer, addPrayer, updatePrayer, deletePrayer]
  );

  return <PrayersContext.Provider value={value}>{children}</PrayersContext.Provider>;
}
