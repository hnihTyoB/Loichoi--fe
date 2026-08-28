"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      if (!user || user.id !== query.data.id || user.updatedAt !== query.data.updatedAt || user.avatarUrl !== query.data.avatarUrl) {
        setUser(query.data);
      }
    } else if (query.isError && user !== null) {
      setUser(null);
    }
  }, [query.data, query.isError, user, setUser]);

  return {
    user: query.data || user,
    isAuthenticated: !!query.data || isAuthenticated,
    isLoading: query.isLoading || isLoading,
    refetch: query.refetch,
  };
}
