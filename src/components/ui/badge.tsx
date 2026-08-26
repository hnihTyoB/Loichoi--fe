import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-kawaii-sky shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-primary/60 bg-primary/20 text-foreground hover:bg-primary/30",
        secondary:
          "border-secondary/70 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline:
          "border-2 border-border bg-background text-foreground",
        kawaiiCloud:
          "border-border bg-muted text-foreground shadow-cloud",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
