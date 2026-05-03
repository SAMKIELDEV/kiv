"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-[var(--radius-md)] focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-accent text-background hover:bg-accent-dim active:scale-[0.98]",
      secondary:
        "bg-surface text-text-primary border border-border hover:bg-surface-hover active:scale-[0.98]",
      danger:
        "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
