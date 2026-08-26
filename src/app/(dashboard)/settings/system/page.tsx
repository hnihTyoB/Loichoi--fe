"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Flag, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader, selectClassName } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { systemService } from "@/services/system.service";
import type { SystemConfigItem } from "@/types/admin.types";

const schema = z.object({ key: z.string().min(2).max(150), value: z.string().min(1, "Giá trị không được trống"), description: z.string().max(500), category: z.string().min(1), isPublic: z.boolean() });
type Values = z.infer<typeof schema>;
function parseValue(value: string): unknown { try { return JSON.parse(value); } catch { return value; } }
function printValue(value: unknown) { return typeof value === "string" ? value : JSON.stringify(value, null, 2); }

export default function SystemSettingsPage() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SystemConfigItem | null>(null);
  const [deleting, setDeleting] = useState<SystemConfigItem | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { key: "", value: "", description: "", category: "GENERAL", isPublic: false } });
  const configs = useQuery({ queryKey: ["system", "configs", search, category], queryFn: () => systemService.getConfigs({ search: search || undefined, category: category || undefined }) });
  const refresh = () => client.invalidateQueries({ queryKey: ["system", "configs"] });
  const save = useMutation({ mutationFn: (values: Values) => editing ? systemService.updateConfig(editing.key, { value: parseValue(values.value), description: values.description, category: values.category, isPublic: values.isPublic }) : systemService.createConfig({ ...values, value: parseValue(values.value), description: values.description || undefined }), onSuccess: () => { toast.success(editing ? "Đã cập nhật cấu hình" : "Đã tạo cấu hình"); setOpen(false); setEditing(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const toggle = useMutation({ mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) => systemService.toggleFeature(key, enabled), onSuccess: () => { toast.success("Đã cập nhật feature flag"); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const remove = useMutation({ mutationFn: systemService.deleteConfig, onSuccess: () => { toast.success("Đã xóa cấu hình"); setDeleting(null); refresh(); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const showForm = (item?: SystemConfigItem) => { setEditing(item ?? null); reset(item ? { key: item.key, value: printValue(item.value), description: item.description ?? "", category: item.category, isPublic: item.isPublic } : { key: "", value: "", description: "", category: "GENERAL", isPublic: false }); setOpen(true); };
  const flags = configs.data?.filter((item) => item.category === "FEATURE_FLAG") ?? [];
  const parameters = configs.data?.filter((item) => item.category !== "FEATURE_FLAG") ?? [];

  return <PermissionGate permission={PERMISSIONS.SYSTEM_CONFIG_READ} fallback={<AsyncState error />}><div className="space-y-6"><PageHeader icon={Flag} title="Cấu hình hệ thống" description="Điều khiển feature flag và tham số runtime không cần triển khai lại." actions={<PermissionGate permission={PERMISSIONS.SYSTEM_CONFIG_MANAGE}><Button onClick={() => showForm()}><Plus />Thêm cấu hình</Button></PermissionGate>} />
    <Card><CardContent className="grid gap-3 pt-6 md:grid-cols-[1fr_220px] md:pt-8"><label className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" /><Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm key hoặc mô tả..." /></label><select className={selectClassName} value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Mọi nhóm</option><option value="GENERAL">Chung</option><option value="FEATURE_FLAG">Feature flag</option><option value="INTEGRATION">Tích hợp</option><option value="SECURITY">Bảo mật</option></select></CardContent></Card>
    <AsyncState loading={configs.isLoading} error={configs.isError} empty={!configs.isLoading && !configs.isError && !configs.data?.length} emptyText="Chưa có cấu hình" />
    {flags.length > 0 && <section className="space-y-3"><h2 className="text-lg font-black text-kawaii-mocha">Feature flags</h2><div className="grid gap-4 md:grid-cols-2">{flags.map((item) => { const enabled = item.value === true; return <Card key={item.id}><CardContent className="flex items-center justify-between gap-4 pt-6 md:pt-8"><div><p className="font-mono text-xs font-bold text-kawaii-mocha">{item.key}</p><p className="mt-1 text-xs text-kawaii-mocha/60">{item.description}</p></div><PermissionGate permission={PERMISSIONS.SYSTEM_CONFIG_MANAGE}><Button variant={enabled ? "default" : "outline"} size="sm" disabled={toggle.isPending} onClick={() => toggle.mutate({ key: item.key, enabled: !enabled })}>{enabled ? "Đang bật" : "Đang tắt"}</Button></PermissionGate></CardContent></Card>; })}</div></section>}
    {parameters.length > 0 && <section className="space-y-3"><h2 className="text-lg font-black text-kawaii-mocha">Tham số runtime</h2><Card><CardContent className="overflow-x-auto pt-6 md:pt-8"><table className="w-full min-w-[800px] text-left text-sm"><thead><tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65"><th className="p-3">Key</th><th className="p-3">Giá trị</th><th className="p-3">Nhóm</th><th className="p-3">Phạm vi</th><th className="p-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-kawaii-sky/20">{parameters.map((item) => <tr key={item.id}><td className="p-3 font-mono text-xs font-bold text-kawaii-mocha">{item.key}<span className="mt-1 block max-w-sm font-sans font-normal text-kawaii-mocha/50">{item.description}</span></td><td className="max-w-xs p-3"><pre className="overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-kawaii-cloud/40 p-2 text-xs text-kawaii-mocha">{printValue(item.value)}</pre></td><td className="p-3"><Badge variant="secondary">{item.category}</Badge></td><td className="p-3"><Badge variant="outline">{item.isPublic ? "Công khai" : "Nội bộ"}</Badge></td><td className="p-3"><div className="flex justify-end gap-2"><PermissionGate permission={PERMISSIONS.SYSTEM_CONFIG_MANAGE}><Button size="icon" variant="outline" onClick={() => showForm(item)} aria-label="Sửa"><Edit3 /></Button><Button size="icon" variant="destructive" onClick={() => setDeleting(item)} aria-label="Xóa"><Trash2 /></Button></PermissionGate></div></td></tr>)}</tbody></table></CardContent></Card></section>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Chỉnh sửa cấu hình" : "Thêm cấu hình"}</DialogTitle><DialogDescription>Giá trị hỗ trợ JSON; chuỗi thường được lưu nguyên văn.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={handleSubmit((values) => save.mutate(values))}><Field label="Key" error={errors.key?.message}><Input disabled={Boolean(editing)} {...register("key")} /></Field><Field label="Giá trị" error={errors.value?.message}><Textarea className="font-mono" {...register("value")} /></Field><Field label="Mô tả" error={errors.description?.message}><Textarea {...register("description")} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Nhóm"><select className={selectClassName} {...register("category")}><option value="GENERAL">Chung</option><option value="FEATURE_FLAG">Feature flag</option><option value="INTEGRATION">Tích hợp</option><option value="SECURITY">Bảo mật</option></select></Field><label className="flex items-center gap-2 self-end rounded-2xl bg-kawaii-sky/20 p-3 text-sm font-bold text-kawaii-mocha"><input type="checkbox" {...register("isPublic")} />Công khai cho client</label></div><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit" disabled={save.isPending}>{save.isPending ? "Đang lưu..." : "Lưu cấu hình"}</Button></DialogFooter></form></DialogContent></Dialog>
    <ConfirmDialog open={Boolean(deleting)} onOpenChange={(next) => !next && setDeleting(null)} title="Xóa cấu hình?" description={`Key “${deleting?.key ?? ""}” sẽ bị xóa khỏi runtime config.`} busy={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting.key)} />
  </div></PermissionGate>;
}
