"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

export default function KeyboardsPage() {
  const { t, isMounted } = useTranslation();

  const sampleKeyboards = [
    {
      id: "kb-001",
      name: "Loichoi Cinnamoroll 75 Gasket",
      layout: "75% Exploded",
      connectivity: "Tri-mode (Type-C, 2.4G, Bluetooth)",
      mount: "Cloud Gasket Mount",
      status: "IN_STOCK",
      price: 2450000,
      badge: "Best Seller",
    },
    {
      id: "kb-002",
      name: "Loichoi Alice Pastel Ergonomic",
      layout: "Ergo Alice 65%",
      connectivity: "Type-C Wired",
      mount: "Top Mount with Poron",
      status: "PRE_ORDER",
      price: 3200000,
      badge: "New Release",
    },
    {
      id: "kb-003",
      name: "Loichoi TKL Baby Blue Wireless",
      layout: "87 TKL Hotswap",
      connectivity: "Bluetooth 5.0 + Type-C",
      mount: "Tray Mount Foam",
      status: "IN_STOCK",
      price: 1850000,
      badge: "Cloud Soft",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.keyboards.title : "Bàn Phím Cơ Loichoi"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.keyboards.subtitle : "Danh mục sản phẩm bàn phím cơ êm ái phong cách Cinnamoroll"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-kawaii-mocha/50" />
          <Input
            placeholder={isMounted ? t.keyboards.searchPlaceholder : "Tìm kiếm theo tên bàn phím, layout..."}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleKeyboards.map((kb) => (
          <Card key={kb.id} className="rounded-[2.25rem] hover:shadow-cloud-hover transition-all duration-300 bouncy-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                    <Keyboard className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{kb.name}</CardTitle>
                    <CardDescription className="text-xs font-semibold text-kawaii-warmbrown">{kb.layout}</CardDescription>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-[11px] font-bold">
                  {kb.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-kawaii-mocha/80">
              <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
                <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.connectivity : "Kết nối"}:</span>
                <strong className="text-kawaii-mocha">{kb.connectivity}</strong>
              </div>
              <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
                <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.mountStructure : "Cấu trúc"}:</span>
                <strong className="text-kawaii-mocha">{kb.mount}</strong>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-black text-kawaii-warmbrown">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(kb.price)}
                </span>
                <Link href={`/keyboards/${kb.id}`}>
                  <Button variant="default" size="sm" className="gap-1.5 font-bold">
                    <span>{isMounted ? t.keyboards.detailsButton : "Chi tiết"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
