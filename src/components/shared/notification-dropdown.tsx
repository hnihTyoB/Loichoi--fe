"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Bell, BellRing, CheckCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStream } from "@/hooks/use-notification-stream";
import { useTranslation } from "@/hooks/use-translation";
import { cn, formatDate } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import type { NotificationItem } from "@/types/admin.types";

const previewLimit = 6;

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const { t, isMounted } = useTranslation();
  const { unreadCount } = useNotificationStream(true);
  const notifications = useQuery({
    queryKey: ["notifications", "header-preview"],
    queryFn: () => notificationService.getNotifications({ page: 1, limit: previewLimit }),
    enabled: open,
    staleTime: 30_000,
  });

  const refreshNotifications = () => client.invalidateQueries({ queryKey: ["notifications"] });
  const markRead = useMutation({ mutationFn: notificationService.markRead, onSuccess: refreshNotifications });
  const markAllRead = useMutation({ mutationFn: notificationService.markAllRead, onSuccess: refreshNotifications });

  const markItemRead = (item: NotificationItem) => {
    if (!item.isRead && !markRead.isPending) markRead.mutate(item.id);
  };

  const notificationContent = (item: NotificationItem) => (
    <div className="flex min-w-0 flex-1 items-start gap-3 py-1">
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-inner",
          item.isRead ? "bg-kawaii-cloud text-kawaii-mocha/55" : "bg-kawaii-sky/60 text-kawaii-warmbrown",
        )}
      >
        {item.isRead ? <Bell className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className={cn("line-clamp-1 flex-1 text-sm text-kawaii-mocha", item.isRead ? "font-semibold" : "font-black")}>{item.title}</p>
          {!item.isRead ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-kawaii-pink" aria-label={isMounted ? t.notifications.newLabel : "Thông báo mới"} /> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-kawaii-mocha/60">{item.content}</p>
        <p className="mt-1.5 text-[10px] font-bold text-kawaii-mocha/45">{formatDate(item.createdAt)}</p>
      </div>
    </div>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isMounted ? t.notifications.openLabel : "Mở thông báo"}
          title={isMounted ? t.notifications.openLabel : "Mở thông báo"}
          className="relative rounded-full"
        >
          <Bell className="h-4 w-4 text-kawaii-mocha" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-kawaii-pink px-1 text-[10px] font-black text-kawaii-mocha">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-[calc(100vw-2rem)] max-w-96 rounded-3xl border-kawaii-sky/60 p-2 shadow-cloud">
        <div className="flex items-center justify-between gap-3 px-2 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-black normal-case tracking-normal text-kawaii-mocha">
            {isMounted ? t.notifications.title : "Thông báo"}
          </DropdownMenuLabel>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={markAllRead.isPending}
              onClick={(event) => {
                event.preventDefault();
                markAllRead.mutate();
              }}
              className="h-8 gap-1.5 rounded-full px-2.5 text-[11px] font-bold"
            >
              {markAllRead.isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              {isMounted ? t.notifications.markAllRead : "Đọc tất cả"}
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator className="bg-kawaii-sky/40" />

        <div className="max-h-[min(28rem,65vh)] overflow-y-auto overscroll-contain pr-1">
          {notifications.isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm font-bold text-kawaii-mocha/55">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              {isMounted ? t.notifications.loading : "Đang tải thông báo..."}
            </div>
          ) : notifications.isError ? (
            <div className="px-4 py-10 text-center text-sm font-bold text-destructive">
              {isMounted ? t.notifications.loadError : "Chưa thể tải thông báo."}
            </div>
          ) : notifications.data?.data.length ? (
            notifications.data.data.map((item) =>
              item.actionUrl ? (
                <DropdownMenuItem key={item.id} asChild className={cn("my-1 items-start rounded-2xl p-2.5", !item.isRead && "bg-kawaii-cloud/70")}>
                  <Link href={item.actionUrl} onClick={() => markItemRead(item)}>
                    {notificationContent(item)}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={item.id}
                  className={cn("my-1 items-start rounded-2xl p-2.5", !item.isRead && "bg-kawaii-cloud/70")}
                  onSelect={() => markItemRead(item)}
                >
                  {notificationContent(item)}
                </DropdownMenuItem>
              ),
            )
          ) : (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/35 text-kawaii-mocha shadow-inner">
                <Bell className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-kawaii-mocha/60">{isMounted ? t.notifications.empty : "Chưa có thông báo"}</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="bg-kawaii-sky/40" />
        <DropdownMenuItem asChild className="mt-1 justify-center rounded-2xl bg-kawaii-sky/30 py-2.5 font-black text-kawaii-mocha focus:bg-kawaii-sky/50">
          <Link href="/notifications">
            {isMounted ? t.notifications.viewAll : "Xem tất cả thông báo"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
