"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Activity } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { isTrashExpired } from "@/lib/trash";

interface ActivitiesContextValue {
  activities: Activity[];
  trashedActivities: Activity[];
  loaded: boolean;
  getActivity: (id: string) => Activity | undefined;
  addActivity: (activity: Omit<Activity, "id">) => Activity;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  restoreActivity: (id: string) => void;
  permanentlyDeleteActivity: (id: string) => void;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

export function useActivities(): ActivitiesContextValue {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error("useActivities must be used within ActivitiesProvider");
  return ctx;
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Activity>("activities")
      .then((data) => {
        if (cancelled) return;
        const expired = data.filter((a) => a.trashedAt && isTrashExpired(a.trashedAt));
        for (const a of expired) deleteRow("activities", a.id).catch(() => {});
        const expiredIds = new Set(expired.map((a) => a.id));
        const keep = data.filter((a) => !expiredIds.has(a.id));
        // Merge rather than replace: a mutation can complete locally before this
        // initial fetch resolves — replacing state outright would wipe it back out.
        setAllActivities((prev) => {
          const knownIds = new Set(prev.map((a) => a.id));
          return [...prev, ...keep.filter((a) => !knownIds.has(a.id))];
        });
      })
      .catch(() => {
        if (!cancelled) showToast("Couldn't load activities — check your connection");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const activities = useMemo(() => allActivities.filter((a) => !a.trashedAt), [allActivities]);
  const trashedActivities = useMemo(() => allActivities.filter((a) => !!a.trashedAt), [allActivities]);

  const getActivity = useCallback((id: string) => allActivities.find((a) => a.id === id), [allActivities]);

  const addActivity = useCallback(
    (activity: Omit<Activity, "id">) => {
      const created: Activity = { ...activity, id: makeId("activity") };
      setAllActivities((prev) => [created, ...prev]);
      upsertRow("activities", created).catch(() => {
        setAllActivities((prev) => prev.filter((a) => a.id !== created.id));
        showToast("Couldn't save the activity — try again");
      });
      return created;
    },
    [showToast]
  );

  const updateActivity = useCallback(
    (activity: Activity) => {
      let previous: Activity[] = [];
      setAllActivities((prev) => {
        previous = prev;
        return prev.map((a) => (a.id === activity.id ? activity : a));
      });
      upsertRow("activities", activity).catch(() => {
        setAllActivities(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deleteActivity = useCallback(
    (id: string) => {
      let previous: Activity[] = [];
      let updated: Activity | undefined;
      setAllActivities((prev) => {
        previous = prev;
        return prev.map((a) => {
          if (a.id !== id) return a;
          updated = { ...a, trashedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (updated) {
        upsertRow("activities", updated).catch(() => {
          setAllActivities(previous);
          showToast("Couldn't move the activity to Trash — try again");
        });
      }
    },
    [showToast]
  );

  const restoreActivity = useCallback(
    (id: string) => {
      let previous: Activity[] = [];
      let updated: Activity | undefined;
      setAllActivities((prev) => {
        previous = prev;
        return prev.map((a) => {
          if (a.id !== id) return a;
          updated = { ...a, trashedAt: undefined };
          return updated;
        });
      });
      if (updated) {
        upsertRow("activities", updated).catch(() => {
          setAllActivities(previous);
          showToast("Couldn't restore the activity — try again");
        });
      }
    },
    [showToast]
  );

  const permanentlyDeleteActivity = useCallback(
    (id: string) => {
      let previous: Activity[] = [];
      setAllActivities((prev) => {
        previous = prev;
        return prev.filter((a) => a.id !== id);
      });
      deleteRow("activities", id).catch(() => {
        setAllActivities(previous);
        showToast("Couldn't permanently delete the activity — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      activities,
      trashedActivities,
      loaded,
      getActivity,
      addActivity,
      updateActivity,
      deleteActivity,
      restoreActivity,
      permanentlyDeleteActivity,
    }),
    [
      activities,
      trashedActivities,
      loaded,
      getActivity,
      addActivity,
      updateActivity,
      deleteActivity,
      restoreActivity,
      permanentlyDeleteActivity,
    ]
  );

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}
