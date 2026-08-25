import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { Permission, Role, RoleCreatePayload } from "@/types/rbac.types";

export const rbacService = {
  async getRoles(): Promise<Role[]> {
    const res = await apiClient.get<ApiResponse<Role[]>>("/roles");
    return res.data.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const res = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
    return res.data.data;
  },

  async getPermissions(): Promise<Permission[]> {
    const res = await apiClient.get<ApiResponse<Permission[]>>("/permissions");
    return res.data.data;
  },

  async createRole(payload: RoleCreatePayload): Promise<Role> {
    const res = await apiClient.post<ApiResponse<Role>>("/roles", payload);
    return res.data.data;
  },

  async updateRole(id: string, payload: Partial<RoleCreatePayload>): Promise<Role> {
    const res = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, payload);
    return res.data.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  },
};
