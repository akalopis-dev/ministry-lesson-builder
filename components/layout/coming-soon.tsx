import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function ComingSoonPage({
  title,
  description,
  icon,
  detail,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  detail: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-heading text-2xl font-semibold text-navy">{title}</h1>
      <p className="mt-1 text-sm text-charcoal-soft">{description}</p>
      <div className="mt-8">
        <EmptyState icon={icon} title="This section is coming soon" description={detail} />
      </div>
    </div>
  );
}
