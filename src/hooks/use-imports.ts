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
      const succeeded = result?.data?.succeeded ?? (result as unknown as { succeeded?: unknown[] })?.succeeded ?? [];
      const failed = result?.data?.failed ?? (result as unknown as { failed?: unknown[] })?.failed ?? [];

      if (succeeded.length > 0) {
        toast.success(`Đã duyệt và phát hành thành công ${succeeded.length} giao diện bàn phím!`);
      }
      if (failed.length > 0) {
        toast.error(`Có ${failed.length} mục chưa thể phát hành`);
      }
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Duyệt hàng loạt thất bại. Vui lòng thử lại!";
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
