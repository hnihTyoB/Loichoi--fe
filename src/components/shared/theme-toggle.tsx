"use client";

import { useEffect, useState } from "react";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t, isMounted } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title={isMounted ? t.theme.toggleTitle : "Chuyển đổi giao diện"}
          className="h-10 w-10 rounded-full border-border bg-muted/70 text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground bouncy-hover"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all text-amber-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all text-kawaii-babyblue dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground">
          {isMounted ? t.theme.title : "Giao diện"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="justify-between text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>{isMounted ? t.theme.light : "Sáng"}</span>
          </div>
          {mounted && theme === "light" && (
            <Check className="h-4 w-4 text-kawaii-warmbrown" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="justify-between text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-kawaii-babyblue" />
            <span>{isMounted ? t.theme.dark : "Tối"}</span>
          </div>
          {mounted && theme === "dark" && (
            <Check className="h-4 w-4 text-kawaii-warmbrown" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="justify-between text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-muted-foreground" />
            <span>{isMounted ? t.theme.system : "Theo hệ thống"}</span>
          </div>
          {mounted && theme === "system" && (
            <Check className="h-4 w-4 text-kawaii-warmbrown" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
