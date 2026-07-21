import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-navy text-paper border border-navy shadow-soft hover:shadow-elevated hover:bg-[#293754] active:bg-[#16203a]",
  secondary: "bg-paper text-navy border border-border-strong shadow-soft hover:border-charcoal-soft/40 hover:bg-surface",
  ghost: "bg-transparent text-charcoal border border-transparent hover:bg-surface",
  danger: "bg-transparent text-burgundy border border-burgundy/40 hover:bg-burgundy-soft",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-3.5 py-2 gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
