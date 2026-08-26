import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatePanel({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-kawaii-sky bg-kawaii-cloud/35 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-kawaii-sky/45 text-kawaii-mocha shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-xl font-black text-kawaii-mocha">{title}</h2>
      <p className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-kawaii-mocha/65">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
