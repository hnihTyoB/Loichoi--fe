import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { EmailItem, NotificationItem, NotificationTemplate, PageResult } from "@/types/admin.types";

export const notificationService = {
  async getNotifications(params: { page?: number; limit?: number; isRead?: boolean; type?: string } = {}): Promise<PageResult<NotificationItem>> { const response = await apiClient.get<PageResult<NotificationItem>>("/notifications", { params }); return response.data; },
  async getUnreadCount(): Promise<number> { const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>("/notifications/unread-count"); return response.data.data.unreadCount; },
  async markRead(id: string): Promise<void> { await apiClient.patch(`/notifications/${id}/read`); },
  async markAllRead(): Promise<void> { await apiClient.patch("/notifications/read-all"); },
  async delete(id: string): Promise<void> { await apiClient.delete(`/notifications/${id}`); },
  async broadcast(payload: { title: string; content: string; type?: string; priority?: string; actionUrl?: string }): Promise<void> { await apiClient.post("/notifications/broadcast", payload); },
  async getEmails(params: { status?: string; toEmail?: string; limit?: number } = {}): Promise<PageResult<EmailItem>> { const response = await apiClient.get<PageResult<EmailItem>>("/notifications/emails", { params }); return response.data; },
  async retryEmail(id: string): Promise<void> { await apiClient.post(`/notifications/emails/${id}/retry`); },
  async getTemplates(params: { search?: string; channel?: string; isActive?: boolean; limit?: number } = {}): Promise<PageResult<NotificationTemplate>> { const response = await apiClient.get<PageResult<NotificationTemplate>>("/notifications/templates", { params }); return response.data; },
  async createTemplate(payload: { code: string; name: string; description?: string; channels: string[]; subject?: string; title?: string; content: string; variables: string[]; isActive: boolean }): Promise<NotificationTemplate> { const response = await apiClient.post<ApiResponse<NotificationTemplate>>("/notifications/templates", payload); return response.data.data; },
  async updateTemplate(id: string, payload: Partial<NotificationTemplate>): Promise<NotificationTemplate> { const response = await apiClient.put<ApiResponse<NotificationTemplate>>(`/notifications/templates/${id}`, payload); return response.data.data; },
  async deleteTemplate(id: string): Promise<void> { await apiClient.delete(`/notifications/templates/${id}`); },
  async previewTemplate(code: string, variables: Record<string, unknown>): Promise<{ subject: string | null; title: string | null; content: string; html?: string }> { const response = await apiClient.post<ApiResponse<{ subject: string | null; title: string | null; content: string; html?: string }>>(`/notifications/templates/${code}/preview`, { variables }); return response.data.data; },
  async testTemplate(code: string, payload: { toEmail?: string; variables: Record<string, unknown>; channels?: string[] }): Promise<void> { await apiClient.post(`/notifications/templates/${code}/test-send`, payload); },
};
