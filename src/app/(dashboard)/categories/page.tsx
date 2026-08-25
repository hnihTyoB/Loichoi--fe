"use client";

import { FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const categories = [
    { id: "cat-1", name: "Bàn phím hoàn thiện (Pre-built)", count: 24, slug: "pre-built", emoji: "⌨️" },
    { id: "cat-2", name: "Bộ kit DIY Custom (Barebone)", count: 18, slug: "barebone-kits", emoji: "🛠️" },
    { id: "cat-3", name: "Switch cơ học (Linear, Tactile, Clicky)", count: 56, slug: "switches", emoji: "🔘" },
    { id: "cat-4", name: "Keycaps (PBT Dye-sub, Double-shot)", count: 42, slug: "keycaps", emoji: "🎨" },
    { id: "cat-5", name: "Phụ kiện Lube & Modding", count: 15, slug: "accessories", emoji: "🧴" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Danh Mục Sản Phẩm 📂</h1>
          <p className="text-sm text-kawaii-mocha/70">Phân loại linh kiện và bàn phím cơ Loichoi</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="rounded-[2rem] hover:shadow-cloud-hover transition-all duration-300 bouncy-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-2xl shadow-inner">
                  {cat.emoji}
                </div>
                <div>
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <p className="text-[11px] font-mono text-kawaii-mocha/60 mt-0.5">/{cat.slug}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t border-kawaii-sky/30">
                <Badge variant="secondary" className="font-bold text-xs">
                  🌸 {cat.count} sản phẩm
                </Badge>
                <span className="text-xs font-bold text-kawaii-warmbrown hover:underline cursor-pointer">
                  Khám phá 🐾
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
