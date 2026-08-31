"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Keyboard, Plus, RefreshCcw, Search, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PermissionGate } from "@/components/shared/permission-gate";
import { AsyncState, ConfirmDialog, Field, PageHeader, PaginationNav, selectClassName } from "@/components/shared/admin-ui";
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("");
  const [colorId, setColorId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKeyboard | null>(null);
  const [deleting, setDeleting] = useState<AdminKeyboard | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [quotaUserId, setQuotaUserId] = useState("");

  const list = useQuery({
    queryKey: ["keyboards", "manage", debouncedSearch, status, platform, colorId, styleId, page, limit],
    queryFn: () =>
      keyboardService.getManagementList({
        search: debouncedSearch || undefined,
        status: status || undefined,
        platform: platform || undefined,
        colorId: colorId || undefined,
        styleId: styleId || undefined,
        page,
        limit,
      }),
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

  const items = list.data?.data ?? [];
  const meta = list.data?.meta;
  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handlePlatformChange = (val: string) => {
    setPlatform(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleColorChange = (val: string) => {
    setColorId(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleStyleChange = (val: string) => {
    setStyleId(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleLimitChange = (val: number) => {
    setLimit(val);
    setPage(1);
    setSelectedIds(new Set());
  };

  const refresh = () => {
    client.invalidateQueries({ queryKey: ["keyboards", "manage"] });
    setSelectedIds(new Set());
  };

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

  const bulkRemove = useMutation({
    mutationFn: (ids: string[]) => keyboardService.bulkDelete(ids),
    onSuccess: (data) => {
      toast.success(`Đã xóa thành công ${data.totalDeleted}/${data.totalRequested} theme đã chọn`);
      setBulkDeleting(false);
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
            <div className="flex items-center gap-2">
              <PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}>
                {selectedIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-10 rounded-2xl font-bold bouncy-hover"
                      onClick={() => setBulkDeleting(true)}
                      disabled={bulkRemove.isPending}
                    >
                      {bulkRemove.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1.5" />
                      )}
                      Xóa {selectedIds.size} mục đã chọn
                    </Button>
                  </motion.div>
                )}
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}>
                <Button variant="outline" className="h-10 rounded-2xl text-xs font-bold bouncy-hover" onClick={() => setQuotaOpen(true)}>
                  <RefreshCcw className="h-4 w-4 mr-1.5" />
                  {isMounted ? t.adminKeyboards.resetQuota : "Đặt lại quota"}
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.KEYBOARD_CREATE}>
                <Button className="h-10 rounded-2xl bg-kawaii-babyblue hover:bg-kawaii-babyblue/90 text-white font-bold bouncy-hover" onClick={() => { setEditing(null); setFormOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {isMounted ? t.adminKeyboards.createTheme : "Tạo theme"}
                </Button>
              </PermissionGate>
            </div>
          }
        />

        {/* ─── Bulk selection banner ─── */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800"
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCheck className="h-4 w-4 text-rose-600" />
                <span>Đã chọn {selectedIds.size} giao diện bàn phím</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-xl"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Bỏ chọn
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs font-bold rounded-xl gap-1"
                  onClick={() => setBulkDeleting(true)}
                  disabled={bulkRemove.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa tất cả mục đã chọn
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="rounded-3xl border-2 border-kawaii-sky/30 shadow-[0_4px_20px_rgba(162,207,254,0.12)]">
          <CardContent className="pt-6 md:pt-8">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_150px_150px_160px_160px_120px]">
              <label className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
                <Input
                  className="pl-10 h-11 rounded-2xl border-2 border-input bg-kawaii-cloud/30"
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder={isMounted ? t.adminKeyboards.searchPlaceholder : "Tìm tên hoặc slug..."}
                />
              </label>
              <select className={selectClassName} value={status} onChange={(event) => handleStatusChange(event.target.value)}>
                <option value="">{isMounted ? t.adminKeyboards.allStatuses : "Mọi trạng thái"}</option>
                <option value="DRAFT">{isMounted ? t.adminKeyboards.statusDraft : "Bản nháp"}</option>
                <option value="PUBLISHED">{isMounted ? t.adminKeyboards.statusPublished : "Đã xuất bản"}</option>
                <option value="HIDDEN">{isMounted ? t.adminKeyboards.statusHidden : "Đã ẩn"}</option>
              </select>
              <select className={selectClassName} value={platform} onChange={(event) => handlePlatformChange(event.target.value)}>
                <option value="">{isMounted ? t.adminKeyboards.allPlatforms : "Mọi nền tảng"}</option>
                <option value="IOS">{isMounted ? t.adminKeyboards.platformIos : "iOS"}</option>
                <option value="ANDROID">{isMounted ? t.adminKeyboards.platformAndroid : "Android"}</option>
                <option value="BOTH">{isMounted ? t.adminKeyboards.platformBoth : "Cả hai"}</option>
              </select>
              <select className={selectClassName} value={colorId} onChange={(event) => handleColorChange(event.target.value)} aria-label={isMounted ? t.adminKeyboards.filterColor : "Lọc theo màu"}>
                <option value="">{isMounted ? t.adminKeyboards.allColors : "Mọi màu sắc"}</option>
                {colors.data?.map((color) => <option key={color.id} value={color.id}>{color.name}</option>)}
              </select>
              <select className={selectClassName} value={styleId} onChange={(event) => handleStyleChange(event.target.value)} aria-label={isMounted ? t.adminKeyboards.filterStyle : "Lọc theo phong cách"}>
                <option value="">{isMounted ? t.adminKeyboards.allStyles : "Mọi phong cách"}</option>
                {styles.data?.map((style) => <option key={style.id} value={style.id}>{style.name}</option>)}
              </select>
              <select
                className={selectClassName}
                value={limit}
                onChange={(event) => handleLimitChange(Number(event.target.value))}
                aria-label="Số dòng mỗi trang"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <AsyncState
          loading={list.isLoading}
          error={list.isError}
          empty={!list.isLoading && !list.isError && !items.length}
          emptyText={isMounted ? t.adminKeyboards.noKeyboards : "Chưa có theme phù hợp bộ lọc"}
        />

        {items.length ? (
          <div className="space-y-4">
            <Card className="rounded-3xl border-2 border-kawaii-sky/30 overflow-hidden shadow-[0_4px_20px_rgba(162,207,254,0.12)]">
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65 bg-kawaii-cloud/30">
                      <PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}>
                        <th className="p-3.5 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            aria-label="Chọn tất cả"
                            className="h-4 w-4 rounded border-kawaii-sky text-kawaii-babyblue focus:ring-kawaii-sky cursor-pointer"
                          />
                        </th>
                      </PermissionGate>
                      <th className="p-3.5">{isMounted ? t.adminKeyboards.thTheme : "Theme"}</th>
                      <th className="p-3.5">{isMounted ? t.adminKeyboards.thStatus : "Trạng thái"}</th>
                      <th className="p-3.5">{isMounted ? t.adminKeyboards.thAccess : "Truy cập"}</th>
                      <th className="p-3.5">{isMounted ? t.adminKeyboards.thPlatform : "Nền tảng"}</th>
                      <th className="p-3.5">{isMounted ? t.adminKeyboards.thPerformance : "Hiệu suất"}</th>
                      <th className="p-3.5 text-right">{isMounted ? t.adminKeyboards.thActions : "Thao tác"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kawaii-sky/15">
                    {items.map((item) => {
                      const isSelected = selectedIds.has(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors hover:bg-kawaii-cloud/30 ${
                            isSelected ? "bg-kawaii-sky/15" : ""
                          }`}
                        >
                          <PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleOne(item.id)}
                                aria-label={`Chọn ${item.name}`}
                                className="h-4 w-4 rounded border-kawaii-sky text-kawaii-babyblue focus:ring-kawaii-sky cursor-pointer"
                              />
                            </td>
                          </PermissionGate>
                          <td className="p-3.5">
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
                          <td className="p-3.5">
                            <Badge variant={item.status === "PUBLISHED" ? "default" : item.status === "HIDDEN" ? "destructive" : "secondary"}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-3.5">
                            <Badge variant="outline">{item.accessLevel}</Badge>
                          </td>
                          <td className="p-3.5 text-kawaii-mocha/70">{item.platform}</td>
                          <td className="p-3.5 text-xs text-kawaii-mocha/65">
                            {item.downloadCount} {isMounted ? t.adminKeyboards.downloads : "lượt tải"} · {item.likeCount} {isMounted ? t.adminKeyboards.likes : "lượt thích"}
                          </td>
                          <td className="p-3.5">
                            <div className="flex justify-end gap-2">
                              <PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-2xl border-kawaii-sky/40 bouncy-hover" aria-label={isMounted ? t.adminUi.edit : "Chỉnh sửa"} onClick={() => edit(item)}>
                                  <Edit3 className="h-4 w-4 text-kawaii-mocha" />
                                </Button>
                              </PermissionGate>
                              <PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}>
                                <Button variant="destructive" size="icon" className="h-9 w-9 rounded-2xl bouncy-hover" aria-label={isMounted ? t.adminUi.delete : "Xóa"} onClick={() => setDeleting(item)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGate>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* ─── Pagination Nav ─── */}
            {meta && (
              <PaginationNav
                page={page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={limit}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  setSelectedIds(new Set());
                }}
              />
            )}
          </div>
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
        {/* Single delete dialog */}
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
        {/* Bulk delete dialog */}
        <ConfirmDialog
          open={bulkDeleting}
          onOpenChange={(open) => !open && setBulkDeleting(false)}
          title={`Xóa ${selectedIds.size} giao diện bàn phím?`}
          description={`Bạn có chắc chắn muốn xóa ${selectedIds.size} theme đã chọn không? Các theme chưa có lượt tải sẽ bị xóa vĩnh viễn, các theme đã có lượt tải sẽ được chuyển sang trạng thái lưu trữ.`}
          busy={bulkRemove.isPending}
          onConfirm={() => bulkRemove.mutate([...selectedIds])}
        />
        <Dialog open={quotaOpen} onOpenChange={setQuotaOpen}>
          <DialogContent className="max-w-md rounded-3xl">
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
                className="h-11 rounded-2xl border-2 border-input"
              />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" className="h-10 rounded-2xl" onClick={() => setQuotaOpen(false)}>
                {isMounted ? t.adminUi.cancel : "Hủy"}
              </Button>
              <Button className="h-10 rounded-2xl bg-kawaii-babyblue hover:bg-kawaii-babyblue/90 font-bold" disabled={!quotaUserId || quota.isPending} onClick={() => quota.mutate(quotaUserId)}>
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
