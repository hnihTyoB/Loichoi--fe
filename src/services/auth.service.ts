import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { LoginPayload, RegisterPayload } from "@/types/auth.types";
import { User } from "@/types/user.types";

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

  getDiscordOAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888"}/api/v1/auth/discord`;
  },
};
