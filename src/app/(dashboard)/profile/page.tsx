"use client";

import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Hồ Sơ Thành Viên 🐾</h1>
        <p className="text-sm text-kawaii-mocha/70">
          Quản lý thông tin tài khoản và quyền hạn trong thế giới Loichoi
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 rounded-[2.25rem] text-center">
          <CardHeader className="items-center pb-4">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-kawaii-sky/40 border-4 border-kawaii-sky text-4xl font-extrabold text-kawaii-mocha shadow-cloud animate-bounce-subtle">
              🐶
            </div>
            <CardTitle className="mt-4 text-xl">{user?.name || "Cinnamoroll Fan"}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                🌸 {user?.role?.name || "Member"}
              </Badge>
              {user?.isEmailVerified && (
                <Badge variant="default" className="px-3 py-1 text-xs">
                  ✨ Đã xác thực
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2 rounded-[2.25rem]">
          <CardHeader>
            <CardTitle>Chi Tiết Tài Khoản</CardTitle>
            <CardDescription>Thông tin định danh và quyền phân bổ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-kawaii-mocha ml-1">Mã ID Người Dùng</label>
                <Input value={user?.id || ""} disabled className="bg-muted/40 font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-kawaii-mocha ml-1">Tài Khoản Discord</label>
                <Input value={user?.discordId || "Đã liên kết qua OAuth"} disabled className="bg-muted/40 font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-kawaii-mocha ml-1">Danh Sách Quyền (Permissions)</label>
              <div className="flex flex-wrap gap-2 p-4 rounded-2xl border-2 border-kawaii-sky/40 bg-kawaii-cloud/30">
                {user?.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs font-mono bg-white/80 border-kawaii-sky">
                      ✨ {perm}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-kawaii-mocha/60">Quyền thành viên tiêu chuẩn</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
