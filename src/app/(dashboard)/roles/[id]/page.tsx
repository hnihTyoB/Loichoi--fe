"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { rbacService } from "@/services/rbac.service";

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = useQueryClient();
  const role = useQuery({ queryKey: ["roles", id], queryFn: () => rbacService.getRoleById(id) });
  const permissions = useQuery({ queryKey: ["permissions"], queryFn: rbacService.getPermissions });
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => { if (role.data) { setSelected(role.data.permissions?.map((item) => item.id) ?? []); setName(role.data.name); setDescription(role.data.description ?? ""); } }, [role.data]);
  const permissionData = permissions.data;
  const grouped = useMemo(() => (permissionData ?? []).reduce<Record<string, NonNullable<typeof permissionData>>>((result, permission) => { (result[permission.resource] ??= []).push(permission); return result; }, {}), [permissionData]);
  const savePermissions = useMutation({ mutationFn: async () => { if (selected.length) await rbacService.syncRolePermissions(id, selected); else await Promise.all((role.data?.permissions ?? []).map((item) => rbacService.removeRolePermission(id, item.id))); }, onSuccess: () => { toast.success("Đã lưu ma trận quyền"); client.invalidateQueries({ queryKey: ["roles"] }); }, onError: (error) => toast.error(getErrorMessage(error)) });
  const saveMetadata = useMutation({ mutationFn: () => rbacService.updateRole(id, { name, description }), onSuccess: () => { toast.success("Đã cập nhật vai trò"); client.invalidateQueries({ queryKey: ["roles"] }); }, onError: (error) => toast.error(getErrorMessage(error)) });
  if (role.isLoading || permissions.isLoading) return <AsyncState loading />;
  if (role.isError || permissions.isError || !role.data) return <AsyncState error />;
  return <PermissionGate permission={PERMISSIONS.ROLE_READ} fallback={<AsyncState error />}><div className="space-y-6"><Button asChild variant="ghost" size="sm"><Link href="/roles"><ArrowLeft />Quay lại</Link></Button><PageHeader icon={ShieldCheck} title={`Ma trận quyền: ${role.data.name}`} description="Tích chọn quyền theo nhóm tài nguyên và lưu đồng bộ." actions={<PermissionGate permission={PERMISSIONS.ROLE_PERMISSION_ASSIGN}><Button disabled={savePermissions.isPending} onClick={() => savePermissions.mutate()}><Save />{savePermissions.isPending ? "Đang lưu..." : "Lưu ma trận"}</Button></PermissionGate>} />
    {!role.data.isSystem && <PermissionGate permission={PERMISSIONS.ROLE_UPDATE}><Card><CardContent className="grid gap-4 pt-6 md:grid-cols-[220px_1fr_auto] md:items-end md:pt-8"><Field label="Tên vai trò"><Input value={name} onChange={(event) => setName(event.target.value.toUpperCase())} /></Field><Field label="Mô tả"><Textarea className="min-h-11" value={description} onChange={(event) => setDescription(event.target.value)} /></Field><Button variant="outline" disabled={saveMetadata.isPending} onClick={() => saveMetadata.mutate()}>Lưu thông tin</Button></CardContent></Card></PermissionGate>}
    <div className="space-y-4">{Object.entries(grouped).map(([resource, items]) => <Card key={resource}><CardContent className="pt-6 md:pt-8"><div className="mb-4 flex items-center justify-between"><h2 className="font-black text-kawaii-mocha">{resource}</h2><Badge variant="secondary">{items?.filter((item) => selected.includes(item.id)).length ?? 0}/{items?.length ?? 0}</Badge></div><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{items?.map((permission) => <label key={permission.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-kawaii-sky/30 bg-kawaii-cloud/20 p-3 transition hover:border-kawaii-sky"><input className="mt-1" type="checkbox" checked={selected.includes(permission.id)} disabled={role.data.isSystem} onChange={(event) => setSelected(event.target.checked ? [...selected, permission.id] : selected.filter((id) => id !== permission.id))} /><span><span className="block font-mono text-xs font-bold text-kawaii-mocha">{permission.name}</span><span className="text-xs text-kawaii-mocha/55">{permission.description || permission.action}</span></span></label>)}</div></CardContent></Card>)}</div>
  </div></PermissionGate>;
}
