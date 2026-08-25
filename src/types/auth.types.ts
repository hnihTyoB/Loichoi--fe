import { User } from "./user.types";

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  accessToken?: string;
}
