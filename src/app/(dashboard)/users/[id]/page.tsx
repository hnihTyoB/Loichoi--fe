"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUserById(id),
  });

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi Tiết Người Dùng</h1>
          <p className="text-muted-foreground">Xem và cập nhật thông tin tài khoản #{id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cơ Bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Họ và Tên</label>
              <Input value={user?.name || ""} readOnly />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input value={user?.email || ""} readOnly />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Vai Trò</label>
              <div>
                <Badge variant="secondary">{user?.role?.name || "Member"}</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Trạng Thái</label>
              <div>
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                  {user?.isActive ? "Đang hoạt động" : "Bị khóa"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
