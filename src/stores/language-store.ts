"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Language } from "@/lib/i18n";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "vi",
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () =>
        set({ language: get().language === "vi" ? "en" : "vi" }),
    }),
    {
      name: "loichoi-language",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
