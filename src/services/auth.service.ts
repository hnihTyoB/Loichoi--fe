import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { LoginPayload, RegisterPayload } from "@/types/auth.types";
import { User } from "@/types/user.types";

export interface ActiveSession {
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export const authService = {
  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    const res = await apiClient.post<ApiResponse<{ user: User; accessToken: string }>>("/auth/login", payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const res = await apiClient.post<ApiResponse<User>>("/auth/register", payload);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async updateProfile(payload: { fullName?: string; avatarUrl?: string; phoneNumber?: string }): Promise<void> {
    await apiClient.put("/auth/profile", payload);
  },

  async updatePassword(payload: { oldPassword?: string; newPassword: string }): Promise<void> {
    await apiClient.put("/auth/password", payload);
  },

  async getSessions(): Promise<ActiveSession[]> {
    const res = await apiClient.get<ApiResponse<ActiveSession[]>>("/auth/sessions");
    return res.data.data;
  },

  async revokeSession(id: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${id}`);
  },

  async revokeOtherSessions(): Promise<void> {
    await apiClient.delete("/auth/sessions");
  },

  getDiscordOAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999"}/api/v1/auth/discord`;
  },
};
