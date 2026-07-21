"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/lib/types";

export function CollectionFormDrawer({
  open,
  onClose,
  collection,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
  onSave: (name: string, description: string) => void;
}) {
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title={collection ? "Edit collection" : "New collection"} width="max-w-md">
      <div className="space-y-5">
        <Field label="Collection name" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Great Lent" />
        </Field>
        <Field label="Description" hint="Optional">
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this collection is for" />
        </Field>
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {collection ? "Save changes" : "Create collection"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
