import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-8 py-24 text-center", className)}>
      <Loader2 size={22} className="animate-spin text-navy" strokeWidth={1.75} />
      <p className="text-sm text-charcoal-soft">{label}</p>
    </div>
  );
}
