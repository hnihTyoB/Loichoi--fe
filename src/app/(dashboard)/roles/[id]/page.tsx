"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { rbacService } from "@/services/rbac.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, isMounted } = useTranslation();

  const { data: role, isLoading } = useQuery({
    queryKey: ["roles", id],
    queryFn: () => rbacService.getRoleById(id),
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {isMounted ? t.roles.loading : "Đang tải thông tin vai trò..."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/roles">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-kawaii-mocha">
            {isMounted ? t.roles.detailTitle : "Chi Tiết Vai Trò"}: {role?.name}
          </h1>
          <p className="text-muted-foreground">
            {role?.description || (isMounted ? t.roles.detailSubtitle : "Cấu hình phân quyền chi tiết")}
          </p>
        </div>
      </div>

      <Card className="rounded-[2.25rem]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
              <Shield className="h-4 w-4" />
            </div>
            <CardTitle>{isMounted ? t.roles.grantedPermissions : "Danh Sách Quyền Hạn Đã Cấp"}</CardTitle>
          </div>
          <CardDescription>
            {isMounted ? t.roles.grantedPermissionsDesc : "Các tài nguyên và hành động mà vai trò này được phép thực thi"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {role?.permissions?.map((p) => (
              <div key={p.id} className="rounded-2xl border-2 border-kawaii-sky/40 p-3 bg-kawaii-cloud/30">
                <div className="font-mono text-sm font-semibold text-kawaii-mocha">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Resource: <strong>{p.resource}</strong> | Action: <strong>{p.action}</strong>
                </div>
                {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
