"use client";

import type { LessonPlan } from "@/lib/types";
import { Field, Textarea, Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";

export function StepCommunication({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  function update(key: keyof LessonPlan["communication"], value: string) {
    onChange({ communication: { ...lesson.communication, [key]: value } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Parent and leader communication</h2>
        <p className="mt-1 text-sm text-charcoal-soft">
          Edit the summaries and take-home content generated from your lesson details below.
        </p>
      </div>

      <Card>
        <CardHeader title="Parent description" subtitle="A short parent-facing summary." />
        <div className="px-5 py-4">
          <Textarea rows={3} value={lesson.communication.parentDescription} onChange={(e) => update("parentDescription", e.target.value)} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Leader briefing" subtitle="Purpose, reminders, and key theological message for co-leaders." />
        <div className="space-y-4 px-5 py-4">
          <Field label="Lesson purpose / key theological message">
            <Textarea rows={2} value={lesson.communication.leaderPurpose} onChange={(e) => update("leaderPurpose", e.target.value)} />
          </Field>
          <Field label="Important reminders" hint="Roles, materials, and safety notes leaders should know">
            <Textarea rows={2} value={lesson.communication.leaderReminders} onChange={(e) => update("leaderReminders", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Participant take-home" subtitle="What participants carry home from this session." />
        <div className="space-y-4 px-5 py-4">
          <Field label="Reflection question">
            <Input value={lesson.communication.takeHomeReflectionQuestion} onChange={(e) => update("takeHomeReflectionQuestion", e.target.value)} />
          </Field>
          <Field label="Family discussion prompt">
            <Input value={lesson.communication.takeHomeFamilyPrompt} onChange={(e) => update("takeHomeFamilyPrompt", e.target.value)} />
          </Field>
          <Field label="Challenge for the week">
            <Input value={lesson.communication.takeHomeChallenge} onChange={(e) => update("takeHomeChallenge", e.target.value)} />
          </Field>
          <Field label="Prayer" hint="Optional">
            <Textarea rows={2} value={lesson.communication.takeHomePrayer} onChange={(e) => update("takeHomePrayer", e.target.value)} />
          </Field>
        </div>
      </Card>
    </div>
  );
}
