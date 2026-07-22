"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeId, type Activity } from "@/lib/types";
import { fetchTable, upsertRow, deleteRow } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface ActivitiesContextValue {
  activities: Activity[];
  loaded: boolean;
  getActivity: (id: string) => Activity | undefined;
  addActivity: (activity: Omit<Activity, "id">) => Activity;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

export function useActivities(): ActivitiesContextValue {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error("useActivities must be used within ActivitiesProvider");
  return ctx;
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchTable<Activity>("activities")
      .then((data) => {
        // Merge rather than replace: a mutation can complete locally before this
        // initial fetch resolves — replacing state outright would wipe it back out.
        if (!cancelled) {
          setActivities((prev) => {
            const knownIds = new Set(prev.map((a) => a.id));
            return [...prev, ...data.filter((a) => !knownIds.has(a.id))];
          });
        }
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

  const getActivity = useCallback((id: string) => activities.find((a) => a.id === id), [activities]);

  const addActivity = useCallback(
    (activity: Omit<Activity, "id">) => {
      const created: Activity = { ...activity, id: makeId("activity") };
      setActivities((prev) => [created, ...prev]);
      upsertRow("activities", created).catch(() => {
        setActivities((prev) => prev.filter((a) => a.id !== created.id));
        showToast("Couldn't save the activity — try again");
      });
      return created;
    },
    [showToast]
  );

  const updateActivity = useCallback(
    (activity: Activity) => {
      let previous: Activity[] = [];
      setActivities((prev) => {
        previous = prev;
        return prev.map((a) => (a.id === activity.id ? activity : a));
      });
      upsertRow("activities", activity).catch(() => {
        setActivities(previous);
        showToast("Couldn't save changes — try again");
      });
    },
    [showToast]
  );

  const deleteActivity = useCallback(
    (id: string) => {
      let previous: Activity[] = [];
      setActivities((prev) => {
        previous = prev;
        return prev.filter((a) => a.id !== id);
      });
      deleteRow("activities", id).catch(() => {
        setActivities(previous);
        showToast("Couldn't delete — try again");
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ activities, loaded, getActivity, addActivity, updateActivity, deleteActivity }),
    [activities, loaded, getActivity, addActivity, updateActivity, deleteActivity]
  );

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}
