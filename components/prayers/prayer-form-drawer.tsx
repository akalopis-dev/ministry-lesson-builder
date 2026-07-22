"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRAYER_CATEGORIES, MINISTRIES, type Prayer, type PrayerCategory, type Ministry } from "@/lib/types";

function blank(): Omit<Prayer, "id"> {
  return {
    title: "",
    category: "Opening prayer",
    ministries: [],
    text: "",
    source: "",
    tags: [],
  };
}

export function PrayerFormDrawer({
  open,
  onClose,
  prayer,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  prayer: Prayer | null;
  onSave: (prayer: Omit<Prayer, "id">, id?: string) => void;
}) {
  const [draft, setDraft] = useState<Omit<Prayer, "id">>(prayer ?? blank());
  const [tagsText, setTagsText] = useState((prayer?.tags ?? []).join(", "));

  function toggleMinistry(m: Ministry) {
    setDraft((prev) => ({
      ...prev,
      ministries: prev.ministries.includes(m) ? prev.ministries.filter((x) => x !== m) : [...prev.ministries, m],
    }));
  }

  function handleSave() {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...draft, tags }, prayer?.id);
    onClose();
  }

  const valid = draft.title.trim().length > 0 && draft.text.trim().length > 0 && draft.ministries.length > 0;

  return (
    <Drawer open={open} onClose={onClose} title={prayer ? "Edit prayer" : "Add prayer"}>
      <div className="space-y-5">
        <Field label="Title" required>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Trisagion Prayers" />
        </Field>

        <Field label="Category">
          <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as PrayerCategory })}>
            {PRAYER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Ministries" required hint="Select every ministry this prayer is appropriate for">
          <div className="flex flex-wrap gap-2">
            {MINISTRIES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMinistry(m)}
                className={
                  draft.ministries.includes(m)
                    ? "rounded-sm border border-navy bg-navy px-2.5 py-1 text-xs font-medium text-paper"
                    : "rounded-sm border border-border-strong bg-paper px-2.5 py-1 text-xs font-medium text-charcoal-soft hover:bg-surface"
                }
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Prayer text" required>
          <Textarea rows={5} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
        </Field>

        <Field label="Source" hint="Optional — attribution or where it's from">
          <Input value={draft.source ?? ""} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="e.g. Divine Liturgy" />
        </Field>

        <Field label="Tags" hint="Optional, comma-separated">
          <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. traditional, short" />
        </Field>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!valid}>
            {prayer ? "Save changes" : "Add prayer"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
