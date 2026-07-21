"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, ClipboardList, Package } from "lucide-react";
import type { LessonPlan, Material, MaterialCategory } from "@/lib/types";
import { MATERIAL_CATEGORIES, makeId } from "@/lib/types";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function StepMaterials({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<MaterialCategory>("Other");
  const [newPrepLabel, setNewPrepLabel] = useState("");
  const showToast = useToast();

  const materials = lesson.materials;
  const prep = lesson.preparationTasks;

  function updateMaterial(id: string, patch: Partial<Material>) {
    onChange({ materials: materials.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  }

  function deleteMaterial(id: string) {
    onChange({ materials: materials.filter((m) => m.id !== id) });
  }

  function addMaterial() {
    if (!newName.trim()) return;
    onChange({
      materials: [...materials, { id: makeId("mat"), name: newName.trim(), category: newCategory, alreadyAvailable: false }],
    });
    setNewName("");
  }

  function importFromTimeline() {
    const existingNames = new Set(materials.map((m) => m.name.toLowerCase()));
    const found: string[] = [];
    lesson.blocks.forEach((b) => {
      if (!b.materials) return;
      b.materials.split(",").map((s) => s.trim()).filter(Boolean).forEach((item) => {
        if (!existingNames.has(item.toLowerCase())) {
          existingNames.add(item.toLowerCase());
          found.push(item);
        }
      });
    });
    if (found.length === 0) {
      showToast("No new materials found in the timeline");
      return;
    }
    onChange({
      materials: [
        ...materials,
        ...found.map((name) => ({ id: makeId("mat"), name, category: "Other" as MaterialCategory, alreadyAvailable: false })),
      ],
    });
    showToast(`Added ${found.length} material${found.length === 1 ? "" : "s"} from the timeline`);
  }

  function toggleDone(id: string) {
    onChange({ preparationTasks: prep.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
  }

  function deletePrep(id: string) {
    onChange({ preparationTasks: prep.filter((t) => t.id !== id) });
  }

  function addPrep() {
    if (!newPrepLabel.trim()) return;
    onChange({ preparationTasks: [...prep, { id: makeId("prep"), label: newPrepLabel.trim(), done: false }] });
    setNewPrepLabel("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Materials and preparation</h2>
        <p className="mt-1 text-sm text-charcoal-soft">Track what needs to be gathered, purchased, or prepared before the session.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-charcoal">Master materials list</h3>
          <Button size="sm" variant="secondary" onClick={importFromTimeline}>
            <Sparkles size={13} /> Import from timeline
          </Button>
        </div>

        {materials.length === 0 ? (
          <div className="mt-3">
            <EmptyState icon={Package} title="No materials yet" description="Add materials manually or import them from your timeline blocks." />
          </div>
        ) : (
          <div className="mt-3 space-y-5">
            {MATERIAL_CATEGORIES.filter((cat) => materials.some((m) => m.category === cat)).map((cat) => (
              <div key={cat}>
                <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">{cat}</p>
                <div className="mt-1.5 space-y-1.5">
                  {materials
                    .filter((m) => m.category === cat)
                    .map((m) => (
                      <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-paper px-3 py-2">
                        <input type="checkbox" checked={m.alreadyAvailable} onChange={(e) => updateMaterial(m.id, { alreadyAvailable: e.target.checked })} />
                        <span className={`flex-1 min-w-[140px] text-sm ${m.alreadyAvailable ? "text-charcoal-soft line-through" : "text-charcoal"}`}>
                          {m.name}
                        </span>
                        <Input
                          className="w-24"
                          placeholder="Qty"
                          value={m.quantity ?? ""}
                          onChange={(e) => updateMaterial(m.id, { quantity: e.target.value })}
                        />
                        <Input
                          className="w-24"
                          type="number"
                          placeholder="Cost $"
                          value={m.costEstimate ?? ""}
                          onChange={(e) => updateMaterial(m.id, { costEstimate: Number(e.target.value) || undefined })}
                        />
                        <Input
                          className="w-36"
                          placeholder="Purchaser"
                          value={m.assignedPurchaser ?? ""}
                          onChange={(e) => updateMaterial(m.id, { assignedPurchaser: e.target.value })}
                        />
                        <Input
                          className="w-36"
                          type="date"
                          value={m.preparationDeadline ?? ""}
                          onChange={(e) => updateMaterial(m.id, { preparationDeadline: e.target.value })}
                        />
                        <button onClick={() => deleteMaterial(m.id)} className="rounded p-1.5 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Input className="max-w-[200px]" placeholder="Material name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Select className="max-w-[180px]" value={newCategory} onChange={(e) => setNewCategory(e.target.value as MaterialCategory)}>
            {MATERIAL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Button size="sm" variant="secondary" onClick={addMaterial}>
            <Plus size={14} /> Add material
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <ClipboardList size={15} /> Preparation checklist
        </h3>
        <div className="mt-3 space-y-1.5">
          {prep.map((task) => (
            <div key={task.id} className="flex items-center gap-2.5 rounded-md border border-border bg-paper px-3 py-2">
              <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)} />
              <span className={`flex-1 text-sm ${task.done ? "text-charcoal-soft line-through" : "text-charcoal"}`}>{task.label}</span>
              <button onClick={() => deletePrep(task.id)} className="rounded p-1 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Input
            placeholder="e.g. Reserve parish hall"
            value={newPrepLabel}
            onChange={(e) => setNewPrepLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPrep()}
          />
          <Button size="sm" variant="secondary" onClick={addPrep}>
            <Plus size={14} /> Add task
          </Button>
        </div>
      </div>
    </div>
  );
}
