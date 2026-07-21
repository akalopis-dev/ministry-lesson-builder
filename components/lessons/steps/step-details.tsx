"use client";

import type { LessonPlan } from "@/lib/types";
import { MINISTRIES, LESSON_STATUSES, LITURGICAL_SEASONS, THEMES } from "@/lib/types";
import { Field } from "@/components/ui/input";
import { Input, Select, Textarea } from "@/components/ui/input";

export function StepDetails({
  lesson,
  onChange,
}: {
  lesson: LessonPlan;
  onChange: (patch: Partial<LessonPlan>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy">Lesson details</h2>
        <p className="mt-1 text-sm text-charcoal-soft">The essentials that describe this session.</p>
      </div>

      <Field label="Lesson title" required>
        <Input
          value={lesson.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Let Your Light Shine"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Ministry" required>
          <Select value={lesson.ministry} onChange={(e) => onChange({ ministry: e.target.value as LessonPlan["ministry"] })}>
            {MINISTRIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={lesson.status} onChange={(e) => onChange({ status: e.target.value as LessonPlan["status"] })}>
            {LESSON_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Age range" required hint="e.g. 7–11">
          <Input value={lesson.ageRange} onChange={(e) => onChange({ ageRange: e.target.value })} placeholder="7–11" />
        </Field>
        <Field label="Grade range" hint="Optional">
          <Input value={lesson.gradeRange ?? ""} onChange={(e) => onChange({ gradeRange: e.target.value })} placeholder="Grades 2–5" />
        </Field>
        <Field label="Theme" required hint="Choose one or type a custom theme">
          <Input list="theme-options" value={lesson.theme} onChange={(e) => onChange({ theme: e.target.value })} placeholder="Select or type a theme" />
          <datalist id="theme-options">
            {THEMES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <Field label="Subtheme" hint="Optional">
          <Input value={lesson.subtheme ?? ""} onChange={(e) => onChange({ subtheme: e.target.value })} />
        </Field>
        <Field label="Liturgical season">
          <Select value={lesson.season} onChange={(e) => onChange({ season: e.target.value as LessonPlan["season"] })}>
            {LITURGICAL_SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Date" hint="Optional — set when scheduled">
          <Input type="date" value={lesson.date ?? ""} onChange={(e) => onChange({ date: e.target.value })} />
        </Field>
        <Field label="Duration (minutes)" required>
          <Input
            type="number"
            min={5}
            step={5}
            value={lesson.durationMinutes}
            onChange={(e) => onChange({ durationMinutes: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Group size" hint="Optional">
          <Input value={lesson.groupSize ?? ""} onChange={(e) => onChange({ groupSize: e.target.value })} placeholder="e.g. 12–18 children" />
        </Field>
        <Field label="Indoor / outdoor">
          <Select value={lesson.indoorOutdoor} onChange={(e) => onChange({ indoorOutdoor: e.target.value as LessonPlan["indoorOutdoor"] })}>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Either">Either</option>
          </Select>
        </Field>
        <Field label="Lead facilitator" required>
          <Input value={lesson.leadFacilitator} onChange={(e) => onChange({ leadFacilitator: e.target.value })} />
        </Field>
        <Field label="Additional leaders" hint="Optional">
          <Input value={lesson.additionalLeaders ?? ""} onChange={(e) => onChange({ additionalLeaders: e.target.value })} />
        </Field>
      </div>

      <Field label="Short summary" hint="Shown in the library and on the dashboard">
        <Textarea rows={2} value={lesson.summary} onChange={(e) => onChange({ summary: e.target.value })} />
      </Field>

      <Field label="Internal notes" hint="Only visible to leaders, not exported to parents">
        <Textarea rows={2} value={lesson.internalNotes ?? ""} onChange={(e) => onChange({ internalNotes: e.target.value })} />
      </Field>
    </div>
  );
}
