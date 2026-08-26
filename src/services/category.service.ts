import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { KeyboardCategory } from "@/types/keyboard.types";

export const categoryService = {
  async getPublicList(): Promise<KeyboardCategory[]> {
    const response = await apiClient.get<ApiResponse<KeyboardCategory[]>>("/categories");
    return response.data.data;
  },
};
