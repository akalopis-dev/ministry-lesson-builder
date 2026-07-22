"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SCRIPTURE_CATEGORIES, MINISTRIES, type ScripturePassage, type ScriptureCategory, type Ministry } from "@/lib/types";

function blank(): Omit<ScripturePassage, "id"> {
  return {
    reference: "",
    title: "",
    category: "Gospel reading",
    ministries: [],
    text: "",
    connection: "",
    source: "",
    tags: [],
  };
}

export function ScriptureFormDrawer({
  open,
  onClose,
  passage,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  passage: ScripturePassage | null;
  onSave: (passage: Omit<ScripturePassage, "id">, id?: string) => void;
}) {
  const [draft, setDraft] = useState<Omit<ScripturePassage, "id">>(passage ?? blank());
  const [tagsText, setTagsText] = useState((passage?.tags ?? []).join(", "));

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
    onSave({ ...draft, tags }, passage?.id);
    onClose();
  }

  const valid = draft.reference.trim().length > 0 && draft.title.trim().length > 0 && draft.ministries.length > 0;

  return (
    <Drawer open={open} onClose={onClose} title={passage ? "Edit passage" : "Add passage"}>
      <div className="space-y-5">
        <Field label="Reference" required>
          <Input value={draft.reference} onChange={(e) => setDraft({ ...draft, reference: e.target.value })} placeholder="e.g. Luke 15:11-32" />
        </Field>

        <Field label="Title" required>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. The Prodigal Son" />
        </Field>

        <Field label="Category">
          <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ScriptureCategory })}>
            {SCRIPTURE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Ministries" required hint="Select every ministry this passage is appropriate for">
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

        <Field label="Passage text" hint="The excerpt or full text you'll read from">
          <Textarea rows={4} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
        </Field>

        <Field label="Teaching connection" hint="Why this passage, and how it ties into the lesson">
          <Textarea rows={3} value={draft.connection} onChange={(e) => setDraft({ ...draft, connection: e.target.value })} />
        </Field>

        <Field label="Source" hint="Translation or citation, e.g. Orthodox Study Bible">
          <Input value={draft.source ?? ""} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="e.g. Orthodox Study Bible" />
        </Field>

        <Field label="Tags" hint="Optional, comma-separated">
          <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. forgiveness, parables" />
        </Field>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!valid}>
            {passage ? "Save changes" : "Add passage"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
