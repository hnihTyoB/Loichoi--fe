import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { KeyboardCategory } from "@/types/keyboard.types";
import type { AdminCategory, PageResult } from "@/types/admin.types";

export const categoryService = {
  async getPublicList(): Promise<KeyboardCategory[]> {
    const response = await apiClient.get<ApiResponse<KeyboardCategory[]>>("/categories");
    return response.data.data;
  },
  async getManagementList(params: { page?: number; limit?: number; search?: string; isActive?: boolean } = {}): Promise<PageResult<AdminCategory>> {
    const response = await apiClient.get<PageResult<AdminCategory>>("/categories/manage", { params });
    return response.data;
  },
  async create(payload: { name: string; slug?: string; isActive: boolean }): Promise<AdminCategory> {
    const response = await apiClient.post<ApiResponse<AdminCategory>>("/categories", payload);
    return response.data.data;
  },
  async update(id: string, payload: { name?: string; slug?: string; isActive?: boolean }): Promise<AdminCategory> {
    const response = await apiClient.patch<ApiResponse<AdminCategory>>(`/categories/${id}`, payload);
    return response.data.data;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
