"use client";

import { useState } from "react";
import type { LessonBlock, BlockType, GroupFormat } from "@/lib/types";
import { BLOCK_TYPES } from "@/lib/types";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GROUP_FORMATS: GroupFormat[] = ["Whole group", "Small groups", "Pairs", "Individual"];

export function BlockEditorDrawer({
  block,
  open,
  onClose,
  onSave,
}: {
  block: LessonBlock | null;
  open: boolean;
  onClose: () => void;
  onSave: (block: LessonBlock) => void;
}) {
  const [draft, setDraft] = useState<LessonBlock | null>(block);

  if (!draft) return null;

  function patch(p: Partial<LessonBlock>) {
    setDraft((prev) => (prev ? { ...prev, ...p } : prev));
  }

  return (
    <Drawer open={open} onClose={onClose} title="Edit lesson block">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Block type">
            <Select value={draft.type} onChange={(e) => patch({ type: e.target.value as BlockType })}>
              {BLOCK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Duration (minutes)">
            <Input type="number" min={1} value={draft.durationMinutes} onChange={(e) => patch({ durationMinutes: Number(e.target.value) || 0 })} />
          </Field>
        </div>
        <Field label="Block title">
          <Input value={draft.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Purpose">
          <Textarea rows={2} value={draft.purpose} onChange={(e) => patch({ purpose: e.target.value })} />
        </Field>
        <Field label="Instructions">
          <Textarea rows={3} value={draft.instructions} onChange={(e) => patch({ instructions: e.target.value })} />
        </Field>
        <Field label="Materials">
          <Textarea rows={2} value={draft.materials} onChange={(e) => patch({ materials: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Leader responsible">
            <Input value={draft.leaderResponsible} onChange={(e) => patch({ leaderResponsible: e.target.value })} />
          </Field>
          <Field label="Group format">
            <Select value={draft.groupFormat} onChange={(e) => patch({ groupFormat: e.target.value as GroupFormat })}>
              {GROUP_FORMATS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Preparation notes">
          <Textarea rows={2} value={draft.preparationNotes} onChange={(e) => patch({ preparationNotes: e.target.value })} />
        </Field>
        <Field label="Safety notes">
          <Textarea rows={2} value={draft.safetyNotes} onChange={(e) => patch({ safetyNotes: e.target.value })} />
        </Field>
        <Field label="Accessibility notes">
          <Textarea rows={2} value={draft.accessibilityNotes} onChange={(e) => patch({ accessibilityNotes: e.target.value })} />
        </Field>
        <Field label="Discussion prompts">
          <Textarea rows={2} value={draft.discussionPrompts} onChange={(e) => patch({ discussionPrompts: e.target.value })} />
        </Field>
        <Field label="Internal notes">
          <Textarea rows={2} value={draft.internalNotes} onChange={(e) => patch({ internalNotes: e.target.value })} />
        </Field>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
          >
            Save block
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
