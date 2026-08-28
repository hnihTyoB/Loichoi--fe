"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onClick?.(e);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "border-kawaii-sky/80 bg-kawaii-babyblue shadow-inner"
            : "border-kawaii-sky/40 bg-kawaii-cloud/80 dark:bg-muted",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full shadow-sm transition-all duration-200 ease-in-out",
            checked
              ? "translate-x-5 bg-kawaii-mocha shadow-kawaii-mocha/20"
              : "translate-x-0.5 bg-kawaii-mocha/40 dark:bg-muted-foreground",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
