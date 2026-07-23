"use client";

import { useMemo, useState } from "react";
import { HandHelping, Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import { usePrayers } from "@/lib/prayers-store";
import { PRAYER_CATEGORIES, MINISTRIES, type Prayer, type PrayerCategory, type Ministry } from "@/lib/types";
import { Chip, Tag, PrayerCategoryTag, MinistryTag } from "@/components/ui/badge";
import { ACCENT_DOT_CLASSES, PRAYER_CATEGORY_ACCENTS } from "@/lib/category-colors";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { PrayerFormDrawer } from "@/components/prayers/prayer-form-drawer";
import { useToast } from "@/components/ui/toast";

export default function PrayersPage() {
  const showToast = useToast();
  const { prayers, loaded, addPrayer, updatePrayer, deletePrayer } = usePrayers();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PrayerCategory | null>(null);
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Prayer | null>(null);
  const [formNonce, setFormNonce] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prayers
      .filter((p) => {
        if (category && p.category !== category) return false;
        if (ministry && !p.ministries.includes(ministry)) return false;
        if (favoritesOnly && !p.favorite) return false;
        if (!q) return true;
        return p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q);
      })
      .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
  }, [prayers, query, category, ministry, favoritesOnly]);

  function toggleFavorite(prayer: Prayer) {
    updatePrayer({ ...prayer, favorite: !prayer.favorite });
  }

  function openAdd() {
    setEditing(null);
    setFormNonce((n) => n + 1);
    setFormOpen(true);
  }

  function openEdit(prayer: Prayer) {
    setEditing(prayer);
    setFormNonce((n) => n + 1);
    setFormOpen(true);
  }

  function handleSave(fields: Omit<Prayer, "id">, id?: string) {
    if (id) {
      updatePrayer({ ...fields, id });
      showToast(`Updated "${fields.title}"`);
    } else {
      addPrayer(fields);
      showToast(`Added "${fields.title}" to the library`);
    }
  }

  function handleDelete(prayer: Prayer) {
    if (window.confirm(`Move "${prayer.title}" to Trash? You can restore it from Trash for 30 days.`)) {
      deletePrayer(prayer.id);
      showToast("Moved to Trash");
    }
  }

  if (!loaded) return <LoadingState label="Loading the Prayer Library…" />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
            <HandHelping size={17} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-navy">Prayer Library</h1>
            <p className="text-sm text-charcoal-soft">Opening, closing, and seasonal prayers organized by ministry and context.</p>
          </div>
        </div>
        <Button onClick={openAdd}>
          <Plus size={15} /> Add prayer
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prayers..."
            className="w-full rounded-md border border-border-strong bg-paper py-2 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
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
        {PRAYER_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c === category ? null : c)}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${ACCENT_DOT_CLASSES[PRAYER_CATEGORY_ACCENTS[c]]}`} />
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title={prayers.length === 0 ? "No prayers yet" : "No prayers match these filters"}
            description={
              prayers.length === 0
                ? "Add your first opening, closing, or seasonal prayer to build up your library."
                : "Remove a filter or adjust your search to see more prayers."
            }
            action={
              prayers.length === 0 ? (
                <Button onClick={openAdd}>
                  <Plus size={15} /> Add prayer
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex flex-col rounded-md border border-border bg-paper p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm font-semibold text-navy">{p.title}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(p)}
                      className={`rounded p-1 hover:bg-gold-soft ${p.favorite ? "text-gold" : "text-charcoal-soft hover:text-gold"}`}
                      title={p.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={13} className={p.favorite ? "fill-current" : ""} />
                    </button>
                    <button onClick={() => openEdit(p)} className="rounded p-1 text-charcoal-soft hover:bg-surface hover:text-navy" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(p)} className="rounded p-1 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-charcoal-soft">
                  <PrayerCategoryTag category={p.category} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.ministries.map((m) => (
                    <MinistryTag key={m} ministry={m} />
                  ))}
                </div>
                <p className="mt-2.5 line-clamp-4 whitespace-pre-line text-sm text-charcoal">{p.text}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
                {p.source && <p className="mt-3 text-xs text-charcoal-soft/70">Source: {p.source}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <PrayerFormDrawer key={formNonce} open={formOpen} onClose={() => setFormOpen(false)} prayer={editing} onSave={handleSave} />
    </div>
  );
}
