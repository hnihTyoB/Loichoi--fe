"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { keyboardService } from "@/services/keyboard.service";
import type {
  KeyboardDetail,
  KeyboardListParams,
} from "@/types/keyboard.types";

export const keyboardKeys = {
  all: ["public-keyboards"] as const,
  list: (params: KeyboardListParams) => [...keyboardKeys.all, "list", params] as const,
  detail: (slug: string) => [...keyboardKeys.all, "detail", slug] as const,
  categories: ["public-keyboard-categories"] as const,
};

export function useKeyboards(params: KeyboardListParams) {
  return useQuery({
    queryKey: keyboardKeys.list(params),
    queryFn: () => keyboardService.getList(params),
  });
}

export function useKeyboard(slug: string, initialData?: KeyboardDetail) {
  return useQuery({
    queryKey: keyboardKeys.detail(slug),
    queryFn: () => keyboardService.getBySlug(slug),
    initialData,
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      return status !== 404 && failureCount < 2;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: keyboardKeys.categories,
    queryFn: categoryService.getPublicList,
    staleTime: 5 * 60 * 1000,
  });
}
