import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { CreateUserPayload, User } from "@/types/user.types";

export const userService = {
  async getUsers(params?: { page?: number; limit?: number; email?: string; fullName?: string; roleName?: string; isActive?: boolean }): Promise<ApiResponse<User[]>> {
    const res = await apiClient.get<ApiResponse<User[]>>("/users", { params });
    return res.data;
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>("/users", payload);
    return res.data.data;
  },

  async getUserById(id: string): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return res.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
