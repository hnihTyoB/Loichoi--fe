import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-kawaii-sky shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-kawaii-sky bg-kawaii-babyblue/30 text-kawaii-mocha hover:bg-kawaii-sky/50",
        secondary:
          "border-kawaii-blush bg-kawaii-blush/40 text-kawaii-mocha hover:bg-kawaii-blush",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline:
          "border-2 border-kawaii-sky/70 bg-background text-kawaii-mocha",
        kawaiiCloud:
          "border-kawaii-sky/40 bg-kawaii-cloud text-kawaii-mocha shadow-cloud",
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
