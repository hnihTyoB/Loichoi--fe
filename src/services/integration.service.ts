import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { ApiKeyItem, CreatedApiKey, PageResult, WebhookDelivery, WebhookEndpoint } from "@/types/admin.types";

export const integrationService = {
  async getApiKeys(): Promise<ApiKeyItem[]> { const response = await apiClient.get<ApiResponse<ApiKeyItem[]>>("/integrations/api-keys"); return response.data.data; },
  async createApiKey(payload: { name: string; permissions?: string[]; expiresAt?: string }): Promise<CreatedApiKey> { const response = await apiClient.post<ApiResponse<CreatedApiKey>>("/integrations/api-keys", payload); return response.data.data; },
  async toggleApiKey(id: string, isActive: boolean): Promise<void> { await apiClient.patch(`/integrations/api-keys/${id}/toggle`, { isActive }); },
  async deleteApiKey(id: string): Promise<void> { await apiClient.delete(`/integrations/api-keys/${id}`); },
  async getWebhooks(): Promise<WebhookEndpoint[]> { const response = await apiClient.get<ApiResponse<WebhookEndpoint[]>>("/integrations/webhooks"); return response.data.data; },
  async createWebhook(payload: { url: string; secret?: string; events: string[]; description?: string }): Promise<WebhookEndpoint & { secret?: string }> { const response = await apiClient.post<ApiResponse<WebhookEndpoint & { secret?: string }>>("/integrations/webhooks", payload); return response.data.data; },
  async updateWebhook(id: string, payload: Partial<{ url: string; secret: string; events: string[]; description: string; isActive: boolean }>): Promise<void> { await apiClient.put(`/integrations/webhooks/${id}`, payload); },
  async deleteWebhook(id: string): Promise<void> { await apiClient.delete(`/integrations/webhooks/${id}`); },
  async testWebhook(id: string): Promise<unknown> { const response = await apiClient.post<ApiResponse<unknown>>(`/integrations/webhooks/${id}/test`); return response.data.data; },
  async getDeliveries(id: string): Promise<PageResult<WebhookDelivery>> { const response = await apiClient.get<PageResult<WebhookDelivery>>(`/integrations/webhooks/${id}/deliveries`, { params: { limit: 100 } }); return response.data; },
  async retryDelivery(id: string): Promise<void> { await apiClient.post(`/integrations/webhooks/deliveries/${id}/retry`); },
};
