import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border-2 border-kawaii-sky/50 bg-background px-4 py-2 text-sm text-kawaii-mocha shadow-inner placeholder:text-kawaii-mocha/40 transition-all duration-200 focus-visible:outline-none focus-visible:border-kawaii-babyblue focus-visible:ring-4 focus-visible:ring-kawaii-sky/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
