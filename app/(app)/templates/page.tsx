"use client";

import { useRouter } from "next/navigation";
import { LayoutTemplate, Clock, Users } from "lucide-react";
import { TEMPLATES } from "@/lib/data/templates";
import { blankLessonPlan, makeBlock, makeId } from "@/lib/types";
import { useLessonPlans } from "@/lib/store";
import { formatMinutes } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function TemplatesPage() {
  const router = useRouter();
  const { saveLesson } = useLessonPlans();
  const showToast = useToast();

  function applyTemplate(templateId: string) {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const lesson = blankLessonPlan();
    lesson.title = `${template.name} (untitled)`;
    lesson.ministry = template.ministry;
    lesson.durationMinutes = template.durationMinutes;
    lesson.summary = template.description;
    lesson.blocks = template.blocks.map((b) =>
      makeBlock({ type: b.type, title: b.title, durationMinutes: b.durationMinutes })
    );
    lesson.revisions = [{ id: makeId("rev"), label: `Started from template: ${template.name}`, timestamp: lesson.createdAt }];
    saveLesson(lesson);
    showToast(`Started a new lesson from "${template.name}"`);
    router.push(`/lessons/${lesson.id}/edit`);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <LayoutTemplate size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Templates</h1>
          <p className="text-sm text-charcoal-soft">Start a new lesson from a ready-made structure, then customize every step.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TEMPLATES.map((template) => (
          <div key={template.id} className="flex flex-col rounded-md border border-border bg-paper p-5 shadow-soft transition-shadow hover:shadow-elevated">
            <h2 className="font-heading text-base font-semibold text-navy">{template.name}</h2>
            <p className="mt-1.5 text-sm text-charcoal-soft">{template.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-charcoal-soft">
              <span className="flex items-center gap-1">
                <Clock size={13} /> {formatMinutes(template.durationMinutes)}
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} /> {template.ministry}
              </span>
              <span>{template.blocks.length} blocks</span>
            </div>
            <ol className="mt-4 space-y-1 text-sm text-charcoal">
              {template.blocks.map((b, i) => (
                <li key={i} className="flex justify-between border-b border-border/70 py-1 last:border-0">
                  <span>{b.title}</span>
                  <span className="text-charcoal-soft">{b.durationMinutes} min</span>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <Button size="sm" onClick={() => applyTemplate(template.id)}>
                Use this template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
