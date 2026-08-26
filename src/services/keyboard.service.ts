import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  KeyboardDetail,
  KeyboardListParams,
  KeyboardListResult,
  KeyboardSort,
} from "@/types/keyboard.types";

const sortMap: Record<KeyboardSort, string> = {
  latest: "LATEST",
  popular: "POPULAR",
  liked: "TOP_LIKED",
  "name-asc": "NAME_ASC",
  "name-desc": "NAME_DESC",
};

export const keyboardService = {
  async getList(params: KeyboardListParams = {}): Promise<KeyboardListResult> {
    const response = await apiClient.get<KeyboardListResult>("/keyboards", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search || undefined,
        category: params.category || undefined,
        platform: params.platform?.toUpperCase(),
        accessLevel: params.accessLevel,
        isFeatured: params.featured,
        sort: sortMap[params.sort ?? "latest"],
      },
    });

    return response.data;
  },

  async getBySlug(slug: string): Promise<KeyboardDetail> {
    const response = await apiClient.get<ApiResponse<KeyboardDetail>>(
      `/keyboards/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  },
};
