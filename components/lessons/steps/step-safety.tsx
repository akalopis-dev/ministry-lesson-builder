"use client";

import type { LessonPlan } from "@/lib/types";
import { Field, Textarea } from "@/components/ui/input";

const FIELDS: { key: keyof LessonPlan["safety"]; label: string; hint?: string }[] = [
  { key: "hazards", label: "Potential hazards" },
  { key: "medicalConsiderations", label: "Medical considerations" },
  { key: "allergyConsiderations", label: "Allergy considerations" },
  { key: "supervisionRequirements", label: "Supervision requirements" },
  { key: "emergencyConsiderations", label: "Emergency considerations" },
  { key: "mobilityAccommodations", label: "Mobility accommodations" },
  { key: "sensoryAccommodations", label: "Sensory accommodations" },
  { key: "readingLevelAccommodations", label: "Reading-level accommodations" },
  { key: "behaviouralConsiderations", label: "Behavioural considerations" },
  { key: "alternativeActivity", label: "Alternative activity" },
  { key: "weatherBackupPlan", label: "Weather backup plan" },
];

export function StepSafety({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  function updateSafety(key: keyof LessonPlan["safety"], value: string) {
    onChange({ safety: { ...lesson.safety, [key]: value } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Safety and accessibility</h2>
        <p className="mt-1 text-sm text-charcoal-soft">
          Keep this concise and practical — a planning aid for leaders, not a legal document.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <Textarea rows={2} value={lesson.safety[f.key]} onChange={(e) => updateSafety(f.key, e.target.value)} />
          </Field>
        ))}
      </div>
    </div>
  );
}
