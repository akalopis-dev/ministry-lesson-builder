"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ACTIVITY_CATEGORIES,
  MINISTRIES,
  type Activity,
  type ActivityCategory,
  type Ministry,
  type SupplyLevel,
} from "@/lib/types";

const SUPPLY_LEVELS: SupplyLevel[] = ["No supplies", "Some supplies"];

function blank(): Omit<Activity, "id"> {
  return {
    title: "",
    category: "Icebreakers",
    ministries: [],
    duration: "",
    suppliesLevel: "No supplies",
    summary: "",
    source: "",
    adaptationNote: "",
    tags: [],
  };
}

export function ActivityFormDrawer({
  open,
  onClose,
  activity,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (activity: Omit<Activity, "id">, id?: string) => void;
}) {
  const [draft, setDraft] = useState<Omit<Activity, "id">>(activity ?? blank());
  const [tagsText, setTagsText] = useState((activity?.tags ?? []).join(", "));

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
    onSave({ ...draft, tags }, activity?.id);
    onClose();
  }

  const valid = draft.title.trim().length > 0 && draft.summary.trim().length > 0 && draft.ministries.length > 0;

  return (
    <Drawer open={open} onClose={onClose} title={activity ? "Edit activity" : "Add activity"}>
      <div className="space-y-5">
        <Field label="Activity title" required>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Party Circle" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ActivityCategory })}>
              {ACTIVITY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Supplies needed">
            <Select value={draft.suppliesLevel} onChange={(e) => setDraft({ ...draft, suppliesLevel: e.target.value as SupplyLevel })}>
              {SUPPLY_LEVELS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Ministries" required hint="Select every ministry this activity is appropriate for">
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

        <Field label="Duration" hint="e.g. 10–15 min">
          <Input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="10–15 min" />
        </Field>

        <Field label="How it works" required>
          <Textarea rows={3} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
        </Field>

        <Field label="Source" hint="Where this activity comes from">
          <Input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="e.g. Our parish, a book, a website" />
        </Field>

        <Field label="Adaptation note" hint="Optional — e.g. a note on adapting non-Orthodox content">
          <Textarea rows={2} value={draft.adaptationNote ?? ""} onChange={(e) => setDraft({ ...draft, adaptationNote: e.target.value })} />
        </Field>

        <Field label="Tags" hint="Optional, comma-separated">
          <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. Matthew 25, low-energy" />
        </Field>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!valid}>
            {activity ? "Save changes" : "Add activity"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
