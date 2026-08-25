import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-kawaii-cream text-kawaii-mocha overflow-hidden">
      {/* Floating background clouds */}
      <div className="absolute top-10 left-10 text-6xl opacity-25 animate-float pointer-events-none">☁️</div>
      <div className="absolute bottom-12 right-12 text-6xl opacity-25 animate-float-slow pointer-events-none">🌸</div>
      <div className="absolute top-1/3 right-10 text-4xl opacity-20 animate-float pointer-events-none">✨</div>

      <header className="relative z-10 flex h-20 items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-kawaii-mocha">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kawaii-sky/40 border border-kawaii-sky text-base">
            ☁️
          </span>
          <span className="font-extrabold">Loichoi Kawaii</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
