"use client";

import { Chip } from "@/components/ui/badge";
import { MINISTRIES, LESSON_STATUSES, LITURGICAL_SEASONS, type Ministry, type LessonStatus, type LiturgicalSeason } from "@/lib/types";

export interface LessonFilters {
  ministry: Ministry | null;
  status: LessonStatus | null;
  season: LiturgicalSeason | null;
  theme: string | null;
}

export function FiltersBar({
  filters,
  onChange,
  themes,
}: {
  filters: LessonFilters;
  onChange: (filters: LessonFilters) => void;
  themes: string[];
}) {
  function toggle<K extends keyof LessonFilters>(key: K, value: LessonFilters[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? null : value });
  }

  const hasActive = Boolean(filters.ministry || filters.status || filters.season || filters.theme);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-soft">Ministry</span>
        {MINISTRIES.map((m) => (
          <Chip key={m} active={filters.ministry === m} onClick={() => toggle("ministry", m)}>
            {m}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-soft">Status</span>
        {LESSON_STATUSES.map((s) => (
          <Chip key={s} active={filters.status === s} onClick={() => toggle("status", s)}>
            {s}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-soft">Season</span>
        {LITURGICAL_SEASONS.map((s) => (
          <Chip key={s} active={filters.season === s} onClick={() => toggle("season", s)}>
            {s}
          </Chip>
        ))}
      </div>
      {themes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-charcoal-soft">Theme</span>
          {themes.map((t) => (
            <Chip key={t} active={filters.theme === t} onClick={() => toggle("theme", t)}>
              {t}
            </Chip>
          ))}
        </div>
      )}
      {hasActive && (
        <button
          onClick={() => onChange({ ministry: null, status: null, season: null, theme: null })}
          className="text-xs font-medium text-burgundy hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
