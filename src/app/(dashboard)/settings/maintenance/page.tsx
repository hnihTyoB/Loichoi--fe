"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Construction, Power, Save } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, Field, PageHeader, selectClassName } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { systemService } from "@/services/system.service";

const schema = z.object({
  status: z.enum(["MAINTENANCE", "READ_ONLY"]),
  title: z.string().min(3).max(200),
  message: z.string().min(3).max(2000),
  startAt: z.string(),
  estimatedEndAt: z.string(),
  bypassPermissions: z.string(),
  bypassRoles: z.string(),
  bypassIps: z.string(),
});
type Values = z.infer<typeof schema>;
const lines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
const localDate = (value?: string | null) => (value ? new Date(value).toISOString().slice(0, 16) : "");

export default function MaintenancePage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const status = useQuery({ queryKey: ["maintenance"], queryFn: systemService.getMaintenance });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "MAINTENANCE",
      title: "Hệ thống đang bảo trì",
      message: "Hệ thống đang được nâng cấp. Vui lòng quay lại sau.",
      startAt: "",
      estimatedEndAt: "",
      bypassPermissions: "MAINTENANCE_MANAGE\nMAINTENANCE_BYPASS",
      bypassRoles: "ADMIN",
      bypassIps: "",
    },
  });

  useEffect(() => {
    if (status.data) {
      reset({
        status: status.data.status === "READ_ONLY" ? "READ_ONLY" : "MAINTENANCE",
        title: status.data.title,
        message: status.data.message,
        startAt: localDate(status.data.startAt),
        estimatedEndAt: localDate(status.data.estimatedEndAt),
        bypassPermissions: status.data.bypassPermissions.join("\n"),
        bypassRoles: status.data.bypassRoles.join("\n"),
        bypassIps: status.data.bypassIps.join("\n"),
      });
    }
  }, [status.data, reset]);

  const payload = (values: Values) => ({
    status: values.status,
    title: values.title,
    message: values.message,
    startAt: values.startAt ? new Date(values.startAt).toISOString() : null,
    estimatedEndAt: values.estimatedEndAt ? new Date(values.estimatedEndAt).toISOString() : null,
    bypassPermissions: lines(values.bypassPermissions),
    bypassRoles: lines(values.bypassRoles),
    bypassIps: lines(values.bypassIps),
  });

  const save = useMutation({
    mutationFn: (values: Values) =>
      status.data?.enabled ? systemService.updateMaintenance(payload(values)) : systemService.enableMaintenance(payload(values)),
    onSuccess: () => {
      toast.success(
        status.data?.enabled
          ? (isMounted ? t.adminSettings.maintenanceUpdatedSuccess : "Đã cập nhật cấu hình bảo trì")
          : (isMounted ? t.adminSettings.maintenanceEnabledSuccess : "Đã bật chế độ bảo trì"),
      );
      client.invalidateQueries({ queryKey: ["maintenance"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const disable = useMutation({
    mutationFn: systemService.disableMaintenance,
    onSuccess: () => {
      toast.success(isMounted ? t.adminSettings.maintenanceDisabledSuccess : "Hệ thống đã trở lại trực tuyến");
      client.invalidateQueries({ queryKey: ["maintenance"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (status.isLoading) return <AsyncState loading />;
  if (status.isError || !status.data) return <AsyncState error />;

  return (
    <PermissionGate permissions={[PERMISSIONS.MAINTENANCE_READ, PERMISSIONS.MAINTENANCE_MANAGE]} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Construction}
          title={isMounted ? t.adminSettings.maintenanceTitle : "Điều khiển bảo trì"}
          description={isMounted ? t.adminSettings.maintenanceDesc : "Chặn toàn bộ thao tác hoặc chỉ cho phép đọc, với ngoại lệ kiểm soát rõ ràng."}
          actions={<Badge variant={status.data.enabled ? "destructive" : "default"}>{status.data.enabled ? status.data.status : "ONLINE"}</Badge>}
        />
        <Card>
          <CardContent className="pt-6 md:pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-kawaii-mocha">
                  {status.data.enabled
                    ? (isMounted ? t.adminSettings.maintenanceActiveNotice : "Chế độ bảo trì đang bật")
                    : (isMounted ? t.adminSettings.maintenanceOnlineNotice : "Hệ thống đang trực tuyến")}
                </p>
                <p className="text-sm text-kawaii-mocha/60">
                  {isMounted ? t.adminSettings.maintenanceImmediateEffect : "Thay đổi có hiệu lực ngay trên toàn hệ thống."}
                </p>
              </div>
              <PermissionGate permission={PERMISSIONS.MAINTENANCE_MANAGE}>
                {status.data.enabled && (
                  <Button variant="outline" disabled={disable.isPending} onClick={() => disable.mutate()}>
                    <Power />
                    {disable.isPending
                      ? (isMounted ? t.adminSettings.turningOff : "Đang tắt...")
                      : (isMounted ? t.adminSettings.turnOffMaintenance : "Tắt bảo trì")}
                  </Button>
                )}
              </PermissionGate>
            </div>
          </CardContent>
        </Card>
        <PermissionGate permission={PERMISSIONS.MAINTENANCE_MANAGE}>
          <Card>
            <CardContent className="pt-6 md:pt-8">
              <form className="space-y-5" onSubmit={handleSubmit((values) => save.mutate(values))}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={isMounted ? t.adminSettings.maintenanceModeLabel : "Chế độ"}>
                    <select className={selectClassName} {...register("status")}>
                      <option value="MAINTENANCE">{isMounted ? t.adminSettings.modeBlockAll : "Chặn toàn bộ"}</option>
                      <option value="READ_ONLY">{isMounted ? t.adminSettings.modeReadOnly : "Chỉ đọc"}</option>
                    </select>
                  </Field>
                  <Field label={isMounted ? t.adminSettings.maintenanceTitleLabel : "Tiêu đề"} error={errors.title?.message}>
                    <Input {...register("title")} />
                  </Field>
                </div>
                <Field label={isMounted ? t.adminSettings.maintenanceMessageLabel : "Thông điệp"} error={errors.message?.message}>
                  <Textarea {...register("message")} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={isMounted ? t.adminSettings.maintenanceStartLabel : "Bắt đầu"}>
                    <Input type="datetime-local" {...register("startAt")} />
                  </Field>
                  <Field label={isMounted ? t.adminSettings.maintenanceEstEndLabel : "Dự kiến kết thúc"}>
                    <Input type="datetime-local" {...register("estimatedEndAt")} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label={isMounted ? t.adminSettings.bypassPermsLabel : "Quyền bỏ qua, mỗi dòng một quyền"}>
                    <Textarea {...register("bypassPermissions")} />
                  </Field>
                  <Field label={isMounted ? t.adminSettings.bypassRolesLabel : "Vai trò bỏ qua, mỗi dòng một role"}>
                    <Textarea {...register("bypassRoles")} />
                  </Field>
                  <Field label={isMounted ? t.adminSettings.bypassIpsLabel : "IP/CIDR whitelist, mỗi dòng một mục"}>
                    <Textarea {...register("bypassIps")} />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={save.isPending}>
                    <Save />
                    {save.isPending
                      ? (isMounted ? t.adminUi.saving : "Đang áp dụng...")
                      : status.data.enabled
                        ? (isMounted ? t.adminSettings.saveConfigBtn : "Lưu cấu hình")
                        : (isMounted ? t.adminSettings.saveAndEnableMaintenance : "Lưu và bật bảo trì")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </PermissionGate>
      </div>
    </PermissionGate>
  );
}

