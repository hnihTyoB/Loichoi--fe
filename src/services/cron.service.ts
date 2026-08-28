import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { CronJob } from "@/types/admin.types";

export const cronService = {
  async getJobs(search?: string): Promise<CronJob[]> { const response = await apiClient.get<ApiResponse<CronJob[]>>("/cron/jobs", { params: { search: search || undefined } }); return response.data.data; },
  async trigger(name: string, params: Record<string, unknown> = {}): Promise<unknown> { const response = await apiClient.post<ApiResponse<unknown>>(`/cron/jobs/${encodeURIComponent(name)}/trigger`, { params }); return response.data.data; },
  async toggleJob(name: string, enabled: boolean): Promise<CronJob> { const response = await apiClient.patch<ApiResponse<CronJob>>(`/cron/jobs/${encodeURIComponent(name)}/toggle`, { enabled }); return response.data.data; },
};

