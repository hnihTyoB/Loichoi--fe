import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PageHeader({ icon: Icon, title, description, actions }: { icon: LucideIcon; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-kawaii-sky/35 text-kawaii-mocha shadow-inner"><Icon className="h-6 w-6" /></div>
        <div><h1 className="text-2xl font-black tracking-tight text-kawaii-mocha md:text-3xl">{title}</h1><p className="text-sm text-kawaii-mocha/65">{description}</p></div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return <label className={cn("block space-y-1.5", className)}><span className="ml-1 text-xs font-bold text-kawaii-mocha">{label}</span>{children}{error && <span className="ml-1 block text-xs font-semibold text-destructive">{error}</span>}</label>;
}

export const selectClassName = "h-11 w-full rounded-2xl border-2 border-input bg-background px-4 text-sm text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/25";

export function AsyncState({ loading, error, empty, emptyText = "Chưa có dữ liệu" }: { loading?: boolean; error?: boolean; empty?: boolean; emptyText?: string }) {
  if (!loading && !error && !empty) return null;
  const Icon = loading ? LoaderCircle : error ? AlertCircle : Inbox;
  const text = loading ? "Đang tải dữ liệu..." : error ? "Không thể tải dữ liệu. Vui lòng thử lại." : emptyText;
  return <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-kawaii-sky/50 bg-kawaii-cloud/25 p-8 text-center text-sm font-semibold text-kawaii-mocha/65"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-kawaii-sky/30"><Icon className={cn("h-5 w-5", loading && "animate-spin")} /></div>{text}</div>;
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, busy }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; onConfirm: () => void; busy?: boolean }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button type="button" variant="destructive" disabled={busy} onClick={onConfirm}>{busy ? "Đang xử lý..." : "Xác nhận"}</Button></DialogFooter></DialogContent></Dialog>;
}
