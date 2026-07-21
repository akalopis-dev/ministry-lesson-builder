"use client";

import { Plus, Trash2, BookMarked } from "lucide-react";
import type { LessonPlan, LessonSource, SourceType } from "@/lib/types";
import { makeId } from "@/lib/types";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Accordion } from "@/components/ui/accordion";

const SOURCE_TYPES: SourceType[] = [
  "Bible passage",
  "Liturgical text",
  "Prayer",
  "Saint quotation",
  "Church Father quotation",
  "Hymn",
  "Gospel reading",
  "Epistle reading",
  "Orthodox resource link",
  "Leader notes",
];

export function StepSources({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  const sources = lesson.sources;

  function update(id: string, patch: Partial<LessonSource>) {
    onChange({ sources: sources.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function remove(id: string) {
    onChange({ sources: sources.filter((s) => s.id !== id) });
  }

  function add() {
    const s: LessonSource = { id: makeId("src"), type: "Bible passage", reference: "", excerpt: "", connection: "" };
    onChange({ sources: [...sources, s] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Scripture and Orthodox sources</h2>
        <p className="mt-1 text-sm text-charcoal-soft">
          Add the passages, prayers, and texts this lesson draws on. Store your own resources or curated material — content is never invented automatically.
        </p>
      </div>

      {sources.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No sources added"
          description="Add a Scripture passage, prayer, or Orthodox resource to ground this lesson."
          action={
            <Button size="sm" onClick={add}>
              <Plus size={14} /> Add source
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sources.map((source, i) => (
            <Accordion
              key={source.id}
              defaultOpen={!source.reference}
              title={
                <span>
                  {source.reference || `New source ${i + 1}`}
                  <span className="ml-2 text-xs font-normal text-charcoal-soft">{source.type}</span>
                </span>
              }
              right={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(source.id);
                  }}
                  className="rounded p-1 text-charcoal-soft hover:bg-burgundy-soft hover:text-burgundy"
                >
                  <Trash2 size={14} />
                </button>
              }
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Source type">
                  <Select value={source.type} onChange={(e) => update(source.id, { type: e.target.value as SourceType })}>
                    {SOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Reference" hint="e.g. Matthew 5:14–16">
                  <Input value={source.reference} onChange={(e) => update(source.id, { reference: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Short excerpt or summary">
                  <Textarea rows={2} value={source.excerpt} onChange={(e) => update(source.id, { excerpt: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="How it connects to the lesson">
                  <Textarea rows={2} value={source.connection} onChange={(e) => update(source.id, { connection: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Source link" hint="Optional">
                  <Input value={source.link ?? ""} onChange={(e) => update(source.id, { link: e.target.value })} placeholder="https://..." />
                </Field>
                <Field label="Citation information" hint="Optional">
                  <Input value={source.citation ?? ""} onChange={(e) => update(source.id, { citation: e.target.value })} />
                </Field>
              </div>
            </Accordion>
          ))}
          <Button variant="secondary" size="sm" onClick={add}>
            <Plus size={14} /> Add source
          </Button>
        </div>
      )}
    </div>
  );
}
