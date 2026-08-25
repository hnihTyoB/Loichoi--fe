"use client";

import Link from "next/link";
import { Plus, Search, Shield, UserCheck, UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => userService.getUsers(),
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Quản Lý Người Dùng 🐾</h1>
          <p className="text-sm text-kawaii-mocha/70">
            Danh sách tài khoản thành viên trong đại gia đình Loichoi
          </p>
        </div>
      </div>

      <Card className="rounded-[2.25rem]">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg">Danh Sách Thành Viên</CardTitle>
          <div className="flex items-center gap-2 max-w-sm flex-1">
            <Input placeholder="Tìm kiếm theo tên, email... 🔍" className="h-10" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm font-bold text-kawaii-mocha/60">Đang tải danh sách thành viên... ☁️</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-sm font-bold text-kawaii-mocha/60">Chưa có người dùng nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-kawaii-sky/40 bg-kawaii-cloud/50 text-xs font-bold text-kawaii-mocha">
                  <tr>
                    <th className="p-3.5 rounded-l-2xl">Họ và Tên</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Vai Trò</th>
                    <th className="p-3.5">Trạng Thái</th>
                    <th className="p-3.5">Ngày Tham Gia</th>
                    <th className="p-3.5 text-right rounded-r-2xl">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kawaii-sky/20">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-kawaii-cloud/30 transition-colors">
                      <td className="p-3.5 font-bold text-kawaii-mocha">{u.name}</td>
                      <td className="p-3.5 text-kawaii-mocha/70">{u.email}</td>
                      <td className="p-3.5">
                        <Badge variant="secondary" className="font-bold">🌸 {u.role?.name || "Member"}</Badge>
                      </td>
                      <td className="p-3.5">
                        {u.isActive ? (
                          <Badge variant="default" className="font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
                            ✨ Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="font-bold">Khóa</Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-kawaii-mocha/60 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="p-3.5 text-right">
                        <Link href={`/users/${u.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full font-bold">
                            Chi tiết
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
