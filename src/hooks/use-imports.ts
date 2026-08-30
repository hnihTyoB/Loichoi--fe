"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importService } from "@/services/import.service";
import { toast } from "sonner";
import type {
  ImportJobFilter,
  UpdateDraftPayload,
  BulkApprovePayload,
} from "@/types/import.types";

// ──────────────────────────────────────────────
// Query Keys
// ──────────────────────────────────────────────

export const importKeys = {
  all: ["imports"] as const,
  list: (filter: ImportJobFilter) => [...importKeys.all, "list", filter] as const,
  detail: (id: string) => [...importKeys.all, "detail", id] as const,
};

// ──────────────────────────────────────────────
// Queries
// ──────────────────────────────────────────────

export function useImportJobs(filter: ImportJobFilter = {}) {
  return useQuery({
    queryKey: importKeys.list(filter),
    queryFn: () => importService.list(filter),
    staleTime: 30 * 1000, // 30s
  });
}

export function useImportJob(id: string) {
  return useQuery({
    queryKey: importKeys.detail(id),
    queryFn: () => importService.getById(id),
    enabled: !!id,
  });
}

// ──────────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────────

export function useUpdateDraft(importJobId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDraftPayload) => importService.updateDraft(importJobId, payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: importKeys.detail(importJobId) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success("Draft updated successfully");
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update draft";
      toast.error(message);
    },
  });
}

export function useApproveImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => importService.approve(id),
    onSuccess: (_, id) => {
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success("Keyboard published successfully");
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Approval failed";
      toast.error(message);
    },
  });
}

export function useBulkApproveImports() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkApprovePayload) => importService.bulkApprove(payload),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      const { succeeded, failed } = result.data;
      if (succeeded.length > 0) {
        toast.success(`${succeeded.length} keyboards published successfully`);
      }
      if (failed.length > 0) {
        toast.error(`${failed.length} items failed to publish`);
      }
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Bulk approve failed";
      toast.error(message);
    },
  });
}

export function useRejectImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => importService.reject(id, reason),
    onSuccess: (_, { id }) => {
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.success("Import job rejected");
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Rejection failed";
      toast.error(message);
    },
  });
}

export function useReprocessImport() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => importService.reprocess(id),
    onSuccess: (_, id) => {
      client.invalidateQueries({ queryKey: importKeys.detail(id) });
      client.invalidateQueries({ queryKey: [...importKeys.all, "list"] });
      toast.info("Import job queued for reprocessing");
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to reprocess";
      toast.error(message);
    },
  });
}

export function useResetImports() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => importService.reset(),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: importKeys.all });
      toast.success(`Đã xóa sạch ${result.data.deletedCount} import jobs`);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Reset failed";
      toast.error(message);
    },
  });
}
