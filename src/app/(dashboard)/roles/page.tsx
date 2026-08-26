"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Plus, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { rbacService } from "@/services/rbac.service";
import type { Role } from "@/types/rbac.types";

const schema = z.object({
  name: z.string().min(2).max(50).regex(/^[A-Z0-9_]+$/, "Chỉ dùng chữ hoa, số và dấu gạch dưới"),
  description: z.string().max(255),
});
type Values = z.infer<typeof schema>;

export default function RolesPage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const roles = useQuery({ queryKey: ["roles", "list"], queryFn: rbacService.getRoles });
  const create = useMutation({
    mutationFn: (values: Values) => rbacService.createRole({ ...values, permissionIds: [] }),
    onSuccess: () => {
      toast.success(isMounted ? t.adminRoles.createRoleSuccess : "Đã tạo vai trò");
      setOpen(false);
      reset();
      client.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: rbacService.deleteRole,
    onSuccess: () => {
      toast.success(isMounted ? t.adminRoles.deleteRoleSuccess : "Đã xóa vai trò");
      setDeleting(null);
      client.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PermissionGate permission={PERMISSIONS.ROLE_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Shield}
          title={isMounted ? t.adminRoles.title : "Vai trò và phân quyền"}
          description={isMounted ? t.adminRoles.description : "Quản lý vai trò tùy biến và ma trận quyền theo tài nguyên."}
          actions={
            <PermissionGate permission={PERMISSIONS.ROLE_CREATE}>
              <Button onClick={() => setOpen(true)}>
                <Plus />
                {isMounted ? t.adminRoles.createRole : "Tạo vai trò"}
              </Button>
            </PermissionGate>
          }
        />
        <AsyncState
          loading={roles.isLoading}
          error={roles.isError}
          empty={!roles.isLoading && !roles.isError && !roles.data?.length}
          emptyText={isMounted ? t.adminRoles.noRoles : "Chưa có vai trò"}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roles.data?.map((role) => (
            <Card key={role.id}>
              <CardContent className="pt-6 md:pt-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/30">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h2 className="font-black text-kawaii-mocha">{role.name}</h2>
                  </div>
                  <Badge variant={role.isSystem ? "secondary" : "outline"}>
                    {role.isSystem
                      ? (isMounted ? t.adminRoles.systemRole : "Hệ thống")
                      : (isMounted ? t.adminRoles.customRole : "Tùy biến")}
                  </Badge>
                </div>
                <p className="mt-4 min-h-10 text-sm text-kawaii-mocha/60">
                  {role.description || (isMounted ? t.adminRoles.noDesc : "Chưa có mô tả")}
                </p>
                <p className="mt-4 text-sm font-bold text-kawaii-mocha">
                  {role.permissions?.length ?? 0} {isMounted ? t.adminRoles.permsCount : "quyền"}
                </p>
                <div className="mt-5 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/roles/${role.id}`}>
                      {isMounted ? t.adminRoles.openMatrix : "Mở ma trận"}
                      <ArrowRight />
                    </Link>
                  </Button>
                  {!role.isSystem && (
                    <PermissionGate permission={PERMISSIONS.ROLE_DELETE}>
                      <Button variant="destructive" size="icon" onClick={() => setDeleting(role)} aria-label={isMounted ? t.adminUi.delete : "Xóa"}>
                        <Trash2 />
                      </Button>
                    </PermissionGate>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? t.adminRoles.createTitle : "Tạo vai trò tùy biến"}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminRoles.createDesc : "Sau khi tạo, mở ma trận để gán quyền."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit((values) => create.mutate(values))}>
              <Field label={isMounted ? t.adminRoles.roleNameLabel : "Tên vai trò"} error={errors.name?.message}>
                <Input {...register("name")} placeholder="CONTENT_MANAGER" />
              </Field>
              <Field label={isMounted ? t.adminRoles.descLabel : "Mô tả"} error={errors.description?.message}>
                <Textarea {...register("description")} />
              </Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {isMounted ? t.adminUi.cancel : "Hủy"}
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending
                    ? (isMounted ? t.adminUi.processing : "Đang tạo...")
                    : (isMounted ? t.adminRoles.createBtn : "Tạo vai trò")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(next) => !next && setDeleting(null)}
          title={isMounted ? t.adminRoles.deleteTitle : "Xóa vai trò?"}
          description={isMounted ? t.adminRoles.deleteDesc : "Chỉ vai trò tùy biến không còn người dùng mới có thể xóa."}
          busy={remove.isPending}
          onConfirm={() => deleting && remove.mutate(deleting.id)}
        />
      </div>
    </PermissionGate>
  );
}

