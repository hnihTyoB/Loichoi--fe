import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawaii-sky disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:scale-105 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-kawaii-babyblue text-kawaii-mocha shadow-cloud hover:bg-kawaii-sky hover:shadow-cloud-hover border border-kawaii-sky/60",
        kawaiiPink:
          "bg-kawaii-pink text-kawaii-mocha shadow-blush hover:bg-kawaii-blush border border-kawaii-blush",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-kawaii-sky/80 bg-background text-kawaii-mocha hover:bg-kawaii-cloud hover:text-kawaii-mocha hover:border-kawaii-babyblue",
        secondary:
          "bg-kawaii-blush text-kawaii-mocha hover:bg-kawaii-pink/80 border border-kawaii-blush/80",
        ghost:
          "text-kawaii-mocha hover:bg-kawaii-cloud hover:text-kawaii-mocha",
        link:
          "text-kawaii-warmbrown underline-offset-4 hover:underline hover:text-kawaii-mocha shadow-none hover:scale-100",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-13 rounded-full px-8 text-base py-3 font-bold",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
