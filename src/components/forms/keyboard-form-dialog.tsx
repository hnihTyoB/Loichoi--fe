"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, selectClassName } from "@/components/shared/admin-ui";
import { ThemeImageUploader } from "@/components/forms/theme-image-uploader";
import { useTranslation } from "@/hooks/use-translation";
import { isSupportedDownloadUrl } from "@/lib/download-url";
import type { AdminCategory, AdminKeyboard, KeyboardPayload } from "@/types/admin.types";
import type { KeyboardColor, KeyboardStyle } from "@/types/keyboard.types";

const schema = z.object({
  name: z.string().min(3, "Tên cần ít nhất 3 ký tự").max(150),
  slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  description: z.string().max(2000),
  coverUrl: z.string().url("Vui lòng tải lên hoặc chọn ảnh bìa hợp lệ"),
  driveUrl: z.string().url("URL tải xuống không hợp lệ").refine(isSupportedDownloadUrl, "Cần dùng URL HTTPS của Google Drive hoặc Discord"),
  platform: z.enum(["IOS", "ANDROID", "BOTH"]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
  accessLevel: z.enum(["FREE", "PREMIUM", "DISCORD_MEMBER", "DISCORD_ROLE"]),
  requiredDiscordRoles: z.string(),
  categoryIds: z.array(z.string()),
  colorIds: z.array(z.string()),
  styleIds: z.array(z.string()),
  isFeatured: z.boolean(),
  previewUrls: z.string(),
}).superRefine((value, context) => {
  if (value.status === "PUBLISHED" && value.categoryIds.length === 0) {
    context.addIssue({ code: "custom", path: ["categoryIds"], message: "Theme đã xuất bản cần ít nhất một danh mục" });
  }
  for (const url of value.previewUrls.split("\n").map((item) => item.trim()).filter(Boolean)) {
    if (!z.string().url().safeParse(url).success) {
      context.addIssue({ code: "custom", path: ["previewUrls"], message: "Có URL ảnh xem trước không hợp lệ" });
    }
  }
});


type Values = z.infer<typeof schema>;
const defaults: Values = { name: "", slug: "", description: "", coverUrl: "", driveUrl: "", platform: "BOTH", status: "DRAFT", accessLevel: "FREE", requiredDiscordRoles: "", categoryIds: [], colorIds: [], styleIds: [], isFeatured: false, previewUrls: "" };

export function KeyboardFormDialog({
  open,
  onOpenChange,
  keyboard,
  categories,
  colors,
  styles,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyboard?: AdminKeyboard | null;
  categories: AdminCategory[];
  colors: KeyboardColor[];
  styles: KeyboardStyle[];
  busy?: boolean;
  onSubmit: (payload: KeyboardPayload) => Promise<void>;
}) {
  const { t, isMounted } = useTranslation();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const selectedCategories = watch("categoryIds");
  const selectedColors = watch("colorIds");
  const selectedStyles = watch("styleIds");
  const currentCoverUrl = watch("coverUrl");
  const currentPreviewUrls = watch("previewUrls");

  const handleOpen = (next: boolean) => {
    if (next) reset(keyboard ? {
      name: keyboard.name, slug: keyboard.slug, description: keyboard.description ?? "", coverUrl: keyboard.coverUrl, driveUrl: keyboard.driveUrl,
      platform: keyboard.platform, status: keyboard.status, accessLevel: keyboard.accessLevel, requiredDiscordRoles: keyboard.requiredDiscordRoleIds.join("\n"),
      categoryIds: keyboard.categories?.map((category) => category.id) ?? [], isFeatured: keyboard.isFeatured,
      colorIds: keyboard.colors?.map((color) => color.id) ?? [],
      styleIds: keyboard.styles?.map((style) => style.id) ?? [],
      previewUrls: keyboard.previewImages?.sort((a, b) => a.position - b.position).map((image) => image.url).join("\n") ?? "",
    } : defaults);
    onOpenChange(next);
  };

  const parsedPreviewUrls = currentPreviewUrls
    ? currentPreviewUrls.split("\n").map((u) => u.trim()).filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-kawaii-mocha">
            {keyboard
              ? (isMounted ? t.adminKeyboards.formEditTitle : "Chỉnh sửa theme")
              : (isMounted ? t.adminKeyboards.formCreateTitle : "Tạo theme mới")}
          </DialogTitle>
          <DialogDescription>
            {isMounted ? t.adminKeyboards.formDesc : "Thông tin được kiểm tra trước khi gửi đến API quản trị."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit({
              name: values.name,
              slug: values.slug || undefined,
              description: values.description || undefined,
              coverUrl: values.coverUrl,
              driveUrl: values.driveUrl,
              platform: values.platform,
              status: values.status,
              accessLevel: values.accessLevel,
              requiredDiscordRoleIds: values.requiredDiscordRoles.split("\n").map((item) => item.trim()).filter(Boolean),
              categoryIds: values.categoryIds,
              colorIds: values.colorIds,
              styleIds: values.styleIds,
              isFeatured: values.isFeatured,
              previewImages: values.previewUrls
                .split("\n")
                .map((url) => url.trim())
                .filter(Boolean)
                .map((url, position) => ({ url, position })),
            });
          })}
          className="space-y-4"
        >
          {/* Uploader hình ảnh Theme trực tiếp lên R2 */}
          <div className="rounded-3xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/15 p-4">
            <ThemeImageUploader
              coverUrl={currentCoverUrl}
              previewUrls={parsedPreviewUrls}
              onChange={({ coverUrl: nextCover, previewUrls: nextPreviews }) => {
                setValue("coverUrl", nextCover, { shouldValidate: true });
                setValue("previewUrls", nextPreviews.join("\n"), { shouldValidate: true });
              }}
              disabled={busy}
            />
            {errors.coverUrl?.message && (
              <p className="mt-2 text-xs font-bold text-destructive">
                {errors.coverUrl.message}
              </p>
            )}
            {errors.previewUrls?.message && (
              <p className="mt-1 text-xs font-bold text-destructive">
                {errors.previewUrls.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={isMounted ? t.adminKeyboards.formName : "Tên theme"} error={errors.name?.message}>
              <Input {...register("name")} />
            </Field>
            <Field label={isMounted ? t.adminKeyboards.formSlug : "Slug"} error={errors.slug?.message}>
              <Input {...register("slug")} placeholder={isMounted ? t.adminKeyboards.formSlugPlaceholder : "de-trong-de-tu-dong-tao"} />
            </Field>
          </div>
          <Field label={isMounted ? t.adminKeyboards.formDescription : "Mô tả"} error={errors.description?.message}>
            <Textarea {...register("description")} />
          </Field>
          <Field label={isMounted ? t.adminKeyboards.formDriveUrl : "URL tải xuống"} error={errors.driveUrl?.message}>
            <Input {...register("driveUrl")} placeholder="https://discord.com/channels/..." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={isMounted ? t.adminKeyboards.formPlatform : "Nền tảng"}>
              <select className={selectClassName} {...register("platform")}>
                <option value="BOTH">{isMounted ? t.adminKeyboards.platformBoth : "Cả hai"}</option>
                <option value="IOS">{isMounted ? t.adminKeyboards.platformIos : "iOS"}</option>
                <option value="ANDROID">{isMounted ? t.adminKeyboards.platformAndroid : "Android"}</option>
              </select>
            </Field>
            <Field label={isMounted ? t.adminKeyboards.formStatus : "Trạng thái"}>
              <select className={selectClassName} {...register("status")}>
                <option value="DRAFT">{isMounted ? t.adminKeyboards.statusDraft : "Bản nháp"}</option>
                <option value="PUBLISHED">{isMounted ? t.adminKeyboards.statusPublished : "Đã xuất bản"}</option>
                <option value="HIDDEN">{isMounted ? t.adminKeyboards.statusHidden : "Đã ẩn"}</option>
              </select>
            </Field>
            <Field label={isMounted ? t.adminKeyboards.formAccessLevel : "Quyền truy cập"}>
              <select className={selectClassName} {...register("accessLevel")}>
                <option value="FREE">{isMounted ? t.adminKeyboards.accessFree : "Miễn phí"}</option>
                <option value="PREMIUM">{isMounted ? t.adminKeyboards.accessPremium : "Premium"}</option>
                <option value="DISCORD_MEMBER">{isMounted ? t.adminKeyboards.accessDiscordMember : "Thành viên Discord"}</option>
                <option value="DISCORD_ROLE">{isMounted ? t.adminKeyboards.accessDiscordRole : "Role Discord"}</option>
              </select>
            </Field>
          </div>
          <Field label={isMounted ? t.adminKeyboards.formCategories : "Danh mục"} error={errors.categoryIds?.message}>
            <div className="grid max-h-32 grid-cols-2 gap-1 overflow-y-auto rounded-2xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/20 p-3 pr-2">
              {categories.map((category) => (
                <label key={category.id} className="flex h-8 items-center gap-2 text-sm text-kawaii-mocha">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(event) =>
                      setValue(
                        "categoryIds",
                        event.target.checked ? [...selectedCategories, category.id] : selectedCategories.filter((id) => id !== category.id),
                        { shouldValidate: true },
                      )
                    }
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={isMounted ? t.adminKeyboards.formColors : "Màu sắc"} error={errors.colorIds?.message}>
              <div className="grid max-h-[12.5rem] gap-1 overflow-y-auto rounded-2xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/20 p-3 pr-2">
                {colors.length ? colors.map((color) => (
                  <label key={color.id} className="flex h-8 items-center gap-2 text-sm text-kawaii-mocha">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.id)}
                      onChange={(event) => setValue(
                        "colorIds",
                        event.target.checked ? [...selectedColors, color.id] : selectedColors.filter((id) => id !== color.id),
                        { shouldValidate: true },
                      )}
                    />
                    <span className="h-5 w-5 rounded-full border-2 border-kawaii-sky/60 shadow-inner" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </label>
                )) : <p className="text-xs font-bold text-kawaii-mocha/55">{isMounted ? t.adminKeyboards.noColors : "Chưa có màu sắc"}</p>}
              </div>
            </Field>
            <Field label={isMounted ? t.adminKeyboards.formStyles : "Phong cách"} error={errors.styleIds?.message}>
              <div className="grid max-h-[12.5rem] gap-1 overflow-y-auto rounded-2xl border-2 border-kawaii-blush/55 bg-kawaii-blush/15 p-3 pr-2">
                {styles.length ? styles.map((style) => (
                  <label key={style.id} className="flex h-8 items-center gap-2 text-sm text-kawaii-mocha">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(style.id)}
                      onChange={(event) => setValue(
                        "styleIds",
                        event.target.checked ? [...selectedStyles, style.id] : selectedStyles.filter((id) => id !== style.id),
                        { shouldValidate: true },
                      )}
                    />
                    {style.name}
                  </label>
                )) : <p className="text-xs font-bold text-kawaii-mocha/55">{isMounted ? t.adminKeyboards.noStyles : "Chưa có phong cách"}</p>}
              </div>
            </Field>
          </div>
          <Field label={isMounted ? t.adminKeyboards.formDiscordRoles : "Discord Role ID, mỗi dòng một ID"} error={errors.requiredDiscordRoles?.message}>
            <Textarea {...register("requiredDiscordRoles")} placeholder="Để trống để tự động áp dụng danh sách Role từ Cài đặt hệ thống" />
          </Field>

          <label className="flex items-center gap-2 rounded-2xl bg-kawaii-blush/25 p-3 text-sm font-bold text-kawaii-mocha">
            <input type="checkbox" {...register("isFeatured")} />
            {isMounted ? t.adminKeyboards.formFeatured : "Đánh dấu nổi bật"}
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isMounted ? t.adminUi.cancel : "Hủy"}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy
                ? (isMounted ? t.adminUi.saving : "Đang lưu...")
                : (isMounted ? t.adminKeyboards.formSaveBtn : "Lưu theme")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
