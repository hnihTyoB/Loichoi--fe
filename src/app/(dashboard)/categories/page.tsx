"use client";

import { ArrowRight, CircleDot, Droplet, Keyboard, Palette, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";

export default function CategoriesPage() {
  const { t, isMounted } = useTranslation();

  const categories = [
    { id: "cat-1", name: "Bàn phím hoàn thiện (Pre-built)", count: 24, slug: "pre-built", icon: Keyboard },
    { id: "cat-2", name: "Bộ kit DIY Custom (Barebone)", count: 18, slug: "barebone-kits", icon: Wrench },
    { id: "cat-3", name: "Switch cơ học (Linear, Tactile, Clicky)", count: 56, slug: "switches", icon: CircleDot },
    { id: "cat-4", name: "Keycaps (PBT Dye-sub, Double-shot)", count: 42, slug: "keycaps", icon: Palette },
    { id: "cat-5", name: "Phụ kiện Lube & Modding", count: 15, slug: "accessories", icon: Droplet },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.categories.title : "Danh Mục Sản Phẩm"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.categories.subtitle : "Phân loại linh kiện và bàn phím cơ Loichoi"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card key={cat.id} className="rounded-[2rem] hover:shadow-cloud-hover transition-all duration-300 bouncy-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner">
                    <Icon className="h-6 w-6" />
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
                    {cat.count} {isMounted ? t.categories.itemsCount : "sản phẩm"}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-kawaii-warmbrown hover:underline cursor-pointer">
                    {isMounted ? t.common.explore : "Khám phá"} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
