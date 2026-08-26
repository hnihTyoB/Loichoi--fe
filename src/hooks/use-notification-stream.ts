"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { APP_CONFIG } from "@/lib/constants";
import { notificationService } from "@/services/notification.service";

export function useNotificationStream(enabled = true) {
  const client = useQueryClient();
  const count = useQuery({ queryKey: ["notifications", "unread-count"], queryFn: notificationService.getUnreadCount, enabled });
  useEffect(() => {
    if (!enabled) return;
    const stream = new EventSource(`${APP_CONFIG.apiUrl}/notifications/stream`, { withCredentials: true });
    const refresh = () => { client.invalidateQueries({ queryKey: ["notifications"] }); };
    const onNotification = (event: MessageEvent<string>) => {
      try { const data = JSON.parse(event.data) as { title?: string; content?: string }; toast(data.title || "Thông báo mới", { description: data.content }); } catch { toast("Có thông báo mới"); }
      refresh();
    };
    stream.addEventListener("notification:new", onNotification as EventListener);
    stream.addEventListener("notification:broadcast", onNotification as EventListener);
    stream.addEventListener("notification:read", refresh);
    stream.addEventListener("notification:read_all", refresh);
    return () => stream.close();
  }, [client, enabled]);
  return { unreadCount: count.data ?? 0, isLoading: count.isLoading };
}
