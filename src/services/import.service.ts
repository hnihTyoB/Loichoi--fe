import { apiClient } from "@/lib/api-client";
import type {
  ImportJobDto,
  ImportJobListResponse,
  ImportJobFilter,
  CreateImportJobPayload,
  UpdateDraftPayload,
  BulkApprovePayload,
  BulkApproveResult,
  ApproveResult,
} from "@/types/import.types";

const BASE = "/imports";

export const importService = {
  // GET /imports — list with filters
  async list(filter: ImportJobFilter = {}): Promise<ImportJobListResponse> {
    const params: Record<string, string | number | boolean> = {};
    if (filter.status) params["status"] = filter.status;
    if (filter.validationStatus) params["validationStatus"] = filter.validationStatus;
    if (filter.isDuplicateCandidate !== undefined) params["isDuplicateCandidate"] = filter.isDuplicateCandidate;
    if (filter.minConfidence !== undefined) params["minConfidence"] = filter.minConfidence;
    if (filter.hasFlags !== undefined) params["hasFlags"] = filter.hasFlags;
    if (filter.page) params["page"] = filter.page;
    if (filter.limit) params["limit"] = filter.limit;

    const response = await apiClient.get<ImportJobListResponse>(BASE, { params });
    return response.data;
  },

  // GET /imports/:id — detail
  async getById(id: string): Promise<{ success: boolean; data: ImportJobDto }> {
    const response = await apiClient.get<{ success: boolean; data: ImportJobDto }>(`${BASE}/${id}`);
    return response.data;
  },

  // POST /imports — create import job (manual input)
  async create(payload: CreateImportJobPayload): Promise<{ success: boolean; data: { importJobId: string; isNew: boolean } }> {
    const response = await apiClient.post<{ success: boolean; data: { importJobId: string; isNew: boolean } }>(BASE, payload);
    return response.data;
  },

  // PATCH /imports/:id/draft — update draft
  async updateDraft(id: string, payload: UpdateDraftPayload): Promise<{ success: boolean; data: unknown }> {
    const response = await apiClient.patch<{ success: boolean; data: unknown }>(`${BASE}/${id}/draft`, payload);
    return response.data;
  },

  // POST /imports/:id/approve — single approve
  async approve(id: string): Promise<{ success: boolean; data: ApproveResult }> {
    const response = await apiClient.post<{ success: boolean; data: ApproveResult }>(`${BASE}/${id}/approve`);
    return response.data;
  },

  // POST /imports/bulk-approve
  async bulkApprove(payload: BulkApprovePayload): Promise<{ success: boolean; data: BulkApproveResult }> {
    const response = await apiClient.post<{ success: boolean; data: BulkApproveResult }>(`${BASE}/bulk-approve`, payload);
    return response.data;
  },

  // POST /imports/:id/reject
  async reject(id: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`${BASE}/${id}/reject`, { reason });
    return response.data;
  },

  // POST /imports/:id/reprocess
  async reprocess(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`${BASE}/${id}/reprocess`);
    return response.data;
  },

  // DELETE /imports/reset
  async reset(): Promise<{ success: boolean; data: { deletedCount: number } }> {
    const response = await apiClient.delete<{ success: boolean; data: { deletedCount: number } }>(`${BASE}/reset`);
    return response.data;
  },
};
