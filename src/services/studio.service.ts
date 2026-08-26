import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AdminKeyboard, KeyboardPayload, PageResult, StudioStats } from "@/types/admin.types";

export const studioService = {
  async getStats(): Promise<StudioStats> { const response = await apiClient.get<ApiResponse<StudioStats>>("/studio/stats"); return response.data.data; },
  async getThemes(params: { search?: string; status?: string; limit?: number } = {}): Promise<PageResult<AdminKeyboard>> { const response = await apiClient.get<PageResult<AdminKeyboard>>("/studio/themes", { params }); return response.data; },
  async createTheme(payload: KeyboardPayload): Promise<AdminKeyboard> { const response = await apiClient.post<ApiResponse<AdminKeyboard>>("/studio/themes", payload); return response.data.data; },
  async updateTheme(id: string, payload: Partial<KeyboardPayload>): Promise<AdminKeyboard> { const response = await apiClient.patch<ApiResponse<AdminKeyboard>>(`/studio/themes/${id}`, payload); return response.data.data; },
  async deleteTheme(id: string): Promise<void> { await apiClient.delete(`/studio/themes/${id}`); },
  async updateProfile(payload: { username?: string; fullName?: string; bio?: string | null; avatarUrl?: string | null; bannerUrl?: string | null; socialLinks?: Record<string, string> | null }): Promise<void> { await apiClient.put("/studio/profile", payload); },
  async apply(payload: { username: string; bio?: string; socialLinks?: Record<string, string> }): Promise<void> { await apiClient.post("/studio/apply", payload); },
};
