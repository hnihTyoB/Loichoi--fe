export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  roleId: string;
  role?: {
    id: string;
    name: string;
    description?: string;
  };
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  discordId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  roleId: string;
}
