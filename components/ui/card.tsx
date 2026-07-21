import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md border border-border bg-paper shadow-soft", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <h2 className="font-heading text-base font-semibold text-navy">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-charcoal-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
