import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-kawaii-cream text-kawaii-mocha">
      <div className="text-8xl animate-bounce-subtle">🐶☁️</div>
      <h1 className="mt-4 text-7xl font-black text-kawaii-babyblue">404</h1>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-kawaii-mocha">Trang Bị Lạc Giữa Những Đám Mây</h2>
      <p className="mt-2 text-sm text-kawaii-mocha/70 max-w-md font-medium">
        Trang bạn đang tìm kiếm có thể đã bay đi theo chú cún Cinnamoroll rồi. Hãy quay về trang chủ nhé!
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button size="lg" className="font-bold shadow-cloud">
            <span>Quay về Trang Chủ 🌸</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
