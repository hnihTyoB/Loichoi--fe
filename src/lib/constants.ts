export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Loichoi",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/api/v1",
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888",
  discordClientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "",
  discordRedirectUri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000/callback/discord",
} as const;

export const PERMISSIONS = {
  // User permissions
  USER_READ: "users:read",
  USER_CREATE: "users:create",
  USER_UPDATE: "users:update",
  USER_DELETE: "users:delete",

  // Role permissions
  ROLE_READ: "roles:read",
  ROLE_CREATE: "roles:create",
  ROLE_UPDATE: "roles:update",
  ROLE_DELETE: "roles:delete",

  // Keyboard permissions
  KEYBOARD_READ: "keyboards:read",
  KEYBOARD_CREATE: "keyboards:create",
  KEYBOARD_UPDATE: "keyboards:update",
  KEYBOARD_DELETE: "keyboards:delete",

  // System permissions
  SYSTEM_CONFIG_READ: "system-config:read",
  SYSTEM_CONFIG_UPDATE: "system-config:update",
  AUDIT_LOG_READ: "audit-logs:read",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
