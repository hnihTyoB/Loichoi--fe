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
      setUser(query.data);
    } else if (query.isError) {
      setUser(null);
    }
  }, [query.data, query.isError, setUser]);

  return {
    user: query.data || user,
    isAuthenticated: !!query.data || isAuthenticated,
    isLoading: query.isLoading || isLoading,
    refetch: query.refetch,
  };
}
