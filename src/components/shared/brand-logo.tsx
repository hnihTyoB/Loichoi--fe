import Image from "next/image";
import { cn } from "@/lib/utils";

const logoSizes = {
  sm: {
    container: "h-10 w-10 rounded-2xl",
    image: "40px",
  },
  md: {
    container: "h-12 w-12 rounded-[1.25rem]",
    image: "48px",
  },
  lg: {
    container: "h-24 w-24 rounded-[2rem]",
    image: "96px",
  },
} as const;

interface BrandLogoProps {
  alt?: string;
  className?: string;
  priority?: boolean;
  size?: keyof typeof logoSizes;
}

export function BrandLogo({
  alt = "Logo Loichoi",
  className,
  priority = false,
  size = "sm",
}: BrandLogoProps) {
  const dimensions = logoSizes[size];

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden border border-kawaii-sky/70 bg-kawaii-cloud shadow-sm",
        dimensions.container,
        className
      )}
    >
      <Image
        src="/images/logos/logo_loichoi.png"
        alt={alt}
        fill
        priority={priority}
        sizes={dimensions.image}
        className="object-cover scale-110"
      />
    </span>
  );
}
