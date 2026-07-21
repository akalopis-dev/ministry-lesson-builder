import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-surface/40 px-8 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-paper text-navy">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-heading text-base font-semibold text-navy">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-charcoal-soft">{description}</p>
      {action && <div className="mt-5 flex gap-3">{action}</div>}
    </div>
  );
}
