import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AdminColor, AdminStyle, PageResult } from "@/types/admin.types";
import type { KeyboardColor, KeyboardStyle } from "@/types/keyboard.types";

const managementParams = (params: { page?: number; limit?: number; search?: string } = {}) => params;

export const colorService = {
  async getPublicList(): Promise<KeyboardColor[]> {
    const response = await apiClient.get<ApiResponse<KeyboardColor[]>>("/colors");
    return response.data.data;
  },
  async getManagementList(params: { page?: number; limit?: number; search?: string } = {}): Promise<PageResult<AdminColor>> {
    const response = await apiClient.get<PageResult<AdminColor>>("/colors/manage", { params: managementParams(params) });
    return response.data;
  },
  async create(payload: { name: string; slug?: string; hex: string }): Promise<AdminColor> {
    const response = await apiClient.post<ApiResponse<AdminColor>>("/colors", payload);
    return response.data.data;
  },
  async update(id: string, payload: { name?: string; slug?: string; hex?: string }): Promise<AdminColor> {
    const response = await apiClient.patch<ApiResponse<AdminColor>>(`/colors/${id}`, payload);
    return response.data.data;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/colors/${id}`);
  },
};

export const styleService = {
  async getPublicList(): Promise<KeyboardStyle[]> {
    const response = await apiClient.get<ApiResponse<KeyboardStyle[]>>("/styles");
    return response.data.data;
  },
  async getManagementList(params: { page?: number; limit?: number; search?: string } = {}): Promise<PageResult<AdminStyle>> {
    const response = await apiClient.get<PageResult<AdminStyle>>("/styles/manage", { params: managementParams(params) });
    return response.data;
  },
  async create(payload: { name: string; slug?: string; description?: string }): Promise<AdminStyle> {
    const response = await apiClient.post<ApiResponse<AdminStyle>>("/styles", payload);
    return response.data.data;
  },
  async update(id: string, payload: { name?: string; slug?: string; description?: string | null }): Promise<AdminStyle> {
    const response = await apiClient.patch<ApiResponse<AdminStyle>>(`/styles/${id}`, payload);
    return response.data.data;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/styles/${id}`);
  },
};
