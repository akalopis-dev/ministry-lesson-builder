export function ResourceOverview({
  lessonPlans,
  activities,
  prayers,
  scripturePassages,
  templates,
}: {
  lessonPlans: number;
  activities: number;
  prayers: number;
  scripturePassages: number;
  templates: number;
}) {
  const stats = [
    { label: "Lesson plans", value: lessonPlans },
    { label: "Activities", value: activities },
    { label: "Prayers", value: prayers },
    { label: "Scripture passages", value: scripturePassages },
    { label: "Templates", value: templates },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border shadow-soft sm:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="bg-paper px-4 py-3.5">
          <p className="font-heading text-xl font-bold tabular-nums text-navy">{s.value}</p>
          <p className="text-xs text-charcoal-soft">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
