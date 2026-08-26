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
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import type { AdminKeyboard, KeyboardPayload } from "@/types/admin.types";

export default function KeyboardManagementPage() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKeyboard | null>(null);
  const [deleting, setDeleting] = useState<AdminKeyboard | null>(null);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [quotaUserId, setQuotaUserId] = useState("");

  const list = useQuery({ queryKey: ["keyboards", "manage", search, status, platform], queryFn: () => keyboardService.getManagementList({ search: search || undefined, status: status || undefined, platform: platform || undefined, limit: 50 }) });
  const categories = useQuery({ queryKey: ["categories", "manage", "options"], queryFn: () => categoryService.getManagementList({ limit: 100, isActive: true }) });
  const refresh = () => client.invalidateQueries({ queryKey: ["keyboards", "manage"] });
  const save = useMutation({ mutationFn: ({ payload, id }: { payload: KeyboardPayload; id?: string }) => id ? keyboardService.update(id, payload) : keyboardService.create(payload), onSuccess: () => { toast.success(editing ? "Đã cập nhật theme" : "Đã tạo theme"); setFormOpen(false); setEditing(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const remove = useMutation({ mutationFn: keyboardService.delete, onSuccess: () => { toast.success("Đã xóa hoặc lưu trữ theme"); setDeleting(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const quota = useMutation({ mutationFn: keyboardService.resetQuota, onSuccess: () => { toast.success("Đã đặt lại hạn mức tải"); setQuotaOpen(false); setQuotaUserId(""); }, onError: (error) => toast.error(getErrorMessage(error)) });

  const edit = async (item: AdminKeyboard) => {
    try { setEditing(await keyboardService.getManagementById(item.id)); setFormOpen(true); }
    catch (error) { toast.error(getErrorMessage(error)); }
  };

  return <PermissionGate permission={PERMISSIONS.KEYBOARD_READ} fallback={<AsyncState error />}><div className="space-y-6">
    <PageHeader icon={Keyboard} title="Quản trị theme bàn phím" description="Duyệt, xuất bản và quản lý quyền truy cập của toàn bộ theme." actions={<><PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}><Button variant="outline" onClick={() => setQuotaOpen(true)}><RefreshCcw />Đặt lại quota</Button></PermissionGate><PermissionGate permission={PERMISSIONS.KEYBOARD_CREATE}><Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus />Tạo theme</Button></PermissionGate></>} />
    <Card><CardContent className="pt-6 md:pt-8"><div className="grid gap-3 md:grid-cols-[1fr_180px_180px]"><label className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" /><Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc slug..." /></label><select className={selectClassName} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Mọi trạng thái</option><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Đã xuất bản</option><option value="HIDDEN">Đã ẩn</option></select><select className={selectClassName} value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="">Mọi nền tảng</option><option value="IOS">iOS</option><option value="ANDROID">Android</option><option value="BOTH">Cả hai</option></select></div></CardContent></Card>
    <AsyncState loading={list.isLoading} error={list.isError} empty={!list.isLoading && !list.isError && !list.data?.data.length} emptyText="Chưa có theme phù hợp bộ lọc" />
    {list.data?.data.length ? <Card><CardContent className="overflow-x-auto pt-6 md:pt-8"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65"><th className="p-3">Theme</th><th className="p-3">Trạng thái</th><th className="p-3">Truy cập</th><th className="p-3">Nền tảng</th><th className="p-3">Hiệu suất</th><th className="p-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-kawaii-sky/20">{list.data.data.map((item) => <tr key={item.id} className="hover:bg-kawaii-cloud/30"><td className="p-3"><div className="font-bold text-kawaii-mocha">{item.name}</div><div className="text-xs text-kawaii-mocha/55">{item.slug} · {item.categoryNames.join(", ") || "Chưa phân loại"}</div></td><td className="p-3"><Badge variant={item.status === "PUBLISHED" ? "default" : item.status === "HIDDEN" ? "destructive" : "secondary"}>{item.status}</Badge></td><td className="p-3"><Badge variant="outline">{item.accessLevel}</Badge></td><td className="p-3 text-kawaii-mocha/70">{item.platform}</td><td className="p-3 text-xs text-kawaii-mocha/65">{item.downloadCount} lượt tải · {item.likeCount} lượt thích</td><td className="p-3"><div className="flex justify-end gap-2"><PermissionGate permission={PERMISSIONS.KEYBOARD_UPDATE}><Button variant="outline" size="icon" aria-label="Chỉnh sửa" onClick={() => edit(item)}><Edit3 /></Button></PermissionGate><PermissionGate permission={PERMISSIONS.KEYBOARD_DELETE}><Button variant="destructive" size="icon" aria-label="Xóa" onClick={() => setDeleting(item)}><Trash2 /></Button></PermissionGate></div></td></tr>)}</tbody></table></CardContent></Card> : null}
    <KeyboardFormDialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }} keyboard={editing} categories={categories.data?.data ?? []} busy={save.isPending} onSubmit={(payload) => save.mutateAsync({ payload, id: editing?.id }).then(() => undefined)} />
    <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title="Xóa theme?" description={`Theme “${deleting?.name ?? ""}” sẽ bị xóa hoặc chuyển sang lưu trữ nếu đã có lượt tải.`} busy={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting.id)} />
    <Dialog open={quotaOpen} onOpenChange={setQuotaOpen}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Đặt lại hạn mức tải</DialogTitle><DialogDescription>Nhập UUID của người dùng cần đặt lại quota ngày và tháng.</DialogDescription></DialogHeader><Field label="User ID"><Input value={quotaUserId} onChange={(event) => setQuotaUserId(event.target.value)} placeholder="00000000-0000-0000-0000-000000000000" /></Field><DialogFooter><Button variant="outline" onClick={() => setQuotaOpen(false)}>Hủy</Button><Button disabled={!quotaUserId || quota.isPending} onClick={() => quota.mutate(quotaUserId)}>{quota.isPending ? "Đang xử lý..." : "Đặt lại quota"}</Button></DialogFooter></DialogContent></Dialog>
  </div></PermissionGate>;
}
