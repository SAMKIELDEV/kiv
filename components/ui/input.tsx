"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-text-secondary font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-surface border border-border rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent/50 focus:outline-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
