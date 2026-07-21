import Link from "next/link";
import { SEASONAL_SUGGESTIONS } from "@/lib/data/seed";

const ACCENTS = ["bg-navy", "bg-gold", "bg-burgundy", "bg-olive"];

export function SeasonalSuggestions() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {SEASONAL_SUGGESTIONS.map((season, i) => (
        <Link
          key={season.name}
          href={`/lessons?season=${encodeURIComponent(season.name)}`}
          className="w-56 shrink-0 overflow-hidden rounded-md border border-border bg-paper shadow-soft transition-all hover:border-border-strong hover:shadow-elevated"
        >
          <div className={`h-1 ${ACCENTS[i % ACCENTS.length]}`} />
          <div className="px-4 py-3.5">
            <p className="font-heading text-sm font-semibold text-navy">{season.name}</p>
            <p className="mt-1 text-xs text-charcoal-soft">{season.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
