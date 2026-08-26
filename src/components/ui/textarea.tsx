import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("min-h-24 w-full resize-y rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-50", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
