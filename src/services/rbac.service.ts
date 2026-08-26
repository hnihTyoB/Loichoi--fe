import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api.types";
import { Permission, Role, RoleCreatePayload } from "@/types/rbac.types";

export const rbacService = {
  async getRoles(): Promise<Role[]> {
    const res = await apiClient.get<ApiResponse<Role[]>>("/rbac/roles");
    return res.data.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const res = await apiClient.get<ApiResponse<Role>>(`/rbac/roles/${id}`);
    return res.data.data;
  },

  async getPermissions(): Promise<Permission[]> {
    const res = await apiClient.get<ApiResponse<Permission[]>>("/rbac/permissions");
    return res.data.data;
  },

  async createRole(payload: RoleCreatePayload): Promise<Role> {
    const res = await apiClient.post<ApiResponse<Role>>("/rbac/roles", payload);
    return res.data.data;
  },

  async updateRole(id: string, payload: Partial<RoleCreatePayload>): Promise<Role> {
    const res = await apiClient.put<ApiResponse<Role>>(`/rbac/roles/${id}`, payload);
    return res.data.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/rbac/roles/${id}`);
  },

  async syncRolePermissions(id: string, permissionIds: string[]): Promise<Role> {
    const res = await apiClient.post<ApiResponse<Role>>(`/rbac/roles/${id}/permissions`, { permissionIds });
    return res.data.data;
  },

  async removeRolePermission(roleId: string, permissionId: string): Promise<void> {
    await apiClient.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },

  async assignUserRole(userId: string, roleId: string): Promise<void> {
    await apiClient.put(`/rbac/users/${userId}/role`, { roleId });
  },
};
