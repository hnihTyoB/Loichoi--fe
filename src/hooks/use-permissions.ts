"use client";

import { useAuth } from "./use-auth";

export function usePermissions() {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  const hasPermission = (permission: string): boolean => {
    if (!permission) return true;
    if (permissions.includes("*") || permissions.includes("admin:*")) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some((perm) => hasPermission(perm));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every((perm) => hasPermission(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
