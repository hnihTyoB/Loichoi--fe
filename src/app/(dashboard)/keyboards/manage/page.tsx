"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Keyboard, Plus, RefreshCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PermissionGate } from "@/components/shared/permission-gate";
import { AsyncState, ConfirmDialog, Field, PageHeader, selectClassName } from "@/components/shared/admin-ui";
import { KeyboardFormDialog } from "@/components/forms/keyboard-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services/category.service";
import { keyboardService } from "@/services/keyboard.service";
import { colorService, styleService } from "@/services/taxonomy.service";
import { useTranslation } from "@/hooks/use-translation";
import { useDebounce } from "@/hooks/use-debounce";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import type { AdminKeyboard, KeyboardPayload } from "@/types/admin.types";

export default function KeyboardManagementPage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("");
  const [colorId, setColorId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKeyboard | null>(null);
  const [deleting, setDeleting] = useState<AdminKeyboard | null>(null);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [quotaUserId, setQuotaUserId] = useState("");

  const list = useQuery({
    queryKey: ["keyboards", "manage", debouncedSearch, status, platform, colorId, styleId],
    queryFn: () => keyboardService.getManagementList({ search: debouncedSearch || undefined, status: status || undefined, platform: platform || undefined, colorId: colorId || undefined, styleId: styleId || undefined, limit: 50 }),
  });
  const categories = useQuery({
    queryKey: ["categories", "manage", "options"],
    queryFn: () => categoryService.getManagementList({ limit: 100, isActive: true }),
  });
  const colors = useQuery({
    queryKey: ["public-keyboard-colors"],
    queryFn: colorService.getPublicList,
  });
  const styles = useQuery({
    queryKey: ["public-keyboard-styles"],
    queryFn: styleService.getPublicList,
  });

  const refresh = () => client.invalidateQueries({ queryKey: ["keyboards", "manage"] });
  const save = useMutation({
    mutationFn: ({ payload, id }: { payload: KeyboardPayload; id?: string }) =>
      id ? keyboardService.update(id, payload) : keyboardService.create(payload),
    onSuccess: () => {
      toast.success(editing ? (isMounted ? t.adminKeyboards.updatedSuccess : "Đã cập nhật theme") : (isMounted ? t.adminKeyboards.createdSuccess : "Đã tạo theme"));
      setFormOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: keyboardService.delete,
    onSuccess: () => {
      toast.success(isMounted ? t.adminKeyboards.deletedSuccess : "Đã xóa hoặc lưu trữ theme");
      setDeleting(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const quota = useMutation({
    mutationFn: keyboardService.resetQuota,
    onSuccess: () => {
      toast.success(isMounted ? t.adminKeyboards.resetQuotaSuccess : "Đã đặt lại hạn mức tải");
      setQuotaOpen(false);
      setQuotaUserId("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const edit = async (item: AdminKeyboard) => {
    try {
      setEditing(await keyboardService.getManagementById(item.id));
      setFormOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.KEYBOARD_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Keyboard}
          title={isMounted ? t.adminKeyboards.title : "Quản trị theme bàn phím"}
          description={isMounted ? t.adminKeyboards.description : "Duyệt, xuất bản và quản lý quyền truy cập của toàn bộ theme."}
          actions={
            <>
              <PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}>
                <Button variant="outline" onClick={() => setQuotaOpen(true)}>
                  <RefreshCcw />
                  {isMounted ? t.adminKeyboards.resetQuota : "Đặt lại quota"}
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.KEYBOARD_CREATE}>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                  <Plus />
                  {isMounted ? t.adminKeyboards.createTheme : "Tạo theme"}
                </Button>
              </PermissionGate>
            </>
          }
        />
        <Card>
          <CardContent className="pt-6 md:pt-8">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_160px_160px_180px_180px]">
              <label className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
                <Input
                  className="pl-10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={isMounted ? t.adminKeyboards.searchPlaceholder : "Tìm tên hoặc slug..."}
                />
              </label>
              <select className={selectClassName} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">{isMounted ? t.adminKeyboards.allStatuses : "Mọi trạng thái"}</option>
                <option value="DRAFT">{isMounted ? t.adminKeyboards.statusDraft : "Bản nháp"}</option>
                <option value="PUBLISHED">{isMounted ? t.adminKeyboards.statusPublished : "Đã xuất bản"}</option>
                <option value="HIDDEN">{isMounted ? t.adminKeyboards.statusHidden : "Đã ẩn"}</option>
              </select>
              <select className={selectClassName} value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option value="">{isMounted ? t.adminKeyboards.allPlatforms : "Mọi nền tảng"}</option>
                <option value="IOS">{isMounted ? t.adminKeyboards.platformIos : "iOS"}</option>
                <option value="ANDROID">{isMounted ? t.adminKeyboards.platformAndroid : "Android"}</option>
                <option value="BOTH">{isMounted ? t.adminKeyboards.platformBoth : "Cả hai"}</option>
              </select>
              <select className={selectClassName} value={colorId} onChange={(event) => setColorId(event.target.value)} aria-label={isMounted ? t.adminKeyboards.filterColor : "Lọc theo màu"}>
                <option value="">{isMounted ? t.adminKeyboards.allColors : "Mọi màu sắc"}</option>
                {colors.data?.map((color) => <option key={color.id} value={color.id}>{color.name}</option>)}
              </select>
              <select className={selectClassName} value={styleId} onChange={(event) => setStyleId(event.target.value)} aria-label={isMounted ? t.adminKeyboards.filterStyle : "Lọc theo phong cách"}>
                <option value="">{isMounted ? t.adminKeyboards.allStyles : "Mọi phong cách"}</option>
                {styles.data?.map((style) => <option key={style.id} value={style.id}>{style.name}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>
        <AsyncState
          loading={list.isLoading}
          error={list.isError}
          empty={!list.isLoading && !list.isError && !list.data?.data.length}
          emptyText={isMounted ? t.adminKeyboards.noKeyboards : "Chưa có theme phù hợp bộ lọc"}
        />
        {list.data?.data.length ? (
          <Card>
            <CardContent className="overflow-x-auto pt-6 md:pt-8">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65">
                    <th className="p-3">{isMounted ? t.adminKeyboards.thTheme : "Theme"}</th>
                    <th className="p-3">{isMounted ? t.adminKeyboards.thStatus : "Trạng thái"}</th>
                    <th className="p-3">{isMounted ? t.adminKeyboards.thAccess : "Truy cập"}</th>
                    <th className="p-3">{isMounted ? t.adminKeyboards.thPlatform : "Nền tảng"}</th>
                    <th className="p-3">{isMounted ? t.adminKeyboards.thPerformance : "Hiệu suất"}</th>
                    <th className="p-3 text-right">{isMounted ? t.adminKeyboards.thActions : "Thao tác"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kawaii-sky/20">
                  {list.data.data.map((item) => (
                    <tr key={item.id} className="hover:bg-kawaii-cloud/30">
                      <td className="p-3">
                        <div className="font-bold text-kawaii-mocha">{item.name}</div>
                        <div className="text-xs text-kawaii-mocha/55">
                          {item.slug} · {item.categoryNames.join(", ") || (isMounted ? t.adminKeyboards.unclassified : "Chưa phân loại")}
                        </div>
                        {(item.colorNames.length || item.styleNames.length) ? (
                          <div className="mt-1 text-xs font-semibold text-kawaii-warmbrown">
                            {[...item.colorNames, ...item.styleNames].join(" · ")}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3">
                        <Badge variant={item.status === "PUBLISHED" ? "default" : item.status === "HIDDEN" ? "destructive" : "secondary"}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{item.accessLevel}</Badge>
                      </td>
                      <td className="p-3 text-kawaii-mocha/70">{item.platform}</td>
                      <td className="p-3 text-xs text-kawaii-mocha/65">
                        {item.downloadCount} {isMounted ? t.adminKeyboards.downloads : "lượt tải"} · {item.likeCount} {isMounted ? t.adminKeyboards.likes : "lượt thích"}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}>
                            <Button variant="outline" size="icon" aria-label={isMounted ? t.adminUi.edit : "Chỉnh sửa"} onClick={() => edit(item)}>
                              <Edit3 />
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}>
                            <Button variant="destructive" size="icon" aria-label={isMounted ? t.adminUi.delete : "Xóa"} onClick={() => setDeleting(item)}>
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
        <KeyboardFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditing(null);
          }}
          keyboard={editing}
          categories={categories.data?.data ?? []}
          colors={colors.data ?? []}
          styles={styles.data ?? []}
          busy={save.isPending}
          onSubmit={(payload) => save.mutateAsync({ payload, id: editing?.id }).then(() => undefined)}
        />
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(open) => !open && setDeleting(null)}
          title={isMounted ? t.adminKeyboards.deleteTitle : "Xóa theme?"}
          description={
            isMounted
              ? `${t.adminKeyboards.deleteDescriptionPrefix} "${deleting?.name ?? ""}" ${t.adminKeyboards.deleteDescriptionSuffix}`
              : `Theme “${deleting?.name ?? ""}” sẽ bị xóa hoặc chuyển sang lưu trữ nếu đã có lượt tải.`
          }
          busy={remove.isPending}
          onConfirm={() => deleting && remove.mutate(deleting.id)}
        />
        <Dialog open={quotaOpen} onOpenChange={setQuotaOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? t.adminKeyboards.resetQuotaDialogTitle : "Đặt lại hạn mức tải"}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminKeyboards.resetQuotaDialogDesc : "Nhập UUID của người dùng cần đặt lại quota ngày và tháng."}
              </DialogDescription>
            </DialogHeader>
            <Field label={isMounted ? t.adminKeyboards.resetQuotaUserIdLabel : "User ID"}>
              <Input
                value={quotaUserId}
                onChange={(event) => setQuotaUserId(event.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
              />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setQuotaOpen(false)}>
                {isMounted ? t.adminUi.cancel : "Hủy"}
              </Button>
              <Button disabled={!quotaUserId || quota.isPending} onClick={() => quota.mutate(quotaUserId)}>
                {quota.isPending
                  ? (isMounted ? t.adminUi.processing : "Đang xử lý...")
                  : (isMounted ? t.adminKeyboards.resetQuota : "Đặt lại quota")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}
