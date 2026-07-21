import { cn } from "@/lib/cn";
import type { ActivityCategory, BlockType, LessonStatus, Ministry } from "@/lib/types";
import { ACCENT_TAG_CLASSES, ACTIVITY_CATEGORY_ACCENTS, BLOCK_TYPE_ACCENTS } from "@/lib/category-colors";
import { MINISTRY_ACCENTS } from "@/lib/ministry-colors";

const statusStyles: Record<LessonStatus, string> = {
  Draft: "bg-surface text-charcoal-soft",
  "Ready for review": "bg-gold-soft text-[#7a5a20]",
  "Changes requested": "bg-burgundy-soft text-burgundy",
  Approved: "bg-olive-soft text-olive",
  Scheduled: "bg-[#e0eefc] text-[#2f5378]",
  Completed: "bg-[#ece9fa] text-[#5b4bb8]",
};

export function StatusBadge({ status, className }: { status: LessonStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-navy text-paper border-navy"
          : "bg-paper text-charcoal-soft border-border-strong hover:border-border-strong hover:bg-surface",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border-strong bg-surface px-2 py-0.5 text-xs text-charcoal-soft",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Color-coded tag for a lesson timeline block type — grouped by function (prayer, teaching, activity, logistics). */
export function BlockTypeTag({ type, className }: { type: BlockType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        ACCENT_TAG_CLASSES[BLOCK_TYPE_ACCENTS[type]],
        className
      )}
    >
      {type}
    </span>
  );
}

/** Color-coded tag for an Activity Library category. */
export function ActivityCategoryTag({ category, className }: { category: ActivityCategory; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        ACCENT_TAG_CLASSES[ACTIVITY_CATEGORY_ACCENTS[category]],
        className
      )}
    >
      {category}
    </span>
  );
}

/** Color-coded tag for a ministry / age group. */
export function MinistryTag({ ministry, className }: { ministry: Ministry; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        ACCENT_TAG_CLASSES[MINISTRY_ACCENTS[ministry]],
        className
      )}
    >
      {ministry}
    </span>
  );
}
