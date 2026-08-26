import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  KeyboardDetail,
  KeyboardListParams,
  KeyboardListResult,
  KeyboardSort,
} from "@/types/keyboard.types";
import type { AdminKeyboard, KeyboardPayload, PageResult } from "@/types/admin.types";

const sortMap: Record<KeyboardSort, string> = {
  latest: "LATEST",
  popular: "POPULAR",
  liked: "TOP_LIKED",
  "name-asc": "NAME_ASC",
  "name-desc": "NAME_DESC",
};

export const keyboardService = {
  async getManagementList(params: { page?: number; limit?: number; search?: string; status?: string; platform?: string; categoryId?: string } = {}): Promise<PageResult<AdminKeyboard>> {
    const response = await apiClient.get<PageResult<AdminKeyboard>>("/keyboards/manage", { params });
    return response.data;
  },

  async getManagementById(id: string): Promise<AdminKeyboard> {
    const response = await apiClient.get<ApiResponse<AdminKeyboard>>(`/keyboards/manage/${id}`);
    return response.data.data;
  },

  async create(payload: KeyboardPayload): Promise<AdminKeyboard> {
    const response = await apiClient.post<ApiResponse<AdminKeyboard>>("/keyboards", payload);
    return response.data.data;
  },

  async update(id: string, payload: Partial<KeyboardPayload>): Promise<AdminKeyboard> {
    const response = await apiClient.patch<ApiResponse<AdminKeyboard>>(`/keyboards/${id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/keyboards/${id}`);
  },

  async resetQuota(userId: string): Promise<void> {
    await apiClient.post(`/keyboards/manage/users/${userId}/reset-quota`);
  },

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
