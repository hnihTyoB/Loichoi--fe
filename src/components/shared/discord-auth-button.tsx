"use client";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DiscordAuthButtonProps = Omit<ButtonProps, "size" | "variant">;

export function DiscordAuthButton({
  children,
  className,
  type = "button",
  ...props
}: DiscordAuthButtonProps) {
  return (
    <Button
      {...props}
      type={type}
      variant="outline"
      className={cn(
        "h-12 w-full gap-2.5 rounded-full border-2 border-[#5865F2]/30 bg-[#5865F2]/10 font-bold text-[#5865F2] hover:bg-[#5865F2]/20 hover:text-[#5865F2] dark:border-[#8EA1E1]/50 dark:bg-[#5865F2]/20 dark:text-[#AEB6FF] dark:hover:bg-[#5865F2]/30 dark:hover:text-[#D5D9FF] bouncy-hover",
        className
      )}
    >
      <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 127.14 96.36">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74c6.45,0,11.55,5.78,11.43,12.74C53.88,60,48.82,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74c6.44,0,11.55,5.78,11.43,12.74C96.12,60,91.08,65.69,84.69,65.69Z" />
      </svg>
      {children}
    </Button>
  );
}
