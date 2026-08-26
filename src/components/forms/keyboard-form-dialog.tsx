"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, selectClassName } from "@/components/shared/admin-ui";
import type { AdminCategory, AdminKeyboard, KeyboardPayload } from "@/types/admin.types";

const schema = z.object({
  name: z.string().min(3, "Tên cần ít nhất 3 ký tự").max(150),
  slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  description: z.string().max(2000),
  coverUrl: z.string().url("URL ảnh bìa không hợp lệ"),
  driveUrl: z.string().url("URL tải xuống không hợp lệ").refine((value) => /^(https?:\/\/)?(drive|docs)\.google\.com\//.test(value), "Cần dùng URL Google Drive"),
  platform: z.enum(["IOS", "ANDROID", "BOTH"]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
  accessLevel: z.enum(["FREE", "PREMIUM", "DISCORD_MEMBER", "DISCORD_ROLE"]),
  requiredDiscordRoles: z.string(),
  categoryIds: z.array(z.string()),
  isFeatured: z.boolean(),
  previewUrls: z.string(),
}).superRefine((value, context) => {
  if (value.status === "PUBLISHED" && value.categoryIds.length === 0) context.addIssue({ code: "custom", path: ["categoryIds"], message: "Theme đã xuất bản cần ít nhất một danh mục" });
  if (value.accessLevel === "DISCORD_ROLE" && !value.requiredDiscordRoles.trim()) context.addIssue({ code: "custom", path: ["requiredDiscordRoles"], message: "Cần ít nhất một Discord Role ID" });
  for (const url of value.previewUrls.split("\n").map((item) => item.trim()).filter(Boolean)) {
    if (!z.string().url().safeParse(url).success) context.addIssue({ code: "custom", path: ["previewUrls"], message: "Có URL ảnh xem trước không hợp lệ" });
  }
});

type Values = z.infer<typeof schema>;
const defaults: Values = { name: "", slug: "", description: "", coverUrl: "", driveUrl: "", platform: "BOTH", status: "DRAFT", accessLevel: "FREE", requiredDiscordRoles: "", categoryIds: [], isFeatured: false, previewUrls: "" };

export function KeyboardFormDialog({ open, onOpenChange, keyboard, categories, busy, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; keyboard?: AdminKeyboard | null; categories: AdminCategory[]; busy?: boolean; onSubmit: (payload: KeyboardPayload) => Promise<void> }) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const selected = watch("categoryIds");

  const handleOpen = (next: boolean) => {
    if (next) reset(keyboard ? {
      name: keyboard.name, slug: keyboard.slug, description: keyboard.description ?? "", coverUrl: keyboard.coverUrl, driveUrl: keyboard.driveUrl,
      platform: keyboard.platform, status: keyboard.status, accessLevel: keyboard.accessLevel, requiredDiscordRoles: keyboard.requiredDiscordRoleIds.join("\n"),
      categoryIds: keyboard.categories?.map((category) => category.id) ?? [], isFeatured: keyboard.isFeatured,
      previewUrls: keyboard.previewImages?.sort((a, b) => a.position - b.position).map((image) => image.url).join("\n") ?? "",
    } : defaults);
    onOpenChange(next);
  };

  return <Dialog open={open} onOpenChange={handleOpen}><DialogContent><DialogHeader><DialogTitle>{keyboard ? "Chỉnh sửa theme" : "Tạo theme mới"}</DialogTitle><DialogDescription>Thông tin được kiểm tra trước khi gửi đến API quản trị.</DialogDescription></DialogHeader>
    <form onSubmit={handleSubmit(async (values) => {
      await onSubmit({ name: values.name, slug: values.slug || undefined, description: values.description || undefined, coverUrl: values.coverUrl, driveUrl: values.driveUrl, platform: values.platform, status: values.status, accessLevel: values.accessLevel, requiredDiscordRoleIds: values.requiredDiscordRoles.split("\n").map((item) => item.trim()).filter(Boolean), categoryIds: values.categoryIds, isFeatured: values.isFeatured, previewImages: values.previewUrls.split("\n").map((url) => url.trim()).filter(Boolean).map((url, position) => ({ url, position })) });
    })} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Tên theme" error={errors.name?.message}><Input {...register("name")} /></Field><Field label="Slug" error={errors.slug?.message}><Input {...register("slug")} placeholder="de-trong-de-tu-dong-tao" /></Field></div>
      <Field label="Mô tả" error={errors.description?.message}><Textarea {...register("description")} /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="URL ảnh bìa" error={errors.coverUrl?.message}><Input {...register("coverUrl")} /></Field><Field label="URL Google Drive" error={errors.driveUrl?.message}><Input {...register("driveUrl")} /></Field></div>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Nền tảng"><select className={selectClassName} {...register("platform")}><option value="BOTH">Cả hai</option><option value="IOS">iOS</option><option value="ANDROID">Android</option></select></Field><Field label="Trạng thái"><select className={selectClassName} {...register("status")}><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Đã xuất bản</option><option value="HIDDEN">Đã ẩn</option></select></Field><Field label="Quyền truy cập"><select className={selectClassName} {...register("accessLevel")}><option value="FREE">Miễn phí</option><option value="PREMIUM">Premium</option><option value="DISCORD_MEMBER">Thành viên Discord</option><option value="DISCORD_ROLE">Role Discord</option></select></Field></div>
      <Field label="Danh mục" error={errors.categoryIds?.message}><div className="grid gap-2 rounded-2xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/20 p-3 sm:grid-cols-2">{categories.map((category) => <label key={category.id} className="flex items-center gap-2 text-sm text-kawaii-mocha"><input type="checkbox" checked={selected.includes(category.id)} onChange={(event) => setValue("categoryIds", event.target.checked ? [...selected, category.id] : selected.filter((id) => id !== category.id), { shouldValidate: true })} />{category.name}</label>)}</div></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Discord Role ID, mỗi dòng một ID" error={errors.requiredDiscordRoles?.message}><Textarea {...register("requiredDiscordRoles")} /></Field><Field label="URL ảnh xem trước, mỗi dòng một URL" error={errors.previewUrls?.message}><Textarea {...register("previewUrls")} /></Field></div>
      <label className="flex items-center gap-2 rounded-2xl bg-kawaii-blush/25 p-3 text-sm font-bold text-kawaii-mocha"><input type="checkbox" {...register("isFeatured")} />Đánh dấu nổi bật</label>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button type="submit" disabled={busy}>{busy ? "Đang lưu..." : "Lưu theme"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}
