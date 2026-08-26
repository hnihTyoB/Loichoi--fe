"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, FolderTree, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { categoryService } from "@/services/category.service";
import type { AdminCategory } from "@/types/admin.types";

const schema = z.object({ name: z.string().min(2, "Tên cần ít nhất 2 ký tự").max(100), slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"), isActive: z.boolean() });
type Values = z.infer<typeof schema>;

export function CategoriesManagement() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", slug: "", isActive: true } });
  const list = useQuery({ queryKey: ["categories", "manage", search], queryFn: () => categoryService.getManagementList({ search: search || undefined, limit: 100 }) });
  const refresh = () => client.invalidateQueries({ queryKey: ["categories", "manage"] });
  const save = useMutation({ mutationFn: (values: Values) => editing ? categoryService.update(editing.id, { ...values, slug: values.slug || undefined }) : categoryService.create({ ...values, slug: values.slug || undefined }), onSuccess: () => { toast.success(editing ? "Đã cập nhật danh mục" : "Đã tạo danh mục"); setOpen(false); setEditing(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const remove = useMutation({ mutationFn: categoryService.delete, onSuccess: () => { toast.success("Đã xóa danh mục"); setDeleting(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error, "Không thể xóa danh mục đang được theme sử dụng.")) });
  const showForm = (item?: AdminCategory) => { setEditing(item ?? null); reset(item ? { name: item.name, slug: item.slug, isActive: item.isActive } : { name: "", slug: "", isActive: true }); setOpen(true); };

  return <PermissionGate permission={PERMISSIONS.CATEGORY_READ} fallback={<AsyncState error />}><div className="space-y-6"><PageHeader icon={FolderTree} title="Quản lý danh mục" description="Tổ chức theme theo nhóm và kiểm soát trạng thái hiển thị." actions={<PermissionGate permission={PERMISSIONS.CATEGORY_CREATE}><Button onClick={() => showForm()}><Plus />Thêm danh mục</Button></PermissionGate>} />
    <Card><CardContent className="pt-6 md:pt-8"><label className="relative block max-w-xl"><Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" /><Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc slug..." /></label></CardContent></Card>
    <AsyncState loading={list.isLoading} error={list.isError} empty={!list.isLoading && !list.isError && !list.data?.data.length} emptyText="Chưa có danh mục" />
    {list.data?.data.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.data.data.map((item) => <Card key={item.id}><CardContent className="pt-6 md:pt-8"><div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-kawaii-mocha">{item.name}</h2><p className="text-xs text-kawaii-mocha/55">/{item.slug}</p></div><Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Đang hiển thị" : "Đã ẩn"}</Badge></div><p className="mt-5 text-sm font-semibold text-kawaii-mocha/65">{item.themeCount} theme đang sử dụng</p><div className="mt-5 flex justify-end gap-2"><PermissionGate permission={PERMISSIONS.CATEGORY_UPDATE}><Button variant="outline" size="sm" onClick={() => showForm(item)}><Edit3 />Sửa</Button></PermissionGate><PermissionGate permission={PERMISSIONS.CATEGORY_DELETE}><Button variant="destructive" size="sm" onClick={() => setDeleting(item)}><Trash2 />Xóa</Button></PermissionGate></div></CardContent></Card>)}</div> : null}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{editing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle><DialogDescription>Slug để trống sẽ được backend tự sinh từ tên.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={handleSubmit((values) => save.mutate(values))}><Field label="Tên danh mục" error={errors.name?.message}><Input {...register("name")} /></Field><Field label="Slug" error={errors.slug?.message}><Input {...register("slug")} /></Field><label className="flex items-center gap-2 rounded-2xl bg-kawaii-sky/20 p-3 text-sm font-bold text-kawaii-mocha"><input type="checkbox" {...register("isActive")} />Cho phép hiển thị</label><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit" disabled={save.isPending}>{save.isPending ? "Đang lưu..." : "Lưu danh mục"}</Button></DialogFooter></form></DialogContent></Dialog>
    <ConfirmDialog open={Boolean(deleting)} onOpenChange={(next) => !next && setDeleting(null)} title="Xóa danh mục?" description={deleting?.themeCount ? `Danh mục đang được ${deleting.themeCount} theme sử dụng. Backend sẽ từ chối nếu còn ràng buộc.` : "Danh mục sẽ bị xóa khỏi hệ thống."} busy={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting.id)} />
  </div></PermissionGate>;
}
