import "server-only";

import { cache } from "react";
import type { ApiResponse } from "@/types/api.types";
import type { KeyboardDetail } from "@/types/keyboard.types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999"}/api/v1`;

export const getPublicKeyboardForServer = cache(
  async (slug: string): Promise<KeyboardDetail | null | undefined> => {
    try {
      const response = await fetch(`${apiBaseUrl}/keyboards/${encodeURIComponent(slug)}`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
      });

      if (response.status === 404) return null;
      if (!response.ok) return undefined;

      const payload = (await response.json()) as ApiResponse<KeyboardDetail>;
      return payload.data;
    } catch {
      return undefined;
    }
  },
);
