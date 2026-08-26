"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPasswordAriaLabel = "Hiện mật khẩu", hidePasswordAriaLabel = "Ẩn mật khẩu", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-11 w-full rounded-2xl border-2 border-input bg-background px-4 py-2 pr-11 text-sm text-foreground shadow-inner placeholder:text-muted-foreground transition-all duration-200 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-xl text-kawaii-mocha/50 transition-colors hover:bg-kawaii-sky/30 hover:text-kawaii-mocha focus-visible:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? hidePasswordAriaLabel : showPasswordAriaLabel}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
