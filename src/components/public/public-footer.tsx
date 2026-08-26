"use client";

import Link from "next/link";
import { Github, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.com";

export function PublicFooter() {
  const { language } = useTranslation();
  const text = getPublicCopy(language);

  return (
    <footer className="mt-16 border-t-2 border-kawaii-sky/40 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-kawaii-mocha">
            <BrandLogo alt="" />
            Loichoi
          </Link>
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-kawaii-mocha/65">
            {text.footer.description}
          </p>
        </div>
        <div>
          <h2 className="font-extrabold text-kawaii-mocha">{text.footer.discover}</h2>
          <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold text-kawaii-mocha/65">
            <Link className="hover:text-kawaii-warmbrown" href="/keyboards">{text.nav.explore}</Link>
            <Link className="hover:text-kawaii-warmbrown" href="/categories">{text.nav.categories}</Link>
            <Link className="hover:text-kawaii-warmbrown" href="/trending">{text.nav.trending}</Link>
          </nav>
        </div>
        <div>
          <h2 className="font-extrabold text-kawaii-mocha">{text.footer.account}</h2>
          <div className="mt-4 flex gap-2">
            <Button asChild size="icon" variant="outline" aria-label="Discord">
              <a href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle /></a>
            </Button>
            <Button asChild size="icon" variant="outline" aria-label="GitHub">
              <a href="https://github.com" target="_blank" rel="noreferrer"><Github /></a>
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-kawaii-sky/40 px-6 py-5 text-center text-xs font-semibold text-kawaii-mocha/55">
        © {new Date().getFullYear()} {text.footer.rights}
      </div>
    </footer>
  );
}
