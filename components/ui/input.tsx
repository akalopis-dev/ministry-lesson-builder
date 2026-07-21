import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded border border-border-strong bg-paper px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded border border-border-strong bg-paper px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded border border-border-strong bg-paper px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-xs font-medium text-charcoal-soft mb-1.5", className)}>
      {children}
    </label>
  );
}

export function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-burgundy"> *</span>}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-charcoal-soft">{hint}</p>}
    </div>
  );
}
