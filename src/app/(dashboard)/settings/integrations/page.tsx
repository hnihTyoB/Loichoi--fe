"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Edit3, Eye, KeyRound, Plus, RefreshCcw, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/utils";
import { integrationService } from "@/services/integration.service";
import type { ApiKeyItem, WebhookDelivery, WebhookEndpoint } from "@/types/admin.types";

const apiKeySchema = z.object({
  name: z.string().min(2).max(100),
  permissions: z.string(),
  expiresAt: z.string(),
});
const webhookSchema = z.object({
  url: z.string().url("URL không hợp lệ"),
  description: z.string().max(500),
  secret: z.string(),
  events: z.string().min(1, "Cần ít nhất một event"),
});
type ApiKeyValues = z.infer<typeof apiKeySchema>;
type WebhookValues = z.infer<typeof webhookSchema>;

export default function IntegrationsSettingsPage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const [apiOpen, setApiOpen] = useState(false);
  const [plainKey, setPlainKey] = useState("");
  const [plainSecret, setPlainSecret] = useState("");
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [deleteApi, setDeleteApi] = useState<ApiKeyItem | null>(null);
  const [deleteWebhook, setDeleteWebhook] = useState<WebhookEndpoint | null>(null);
  const [deliveryWebhook, setDeliveryWebhook] = useState<WebhookEndpoint | null>(null);

  const apiForm = useForm<ApiKeyValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { name: "", permissions: "", expiresAt: "" },
  });
  const webhookForm = useForm<WebhookValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { url: "", description: "", secret: "", events: "system.ping\njob.completed\njob.failed" },
  });

  const apiKeys = useQuery({ queryKey: ["integrations", "api-keys"], queryFn: integrationService.getApiKeys });
  const webhooks = useQuery({ queryKey: ["integrations", "webhooks"], queryFn: integrationService.getWebhooks });
  const deliveries = useQuery({
    queryKey: ["integrations", "deliveries", deliveryWebhook?.id],
    queryFn: () => integrationService.getDeliveries(deliveryWebhook!.id),
    enabled: Boolean(deliveryWebhook),
  });

  const refreshApi = () => client.invalidateQueries({ queryKey: ["integrations", "api-keys"] });
  const refreshWebhooks = () => client.invalidateQueries({ queryKey: ["integrations", "webhooks"] });

  const createApi = useMutation({
    mutationFn: (values: ApiKeyValues) =>
      integrationService.createApiKey({
        name: values.name,
        permissions: values.permissions.split("\n").map((item) => item.trim()).filter(Boolean),
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
      }),
    onSuccess: (data) => {
      setPlainKey(data.key);
      setApiOpen(false);
      apiForm.reset();
      refreshApi();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const toggleApi = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => integrationService.toggleApiKey(id, active),
    onSuccess: () => {
      toast.success(isMounted ? t.adminSettings.apiKeyUpdatedSuccess : "Đã cập nhật API key");
      refreshApi();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeApi = useMutation({
    mutationFn: integrationService.deleteApiKey,
    onSuccess: () => {
      toast.success(isMounted ? t.adminSettings.apiKeyRevokedSuccess : "Đã thu hồi API key");
      setDeleteApi(null);
      refreshApi();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const saveWebhook = useMutation({
    mutationFn: async (values: WebhookValues) => {
      const payload = {
        url: values.url,
        description: values.description || undefined,
        secret: values.secret || undefined,
        events: values.events.split("\n").map((item) => item.trim()).filter(Boolean),
      };
      if (editingWebhook) {
        await integrationService.updateWebhook(editingWebhook.id, payload);
        return null;
      }
      return integrationService.createWebhook(payload);
    },
    onSuccess: (created) => {
      toast.success(editingWebhook ? (isMounted ? t.adminSettings.webhookUpdatedSuccess : "Đã cập nhật webhook") : (isMounted ? t.adminSettings.webhookCreatedSuccess : "Đã tạo webhook"));
      if (created?.secret) setPlainSecret(created.secret);
      setWebhookOpen(false);
      setEditingWebhook(null);
      webhookForm.reset();
      refreshWebhooks();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeHook = useMutation({
    mutationFn: integrationService.deleteWebhook,
    onSuccess: () => {
      toast.success(isMounted ? t.adminSettings.webhookDeletedSuccess : "Đã xóa webhook");
      setDeleteWebhook(null);
      refreshWebhooks();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const testHook = useMutation({
    mutationFn: integrationService.testWebhook,
    onSuccess: () => toast.success(isMounted ? t.adminSettings.testWebhookSuccess : "Webhook phản hồi thành công"),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const retry = useMutation({
    mutationFn: integrationService.retryDelivery,
    onSuccess: () => {
      toast.success(isMounted ? t.adminSettings.deliveryRetriedSuccess : "Đã gửi lại delivery");
      deliveries.refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const editHook = (item: WebhookEndpoint) => {
    setEditingWebhook(item);
    webhookForm.reset({ url: item.url, description: item.description ?? "", secret: "", events: item.events.join("\n") });
    setWebhookOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={KeyRound}
        title={isMounted ? t.adminSettings.integrationsTitle : "API Keys và Webhooks"}
        description={isMounted ? t.adminSettings.integrationsDesc : "Quản lý thông tin xác thực đối tác và lịch sử phát sự kiện."}
      />
      <Tabs defaultValue="api">
        <TabsList>
          <TabsTrigger value="api">{isMounted ? t.adminSettings.tabApiKeys : "API Keys"}</TabsTrigger>
          <TabsTrigger value="webhooks">{isMounted ? t.adminSettings.tabWebhooks : "Webhooks"}</TabsTrigger>
        </TabsList>
        <TabsContent value="api">
          <PermissionGate permission={PERMISSIONS.API_KEY_READ} fallback={<AsyncState error />}>
            <div className="space-y-4">
              <div className="flex justify-end">
                <PermissionGate permission={PERMISSIONS.API_KEY_MANAGE}>
                  <Button onClick={() => setApiOpen(true)}>
                    <Plus />
                    {isMounted ? t.adminSettings.createApiKeyBtn : "Tạo API key"}
                  </Button>
                </PermissionGate>
              </div>
              <AsyncState
                loading={apiKeys.isLoading}
                error={apiKeys.isError}
                empty={!apiKeys.isLoading && !apiKeys.isError && !apiKeys.data?.length}
                emptyText={isMounted ? t.adminSettings.noApiKeys : "Chưa có API key"}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {apiKeys.data?.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 md:pt-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="font-black text-kawaii-mocha">{item.name}</h2>
                          <p className="font-mono text-xs text-kawaii-mocha/55">{item.prefix}••••••••</p>
                        </div>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive
                            ? (isMounted ? t.adminSettings.active : "Hoạt động")
                            : (isMounted ? t.adminSettings.disabled : "Đã tắt")}
                        </Badge>
                      </div>
                      <p className="mt-4 text-xs text-kawaii-mocha/60">
                        {isMounted ? t.adminSettings.permissionsPrefix : "Quyền:"} {item.permissions.join(", ") || (isMounted ? t.adminSettings.unlimitedPerms : "Không giới hạn khai báo")}
                      </p>
                      <p className="mt-2 text-xs text-kawaii-mocha/50">
                        {isMounted ? t.adminSettings.lastUsedPrefix : "Dùng gần nhất:"} {item.lastUsedAt ? formatDate(item.lastUsedAt) : (isMounted ? t.adminSettings.neverUsed : "Chưa từng")}
                      </p>
                      <div className="mt-5 flex justify-end gap-2">
                        <PermissionGate permission={PERMISSIONS.API_KEY_MANAGE}>
                          <Button variant="outline" size="sm" onClick={() => toggleApi.mutate({ id: item.id, active: !item.isActive })}>
                            {item.isActive ? (isMounted ? t.adminSettings.disableBtn : "Tắt") : (isMounted ? t.adminSettings.enableBtn : "Bật")}
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => setDeleteApi(item)} aria-label={isMounted ? t.adminSettings.revokeBtn : "Thu hồi"}>
                            <Trash2 />
                          </Button>
                        </PermissionGate>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PermissionGate>
        </TabsContent>
        <TabsContent value="webhooks">
          <PermissionGate permission={PERMISSIONS.WEBHOOK_READ} fallback={<AsyncState error />}>
            <div className="space-y-4">
              <div className="flex justify-end">
                <PermissionGate permission={PERMISSIONS.WEBHOOK_MANAGE}>
                  <Button
                    onClick={() => {
                      setEditingWebhook(null);
                      webhookForm.reset();
                      setWebhookOpen(true);
                    }}
                  >
                    <Plus />
                    {isMounted ? t.adminSettings.createWebhookBtn : "Tạo webhook"}
                  </Button>
                </PermissionGate>
              </div>
              <AsyncState
                loading={webhooks.isLoading}
                error={webhooks.isError}
                empty={!webhooks.isLoading && !webhooks.isError && !webhooks.data?.length}
                emptyText={isMounted ? t.adminSettings.noWebhooks : "Chưa có webhook"}
              />
              <div className="space-y-3">
                {webhooks.data?.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 md:pt-8">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                              {item.isActive
                                ? (isMounted ? t.adminSettings.active : "Hoạt động")
                                : (isMounted ? t.adminSettings.disabled : "Đã tắt")}
                            </Badge>
                            <p className="truncate font-mono text-xs font-bold text-kawaii-mocha">{item.url}</p>
                          </div>
                          <p className="mt-2 text-xs text-kawaii-mocha/55">{item.events.join(", ")}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDeliveryWebhook(item)}>
                            <Eye />
                            {isMounted ? t.adminSettings.deliveryBtn : "Delivery"}
                          </Button>
                          <PermissionGate permission={PERMISSIONS.WEBHOOK_MANAGE}>
                            <Button variant="outline" size="sm" onClick={() => testHook.mutate(item.id)}>
                              <Send />
                              {isMounted ? t.adminSettings.testBtn : "Test"}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => editHook(item)} aria-label={isMounted ? t.adminUi.edit : "Sửa"}>
                              <Edit3 />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => setDeleteWebhook(item)} aria-label={isMounted ? t.adminUi.delete : "Xóa"}>
                              <Trash2 />
                            </Button>
                          </PermissionGate>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PermissionGate>
        </TabsContent>
      </Tabs>
      <Dialog open={apiOpen} onOpenChange={setApiOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">
              {isMounted ? t.adminSettings.createApiKeyTitle : "Tạo API key"}
            </DialogTitle>
            <DialogDescription>
              {isMounted ? t.adminSettings.createApiKeyDesc : "Key chỉ hiển thị một lần sau khi tạo."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={apiForm.handleSubmit((values) => createApi.mutate(values))}>
            <Field label={isMounted ? t.adminSettings.keyNameLabel : "Tên"} error={apiForm.formState.errors.name?.message}>
              <Input {...apiForm.register("name")} />
            </Field>
            <Field label={isMounted ? t.adminSettings.keyPermissionsLabel : "Quyền, mỗi dòng một quyền"}>
              <Textarea {...apiForm.register("permissions")} placeholder="USER_READ" />
            </Field>
            <Field label={isMounted ? t.adminSettings.keyExpiresAtLabel : "Hết hạn"}>
              <Input type="datetime-local" {...apiForm.register("expiresAt")} />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setApiOpen(false)}>
                {isMounted ? t.adminUi.cancel : "Hủy"}
              </Button>
              <Button type="submit" disabled={createApi.isPending}>
                {createApi.isPending
                  ? (isMounted ? t.adminUi.processing : "Đang tạo...")
                  : (isMounted ? t.adminSettings.createKeyBtn : "Tạo key")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(plainKey)} onOpenChange={(next) => !next && setPlainKey("")}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">
              {isMounted ? t.adminSettings.copyApiKeyTitle : "Sao chép API key ngay"}
            </DialogTitle>
            <DialogDescription>
              {isMounted ? t.adminSettings.copyApiKeyDesc : "Sau khi đóng hộp thoại này, secret sẽ không được hiển thị lại."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={plainKey} className="font-mono" />
            <Button
              size="icon"
              onClick={() =>
                navigator.clipboard.writeText(plainKey).then(() => toast.success(isMounted ? t.adminSettings.copiedSuccess : "Đã sao chép"))
              }
            >
              <Copy />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(plainSecret)} onOpenChange={(next) => !next && setPlainSecret("")}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">
              {isMounted ? t.adminSettings.copyWebhookSecretTitle : "Sao chép webhook secret ngay"}
            </DialogTitle>
            <DialogDescription>
              {isMounted ? t.adminSettings.copyWebhookSecretDesc : "Secret ký payload chỉ hiển thị một lần sau khi tạo."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={plainSecret} className="font-mono" />
            <Button
              size="icon"
              onClick={() =>
                navigator.clipboard.writeText(plainSecret).then(() => toast.success(isMounted ? t.adminSettings.copiedSuccess : "Đã sao chép"))
              }
            >
              <Copy />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={webhookOpen} onOpenChange={setWebhookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">
              {editingWebhook
                ? (isMounted ? t.adminSettings.editWebhookTitle : "Chỉnh sửa webhook")
                : (isMounted ? t.adminSettings.createWebhookTitle : "Tạo webhook")}
            </DialogTitle>
            <DialogDescription>
              {isMounted ? t.adminSettings.webhookEventsDesc : "Mỗi event đặt trên một dòng; dùng * để nhận tất cả."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={webhookForm.handleSubmit((values) => saveWebhook.mutate(values))}>
            <Field label={isMounted ? t.adminSettings.endpointUrlLabel : "Endpoint URL"} error={webhookForm.formState.errors.url?.message}>
              <Input {...webhookForm.register("url")} />
            </Field>
            <Field label={isMounted ? t.adminSettings.eventsLabel : "Events"} error={webhookForm.formState.errors.events?.message}>
              <Textarea {...webhookForm.register("events")} />
            </Field>
            <Field label={isMounted ? t.adminSettings.descLabel : "Mô tả"}>
              <Textarea {...webhookForm.register("description")} />
            </Field>
            <Field label={isMounted ? t.adminSettings.secretOptionalLabel : "Secret tùy chọn"}>
              <Input type="password" {...webhookForm.register("secret")} />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setWebhookOpen(false)}>
                {isMounted ? t.adminUi.cancel : "Hủy"}
              </Button>
              <Button type="submit" disabled={saveWebhook.isPending}>
                {saveWebhook.isPending
                  ? (isMounted ? t.adminUi.saving : "Đang lưu...")
                  : (isMounted ? t.adminSettings.saveWebhookBtn : "Lưu webhook")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(deliveryWebhook)} onOpenChange={(next) => !next && setDeliveryWebhook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">
              {isMounted ? t.adminSettings.deliveryHistoryTitle : "Lịch sử delivery"}
            </DialogTitle>
            <DialogDescription>{deliveryWebhook?.url}</DialogDescription>
          </DialogHeader>
          <AsyncState
            loading={deliveries.isLoading}
            error={deliveries.isError}
            empty={!deliveries.isLoading && !deliveries.isError && !deliveries.data?.data.length}
            emptyText={isMounted ? t.adminSettings.noDeliveries : "Chưa có delivery"}
          />
          <div className="space-y-2">
            {deliveries.data?.data.map((item: WebhookDelivery) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-kawaii-sky/40 p-3">
                <div>
                  <div className="flex gap-2">
                    <Badge variant={item.status === "SUCCESS" ? "default" : item.status === "FAILED" ? "destructive" : "secondary"}>
                      {item.status}
                    </Badge>
                    <span className="text-xs font-bold text-kawaii-mocha">HTTP {item.statusCode ?? "—"}</span>
                  </div>
                  <p className="mt-1 text-xs text-kawaii-mocha/55">
                    {item.event} · {item.attempts} {isMounted ? t.adminSettings.attemptsCount : "lần thử"}
                  </p>
                  {item.lastError && <p className="mt-1 text-xs text-destructive">{item.lastError}</p>}
                </div>
                {item.status === "FAILED" && (
                  <PermissionGate permission={PERMISSIONS.WEBHOOK_MANAGE}>
                    <Button size="sm" variant="outline" disabled={retry.isPending} onClick={() => retry.mutate(item.id)}>
                      <RefreshCcw />
                      {isMounted ? t.adminSettings.retryBtn : "Thử lại"}
                    </Button>
                  </PermissionGate>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={Boolean(deleteApi)}
        onOpenChange={(next) => !next && setDeleteApi(null)}
        title={isMounted ? t.adminSettings.revokeApiKeyTitle : "Thu hồi API key?"}
        description={isMounted ? t.adminSettings.revokeApiKeyDesc : "Các client đang dùng key này sẽ mất quyền truy cập ngay."}
        busy={removeApi.isPending}
        onConfirm={() => deleteApi && removeApi.mutate(deleteApi.id)}
      />
      <ConfirmDialog
        open={Boolean(deleteWebhook)}
        onOpenChange={(next) => !next && setDeleteWebhook(null)}
        title={isMounted ? t.adminSettings.deleteWebhookTitle : "Xóa webhook?"}
        description={isMounted ? t.adminSettings.deleteWebhookDesc : "Endpoint và cấu hình sự kiện sẽ bị xóa."}
        busy={removeHook.isPending}
        onConfirm={() => deleteWebhook && removeHook.mutate(deleteWebhook.id)}
      />
    </div>
  );
}
