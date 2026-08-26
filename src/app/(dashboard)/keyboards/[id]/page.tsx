"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";

export default function KeyboardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, isMounted } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/keyboards">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Loichoi Cinnamoroll 75 #{id}</h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.keyboards.detailTitle : "Thông số kỹ thuật phần cứng và firmware tùy biến"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[2.25rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                <Wrench className="h-4 w-4" />
              </div>
              <CardTitle>{isMounted ? t.keyboards.hardwareStructure : "Cấu Trúc Phần Cứng"}</CardTitle>
            </div>
            <CardDescription>
              {isMounted ? t.keyboards.hardwareDesc : "Vỏ nhôm CNC, gasket mây và switch hotswap"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.layoutLabel : "Layout"}</span>
              <span className="font-bold text-kawaii-mocha">75% Exploded (82 phím)</span>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.caseMaterial : "Vật liệu Case"}</span>
              <span className="font-bold text-kawaii-mocha">Nhôm CNC 6063 Baby Blue Anodized</span>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.mountLabel : "Cấu trúc Mount"}</span>
              <span className="font-bold text-kawaii-mocha">Cloud Gasket Poron Foam êm ái</span>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.hotswapLabel : "Hotswap Sockets"}</span>
              <span className="font-bold text-kawaii-mocha">Kailh Hotswap 5-pin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.25rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-blush/60 text-kawaii-mocha">
                <Zap className="h-4 w-4" />
              </div>
              <CardTitle>{isMounted ? t.keyboards.connectivityCustom : "Kết Nối & Tùy Biến"}</CardTitle>
            </div>
            <CardDescription>
              {isMounted ? t.keyboards.connectivityDesc : "LED RGB pastel và tương thích VIA/QMK"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.firmwareLabel : "Firmware"}</span>
              <Badge variant="secondary" className="font-bold">QMK / VIA / VIAL Ready</Badge>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.mcuLabel : "Vi điều khiển (MCU)"}</span>
              <span className="font-bold text-kawaii-mocha">STM32F401 Tốc độ cao</span>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.latencyLabel : "Độ trễ phản hồi"}</span>
              <span className="font-bold text-kawaii-mocha">1000Hz (1ms)</span>
            </div>
            <div className="flex justify-between border-b border-kawaii-sky/30 pb-2">
              <span className="text-kawaii-mocha/60">{isMounted ? t.keyboards.batteryLabel : "Dung lượng Pin"}</span>
              <span className="font-bold text-kawaii-mocha">4000mAh (Dùng 200 giờ)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
