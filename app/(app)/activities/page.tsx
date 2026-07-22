"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Blocks, Search, LayoutTemplate, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { ACTIVITY_CATEGORIES, MINISTRIES, type Activity, type ActivityCategory, type Ministry } from "@/lib/types";
import { Chip, Tag, ActivityCategoryTag, MinistryTag } from "@/components/ui/badge";
import { ACCENT_DOT_CLASSES, ACTIVITY_CATEGORY_ACCENTS } from "@/lib/category-colors";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { ActivityFormDrawer } from "@/components/activities/activity-form-drawer";
import { AddToCollectionMenu } from "@/components/collections/add-to-collection-menu";
import { useToast } from "@/components/ui/toast";

export default function ActivitiesPage() {
  const router = useRouter();
  const showToast = useToast();
  const { activities, loaded, addActivity, updateActivity, deleteActivity } = useActivities();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ActivityCategory | null>(null);
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [noSupplyOnly, setNoSupplyOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [formNonce, setFormNonce] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities
      .filter((a) => {
        if (category && a.category !== category) return false;
        if (ministry && !a.ministries.includes(ministry)) return false;
        if (noSupplyOnly && a.suppliesLevel !== "No supplies") return false;
        if (favoritesOnly && !a.favorite) return false;
        if (!q) return true;
        return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
      })
      .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
  }, [activities, query, category, ministry, noSupplyOnly, favoritesOnly]);

  function toggleFavorite(activity: Activity) {
    updateActivity({ ...activity, favorite: !activity.favorite });
  }

  function openAdd() {
    setEditing(null);
    setFormNonce((n) => n + 1);
    setFormOpen(true);
  }

  function openEdit(activity: Activity) {
    setEditing(activity);
    setFormNonce((n) => n + 1);
    setFormOpen(true);
  }

  function handleSave(fields: Omit<Activity, "id">, id?: string) {
    if (id) {
      updateActivity({ ...fields, id });
      showToast(`Updated "${fields.title}"`);
    } else {
      addActivity(fields);
      showToast(`Added "${fields.title}" to the library`);
    }
  }

  function handleDelete(activity: Activity) {
    if (window.confirm(`Remove "${activity.title}" from the Activity Library?`)) {
      deleteActivity(activity.id);
      showToast("Activity removed");
    }
  }

  if (!loaded) return <LoadingState label="Loading the activity library…" />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
            <Blocks size={17} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-navy">Activity Library</h1>
            <p className="text-sm text-charcoal-soft">Icebreakers, team-building, active games, and faith-teaching games.</p>
          </div>
        </div>
        <Button onClick={openAdd}>
          <Plus size={15} /> Add activity
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-gold/25 bg-gold-soft/60 px-5 py-4 shadow-soft">
        <div className="flex items-center gap-3">
          <LayoutTemplate size={18} className="text-gold" />
          <div>
            <p className="text-sm font-semibold text-navy">Sample session timeline (~75 minutes)</p>
            <p className="text-xs text-charcoal-soft">Arrival, opening prayer, icebreaker, lesson, active game, snack, closing — from Y2AM&rsquo;s own Ministry Plan structure.</p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => router.push("/templates")}>
          View template
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full rounded-md border border-border-strong bg-paper py-2 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
        <Chip active={noSupplyOnly} onClick={() => setNoSupplyOnly((v) => !v)}>
          No supplies needed
        </Chip>
        <Chip active={favoritesOnly} onClick={() => setFavoritesOnly((v) => !v)}>
          <Star size={12} className={favoritesOnly ? "mr-1 fill-current" : "mr-1"} />
          Favorites
        </Chip>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-soft">Ministry</span>
        <Chip active={ministry === null} onClick={() => setMinistry(null)}>
          All
        </Chip>
        {MINISTRIES.map((m) => (
          <Chip key={m} active={ministry === m} onClick={() => setMinistry(m === ministry ? null : m)}>
            {m}
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-soft">Category</span>
        <Chip active={category === null} onClick={() => setCategory(null)}>
          All
        </Chip>
        {ACTIVITY_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c === category ? null : c)}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${ACCENT_DOT_CLASSES[ACTIVITY_CATEGORY_ACCENTS[c]]}`} />
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title={activities.length === 0 ? "No activities yet" : "No activities match these filters"}
            description={
              activities.length === 0
                ? "Add your first icebreaker, game, or faith activity to build up your library."
                : "Remove a filter or adjust your search to see more activities."
            }
            action={
              activities.length === 0 ? (
                <Button onClick={openAdd}>
                  <Plus size={15} /> Add activity
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((a) => (
              <div key={a.id} className="flex flex-col rounded-md border border-border bg-paper p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm font-semibold text-navy">{a.title}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(a)}
                      className={`rounded p-1 hover:bg-gold-soft ${a.favorite ? "text-gold" : "text-charcoal-soft hover:text-gold"}`}
                      title={a.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={13} className={a.favorite ? "fill-current" : ""} />
                    </button>
                    <AddToCollectionMenu itemId={a.id} itemType="activity" className="rounded p-1 text-charcoal-soft hover:bg-surface hover:text-navy" />
                    <button onClick={() => openEdit(a)} className="rounded p-1 text-charcoal-soft hover:bg-surface hover:text-navy" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(a)} className="rounded p-1 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-charcoal-soft">
                  <ActivityCategoryTag category={a.category} />
                  {a.duration && <Tag>{a.duration}</Tag>}
                  <Tag>{a.suppliesLevel}</Tag>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {a.ministries.map((m) => (
                    <MinistryTag key={m} ministry={m} />
                  ))}
                </div>
                <p className="mt-2.5 text-sm text-charcoal">{a.summary}</p>
                {a.adaptationNote && (
                  <p className="mt-2 rounded-sm bg-burgundy-soft px-2.5 py-1.5 text-xs text-burgundy">
                    {a.adaptationNote}
                  </p>
                )}
                {a.tags && a.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
                {a.source && <p className="mt-3 text-xs text-charcoal-soft/70">Source: {a.source}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 rounded-md border border-border bg-surface/40 px-5 py-4 text-xs text-charcoal-soft">
        <p className="font-medium text-charcoal">Notes</p>
        <p className="mt-1.5">
          Times listed are ranges — actual duration varies with group size. Games sourced from Young Catholics are
          Catholic-parish oriented; swap sacrament names, saint references, and prayers for Orthodox equivalents where a game ties directly to a sacrament or doctrine.
        </p>
      </div>

      <ActivityFormDrawer key={formNonce} open={formOpen} onClose={() => setFormOpen(false)} activity={editing} onSave={handleSave} />
    </div>
  );
}
