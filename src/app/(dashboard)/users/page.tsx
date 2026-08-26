"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LockKeyhole, Plus, Search, Trash2, UserCog, Users } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader, selectClassName } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/utils";
import { rbacService } from "@/services/rbac.service";
import { userService } from "@/services/user.service";
import type { User } from "@/types/user.types";

const createSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu cần ít nhất 8 ký tự")
    .regex(/[a-z]/, "Cần chữ thường")
    .regex(/[A-Z]/, "Cần chữ hoa")
    .regex(/[0-9]/, "Cần chữ số")
    .regex(/[^a-zA-Z0-9]/, "Cần ký tự đặc biệt"),
  roleId: z.string().min(1, "Hãy chọn vai trò"),
});
type CreateValues = z.infer<typeof createSchema>;

export default function UsersPage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"email" | "fullName">("email");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [roleId, setRoleId] = useState("");
  const [deleting, setDeleting] = useState<User | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { email: "", password: "", roleId: "" },
  });

  const list = useQuery({
    queryKey: ["users", "list", searchField, search],
    queryFn: () => userService.getUsers({ [searchField]: search || undefined, limit: 100 }),
  });
  const roles = useQuery({ queryKey: ["roles", "list"], queryFn: rbacService.getRoles });
  const users = list.data?.data ?? [];

  const refresh = () => client.invalidateQueries({ queryKey: ["users"] });
  const create = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      toast.success(isMounted ? t.adminUsers.createdSuccess : "Đã tạo người dùng");
      setCreateOpen(false);
      reset();
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: async ({ user, active, nextRole }: { user: User; active: boolean; nextRole: string }) => {
      if (active !== user.isActive) await userService.updateUser(user.id, { isActive: active });
      if (nextRole && nextRole !== user.roleId) await rbacService.assignUserRole(user.id, nextRole);
    },
    onSuccess: () => {
      toast.success(isMounted ? t.adminUsers.updatedSuccess : "Đã cập nhật người dùng");
      setEditing(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      toast.success(isMounted ? t.adminUsers.deletedSuccess : "Đã xóa mềm người dùng");
      setDeleting(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openEdit = (user: User) => {
    setEditing(user);
    setRoleId(user.roleId);
  };

  return (
    <PermissionGate permission={PERMISSIONS.USER_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Users}
          title={isMounted ? t.adminUsers.title : "Quản lý người dùng"}
          description={isMounted ? t.adminUsers.description : "Tạo tài khoản, gán vai trò và kiểm soát trạng thái truy cập."}
          actions={
            <PermissionGate permission={PERMISSIONS.USER_CREATE}>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus />
                {isMounted ? t.adminUsers.addUserBtn : "Thêm người dùng"}
              </Button>
            </PermissionGate>
          }
        />
        <Card>
          <CardContent className="grid max-w-3xl gap-3 pt-6 sm:grid-cols-[180px_1fr] md:pt-8">
            <select
              className={selectClassName}
              value={searchField}
              onChange={(event) => setSearchField(event.target.value as "email" | "fullName")}
            >
              <option value="email">{isMounted ? t.adminUsers.searchEmail : "Tìm theo email"}</option>
              <option value="fullName">{isMounted ? t.adminUsers.searchFullName : "Tìm theo họ tên"}</option>
            </select>
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
              <Input
                className="pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  searchField === "email"
                    ? (isMounted ? t.adminUsers.placeholderEmail : "Nhập email...")
                    : (isMounted ? t.adminUsers.placeholderName : "Nhập họ tên...")
                }
              />
            </label>
          </CardContent>
        </Card>
        <AsyncState
          loading={list.isLoading}
          error={list.isError}
          empty={!list.isLoading && !list.isError && users.length === 0}
          emptyText={isMounted ? t.adminUsers.empty : "Chưa có người dùng"}
        />
        {users.length ? (
          <Card>
            <CardContent className="overflow-x-auto pt-6 md:pt-8">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65">
                    <th className="p-3">{isMounted ? t.adminUsers.colAccount : "Tài khoản"}</th>
                    <th className="p-3">{isMounted ? t.adminUsers.colRole : "Vai trò"}</th>
                    <th className="p-3">{isMounted ? t.adminUsers.colStatus : "Trạng thái"}</th>
                    <th className="p-3">{isMounted ? t.adminUsers.colJoined : "Ngày tham gia"}</th>
                    <th className="p-3 text-right">{isMounted ? t.adminUsers.colActions : "Thao tác"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kawaii-sky/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-kawaii-cloud/30">
                      <td className="p-3">
                        <p className="font-bold text-kawaii-mocha">{user.name || user.email.split("@")[0]}</p>
                        <p className="text-xs text-kawaii-mocha/55">{user.email}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{typeof user.role === "string" ? user.role : user.role?.name || (isMounted ? t.adminUsers.unassigned : "Chưa gán")}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={user.isActive ? "default" : "destructive"}>
                          {user.isActive
                            ? (isMounted ? t.adminUsers.statusActive : "Hoạt động")
                            : (isMounted ? t.adminUsers.statusLocked : "Đã khóa")}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-kawaii-mocha/60">{formatDate(user.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <PermissionGate permissions={[PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_ROLE_ASSIGN]}>
                            <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                              <UserCog />
                              {isMounted ? t.adminUsers.manageBtn : "Quản lý"}
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission={PERMISSIONS.USER_DELETE}>
                            <Button variant="destructive" size="icon" onClick={() => setDeleting(user)} aria-label={isMounted ? t.adminUi.delete : "Xóa"}>
                              <Trash2 />
                            </Button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : null}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? t.adminUsers.createTitle : "Tạo người dùng"}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminUsers.createDesc : "Mật khẩu cần đủ chữ hoa, chữ thường, số và ký tự đặc biệt."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit((values) => create.mutate(values))}>
              <Field label={isMounted ? t.adminUsers.emailLabel : "Email"} error={errors.email?.message}>
                <Input type="email" {...register("email")} />
              </Field>
              <Field label={isMounted ? t.adminUsers.passwordLabel : "Mật khẩu"} error={errors.password?.message}>
                <PasswordInput {...register("password")} />
              </Field>
              <Field label={isMounted ? t.adminUsers.roleLabel : "Vai trò"} error={errors.roleId?.message}>
                <select className={selectClassName} {...register("roleId")}>
                  <option value="">{isMounted ? t.adminUsers.selectRole : "Chọn vai trò"}</option>
                  {roles.data?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  {isMounted ? t.adminUi.cancel : "Hủy"}
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending
                    ? (isMounted ? t.adminUi.processing : "Đang tạo...")
                    : (isMounted ? t.adminUsers.addUserBtn : "Tạo người dùng")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={Boolean(editing)} onOpenChange={(next) => !next && setEditing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? t.adminUsers.manageAccountTitle : "Quản lý tài khoản"}
              </DialogTitle>
              <DialogDescription>{editing?.email}</DialogDescription>
            </DialogHeader>
            <Field label={isMounted ? t.adminUsers.roleLabel : "Vai trò"}>
              <select className={selectClassName} value={roleId} onChange={(event) => setRoleId(event.target.value)}>
                {roles.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="rounded-2xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/25 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-kawaii-mocha">
                <LockKeyhole className="h-4 w-4" />
                {isMounted ? t.adminUsers.accessStatus : "Trạng thái truy cập"}
              </p>
              <p className="mt-1 text-xs text-kawaii-mocha/60">
                {isMounted ? t.adminUsers.accessStatusDesc : "Khóa tài khoản sẽ chặn đăng nhập nhưng không xóa dữ liệu."}
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                {isMounted ? t.adminUi.cancel : "Hủy"}
              </Button>
              <Button
                disabled={!editing || update.isPending}
                onClick={() => editing && update.mutate({ user: editing, active: !editing.isActive, nextRole: roleId })}
              >
                {update.isPending
                  ? (isMounted ? t.adminUi.saving : "Đang lưu...")
                  : isMounted
                    ? `${editing?.isActive ? t.adminUsers.lockAndSave : t.adminUsers.unlockAndSave}`
                    : `${editing?.isActive ? "Khóa" : "Mở khóa"} và lưu vai trò`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(next) => !next && setDeleting(null)}
          title={isMounted ? t.adminUsers.softDeleteTitle : "Xóa mềm người dùng?"}
          description={
            isMounted
              ? `${t.adminUsers.deleteDescPrefix} ${deleting?.email ?? ""} ${t.adminUsers.deleteDescSuffix}`
              : `Tài khoản ${deleting?.email ?? ""} sẽ bị vô hiệu hóa và đánh dấu đã xóa.`
          }
          busy={remove.isPending}
          onConfirm={() => deleting && remove.mutate(deleting.id)}
        />
      </div>
    </PermissionGate>
  );
}

