"use client";

import { Check, Languages } from "lucide-react";
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

export function LanguageToggle() {
  const { language, setLanguage, t, isMounted } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title={isMounted ? t.language.toggleTitle : "Chuyển đổi ngôn ngữ"}
          className="gap-2 rounded-full border-kawaii-sky/60 bg-kawaii-cloud/40 hover:bg-kawaii-blush/40 text-kawaii-mocha transition-all duration-200 bouncy-hover px-3.5 h-10 shadow-sm"
        >
          <Languages className="h-4 w-4 text-kawaii-mocha" />
          <span className="font-extrabold text-xs uppercase tracking-wider">
            {isMounted ? (language === "vi" ? "VI" : "EN") : "VI"}
          </span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-kawaii-mocha/70 font-bold">
          {isMounted ? t.language.title : "Ngôn ngữ"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setLanguage("vi")}
          className="justify-between text-xs font-bold"
        >
          <span>Tiếng Việt</span>
          {language === "vi" && <Check className="h-4 w-4 text-kawaii-warmbrown" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="justify-between text-xs font-bold"
        >
          <span>English</span>
          {language === "en" && <Check className="h-4 w-4 text-kawaii-warmbrown" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
