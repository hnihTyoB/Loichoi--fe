import { canAccessDashboard } from "@/lib/dashboard-access";
import type { User } from "@/types/user.types";

export function getSafeInternalPath(value?: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export function getDefaultAuthenticatedPath(user?: Pick<User, "permissions"> | null) {
  return canAccessDashboard(user?.permissions) ? "/dashboard" : "/";
}

export function getAuthenticatedDestination(user?: Pick<User, "permissions"> | null, requestedPath?: string | null) {
  return getSafeInternalPath(requestedPath) ?? getDefaultAuthenticatedPath(user);
}
