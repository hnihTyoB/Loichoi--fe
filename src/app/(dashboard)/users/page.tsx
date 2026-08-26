"use client";

import Link from "next/link";
import { CheckCircle2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export default function UsersPage() {
  const { t, isMounted } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => userService.getUsers(),
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.users.title : "Quản Lý Người Dùng"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.users.subtitle : "Danh sách tài khoản thành viên trong đại gia đình Loichoi"}
          </p>
        </div>
      </div>

      <Card className="rounded-[2.25rem]">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg">{isMounted ? t.users.memberList : "Danh Sách Thành Viên"}</CardTitle>
          <div className="relative flex items-center gap-2 max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kawaii-mocha/50" />
            <Input
              placeholder={isMounted ? t.users.searchPlaceholder : "Tìm kiếm theo tên, email..."}
              className="h-10 pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm font-bold text-kawaii-mocha/60">
              {isMounted ? t.users.loading : "Đang tải danh sách thành viên..."}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-sm font-bold text-kawaii-mocha/60">
              {isMounted ? t.users.empty : "Chưa có người dùng nào"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-kawaii-sky/40 bg-kawaii-cloud/50 text-xs font-bold text-kawaii-mocha">
                  <tr>
                    <th className="p-3.5 rounded-l-2xl">{isMounted ? t.common.fullName : "Họ và Tên"}</th>
                    <th className="p-3.5">{isMounted ? t.common.email : "Email"}</th>
                    <th className="p-3.5">{isMounted ? t.common.role : "Vai Trò"}</th>
                    <th className="p-3.5">{isMounted ? t.common.status : "Trạng Thái"}</th>
                    <th className="p-3.5">{isMounted ? t.common.dateJoined : "Ngày Tham Gia"}</th>
                    <th className="p-3.5 text-right rounded-r-2xl">{isMounted ? t.common.actions : "Thao Tác"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kawaii-sky/20">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-kawaii-cloud/30 transition-colors">
                      <td className="p-3.5 font-bold text-kawaii-mocha">{u.name}</td>
                      <td className="p-3.5 text-kawaii-mocha/70">{u.email}</td>
                      <td className="p-3.5">
                        <Badge variant="secondary" className="font-bold">{u.role?.name || "Member"}</Badge>
                      </td>
                      <td className="p-3.5">
                        {u.isActive ? (
                          <Badge variant="default" className="gap-1 font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{isMounted ? t.users.activeUser : "Hoạt động"}</span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="font-bold">
                            {isMounted ? t.users.locked : "Khóa"}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-kawaii-mocha/60 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="p-3.5 text-right">
                        <Link href={`/users/${u.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full font-bold">
                            {isMounted ? t.common.details : "Chi tiết"}
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
