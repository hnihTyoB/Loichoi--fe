"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-kawaii-mocha/25 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn("fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border-2 border-kawaii-sky/60 bg-card p-6 text-card-foreground shadow-cloud-hover focus:outline-none", className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-kawaii-mocha/60 transition hover:bg-kawaii-blush/40 hover:text-kawaii-mocha">
          <X className="h-4 w-4" />
          <span className="sr-only">Đóng</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("mb-5 space-y-1 pr-10", props.className)} />;
}

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title {...props} className={cn("text-xl font-black text-kawaii-mocha", props.className)} />;
}

export function DialogDescription(props: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description {...props} className={cn("text-sm text-kawaii-mocha/65", props.className)} />;
}

export function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.className)} />;
}
