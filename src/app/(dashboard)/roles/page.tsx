"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { rbacService } from "@/services/rbac.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function RolesPage() {
  const { t, isMounted } = useTranslation();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", "list"],
    queryFn: () => rbacService.getRoles(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.roles.title : "Phân Quyền Vai Trò (RBAC)"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.roles.subtitle : "Quản lý ma trận phân quyền theo từng hành động và tài nguyên"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-sm font-bold text-kawaii-mocha/60">
            {isMounted ? t.roles.loading : "Đang tải danh sách vai trò..."}
          </div>
        ) : (
          roles?.map((role) => (
            <Card key={role.id} className="rounded-[2.25rem] flex flex-col justify-between hover:shadow-cloud-hover transition-all duration-300 bouncy-hover">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                      <Shield className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                  {role.isSystem ? (
                    <Badge variant="secondary" className="font-bold">
                      {isMounted ? t.common.system : "Hệ thống"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="font-bold">
                      {isMounted ? t.common.custom : "Tùy biến"}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-xs">
                  {role.description || "Không có mô tả chi tiết."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs font-bold text-kawaii-mocha">
                  {isMounted ? t.roles.permissionsGranted : "Số quyền được cấp"}:{" "}
                  <span className="font-black text-kawaii-warmbrown">{role.permissions?.length || 0} permissions</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions?.slice(0, 4).map((p) => (
                    <Badge key={p.id} variant="outline" className="text-[10px] font-mono bg-kawaii-cloud/50 border-kawaii-sky">
                      {p.name}
                    </Badge>
                  ))}
                  {(role.permissions?.length || 0) > 4 && (
                    <span className="text-[11px] font-bold text-kawaii-warmbrown flex items-center">
                      +{(role.permissions?.length || 0) - 4} khác
                    </span>
                  )}
                </div>
                <div className="pt-2">
                  <Link href={`/roles/${role.id}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-full font-bold">
                      <span>{isMounted ? t.roles.viewMatrix : "Xem Ma Trận Quyền"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
