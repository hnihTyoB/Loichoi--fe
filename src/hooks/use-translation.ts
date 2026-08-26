"use client";

import { useEffect, useState } from "react";
import { dictionary } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/language-store";

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLang: Language = mounted ? language : "vi";
  const t = dictionary[activeLang];

  return {
    t,
    language: activeLang,
    setLanguage,
    toggleLanguage,
    isMounted: mounted,
  };
}
