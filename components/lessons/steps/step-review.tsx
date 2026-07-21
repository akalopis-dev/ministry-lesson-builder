"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Printer, FileDown, Bookmark } from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { completenessChecklist } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const EXPORTS = [
  { mode: "full", label: "Print", icon: Printer },
  { mode: "full", label: "PDF", icon: FileDown },
  { mode: "leader", label: "Leader version" },
  { mode: "parent", label: "Parent summary" },
  { mode: "materials", label: "Materials checklist" },
  { mode: "runsheet", label: "One-page run sheet" },
  { mode: "handout", label: "Participant handout" },
];

export function StepReview({
  lesson,
  onSaveAsTemplate,
}: {
  lesson: LessonPlan;
  onSaveAsTemplate: () => void;
}) {
  const router = useRouter();
  const showToast = useToast();
  const checklist = completenessChecklist(lesson);
  const done = checklist.filter((c) => c.done).length;

  function handleExport(mode: string) {
    router.push(`/lessons/${lesson.id}?print=1&mode=${mode}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Review and export</h2>
        <p className="mt-1 text-sm text-charcoal-soft">Confirm the lesson is ready, then export the version you need.</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-charcoal">Lesson completeness ({done}/{checklist.length})</h3>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2 rounded-md border border-border bg-paper px-3 py-2 text-sm">
              {item.done ? <CheckCircle2 size={15} className="text-olive" /> : <Circle size={15} className="text-border-strong" />}
              <span className={item.done ? "text-charcoal" : "text-charcoal-soft"}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-charcoal">Export</h3>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {EXPORTS.map((exp) => (
            <Button key={exp.label} variant="secondary" size="sm" onClick={() => handleExport(exp.mode)}>
              {exp.icon && <exp.icon size={13} />}
              {exp.label}
            </Button>
          ))}
          <Button variant="secondary" size="sm" disabled title="Coming soon">
            Word document
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <Button
          variant="secondary"
          onClick={() => {
            onSaveAsTemplate();
            showToast("Saved as a reusable template outline");
          }}
        >
          <Bookmark size={14} /> Save as template
        </Button>
      </div>
    </div>
  );
}
