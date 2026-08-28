"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Palette, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { colorService, styleService } from "@/services/taxonomy.service";
import type { AdminColor, AdminStyle, PageResult } from "@/types/admin.types";

type TaxonomyKind = "color" | "style";
type TaxonomyItem = AdminColor | AdminStyle;

const hexRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function toPickerHex(hex: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9a-fA-F]{8}$/.test(hex)) {
    return hex.slice(0, 7);
  }
  return "#CDE4FE";
}

const schema = z.object({
  name: z.string().trim().min(2, "Tên cần ít nhất 2 ký tự").max(50),
  slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"),
  hex: z.string(),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự"),
  kind: z.enum(["color", "style"]),
}).superRefine((value, context) => {
  if (value.kind === "color" && !hexRegex.test(value.hex)) {
    context.addIssue({ code: "custom", path: ["hex"], message: "Mã màu phải có dạng #FFF, #FFFFFF hoặc #FFFFFFFF" });
  }
});

type Values = z.infer<typeof schema>;

const permissions = {
  color: { read: PERMISSIONS.COLOR_READ, create: PERMISSIONS.COLOR_CREATE, update: PERMISSIONS.COLOR_UPDATE, delete: PERMISSIONS.COLOR_DELETE },
  style: { read: PERMISSIONS.STYLE_READ, create: PERMISSIONS.STYLE_CREATE, update: PERMISSIONS.STYLE_UPDATE, delete: PERMISSIONS.STYLE_DELETE },
} as const;

export function TaxonomyManagement({ kind }: { kind: TaxonomyKind }) {
  const { t, isMounted } = useTranslation();
  const copy = t.adminTaxonomies;
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);
  const [deleting, setDeleting] = useState<TaxonomyItem | null>(null);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", hex: "#CDE4FE", description: "", kind },
  });
  const currentHex = watch("hex");
  const isColor = kind === "color";
  const permission = permissions[kind];
  const queryRoot = isColor ? "colors" : "styles";

  const list = useQuery({
    queryKey: [queryRoot, "manage", search],
    queryFn: async (): Promise<PageResult<TaxonomyItem>> => isColor
      ? await colorService.getManagementList({ search: search || undefined, limit: 100 })
      : await styleService.getManagementList({ search: search || undefined, limit: 100 }),
  });

  const refresh = () => {
    client.invalidateQueries({ queryKey: [queryRoot, "manage"] });
    client.invalidateQueries({ queryKey: [`public-keyboard-${queryRoot}`] });
    client.invalidateQueries({ queryKey: ["public-keyboards"] });
  };

  const save = useMutation<TaxonomyItem, Error, Values>({
    mutationFn: async (values: Values): Promise<TaxonomyItem> => {
      const slug = values.slug || undefined;
      if (isColor) {
        const payload = { name: values.name, slug, hex: values.hex.toUpperCase() };
        return editing ? await colorService.update(editing.id, payload) : await colorService.create(payload);
      }
      const payload = { name: values.name, slug, description: values.description || undefined };
      return editing
        ? await styleService.update(editing.id, { ...payload, description: values.description || null })
        : await styleService.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? copy.updatedSuccess : copy.createdSuccess);
      setOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => isColor ? colorService.delete(id) : styleService.delete(id),
    onSuccess: () => {
      toast.success(copy.deletedSuccess);
      setDeleting(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error, copy.deleteInUseError)),
  });

  const showForm = (item?: TaxonomyItem) => {
    setEditing(item ?? null);
    reset({
      name: item?.name ?? "",
      slug: item?.slug ?? "",
      hex: item && "hex" in item ? item.hex : "#CDE4FE",
      description: item && "description" in item ? item.description ?? "" : "",
      kind,
    });
    setOpen(true);
  };

  const title = isColor ? copy.colorsTitle : copy.stylesTitle;
  const description = isColor ? copy.colorsDescription : copy.stylesDescription;
  const itemLabel = isColor ? copy.colorLabel : copy.styleLabel;
  const Icon = isColor ? Palette : Sparkles;

  return (
    <PermissionGate permission={permission.read} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Icon}
          title={isMounted ? title : (isColor ? "Quản lý màu sắc" : "Quản lý phong cách")}
          description={isMounted ? description : "Quản lý taxonomy dùng để phân loại và lọc theme."}
          actions={
            <PermissionGate permission={permission.create}>
              <Button onClick={() => showForm()}><Plus />{copy.addButton} {itemLabel.toLowerCase()}</Button>
            </PermissionGate>
          }
        />
        <Card>
          <CardContent className="pt-6 md:pt-8">
            <label className="relative block max-w-xl">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
              <Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.searchPlaceholder} />
            </label>
          </CardContent>
        </Card>
        <AsyncState loading={list.isLoading} error={list.isError} empty={!list.isLoading && !list.isError && !list.data?.data.length} emptyText={copy.empty} />
        {list.data?.data.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.data.data.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6 md:pt-8">
                  <div className="flex items-start gap-3">
                    {"hex" in item ? (
                      <div className="h-12 w-12 shrink-0 rounded-2xl border-2 border-kawaii-sky/60 shadow-inner" style={{ backgroundColor: item.hex }} aria-label={`${item.name}: ${item.hex}`} />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-kawaii-blush/45 text-kawaii-mocha shadow-inner"><Sparkles className="h-5 w-5" /></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-black text-kawaii-mocha">{item.name}</h2>
                      <p className="text-xs text-kawaii-mocha/55">/{item.slug}{"hex" in item ? ` · ${item.hex}` : ""}</p>
                    </div>
                  </div>
                  {"description" in item && item.description ? <p className="mt-4 line-clamp-2 text-sm font-medium text-kawaii-mocha/65">{item.description}</p> : null}
                  <p className="mt-4 text-sm font-semibold text-kawaii-mocha/65">{item.themeCount ?? 0} {copy.themeCount}</p>
                  <div className="mt-5 flex justify-end gap-2">
                    <PermissionGate permission={permission.update}>
                      <Button variant="outline" size="sm" onClick={() => showForm(item)}><Edit3 />{t.adminUi.edit}</Button>
                    </PermissionGate>
                    <PermissionGate permission={permission.delete}>
                      <Button variant="destructive" size="sm" onClick={() => setDeleting(item)}><Trash2 />{t.adminUi.delete}</Button>
                    </PermissionGate>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">{editing ? copy.editTitle : copy.createTitle} {itemLabel.toLowerCase()}</DialogTitle>
              <DialogDescription>{copy.dialogDescription}</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit((values) => save.mutate(values))}>
              <input type="hidden" {...register("kind")} />
              <Field label={`${copy.nameLabel} ${itemLabel.toLowerCase()}`} error={errors.name?.message}><Input {...register("name")} /></Field>
              <Field label={copy.slugLabel} error={errors.slug?.message}><Input {...register("slug")} placeholder={copy.slugPlaceholder} /></Field>
              {isColor ? (
                <Field label={copy.hexLabel} error={errors.hex?.message}>
                  <div className="flex items-center gap-3">
                    <label
                      className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-kawaii-sky/60 shadow-inner transition-all hover:scale-105 hover:border-kawaii-babyblue focus-within:ring-2 focus-within:ring-primary/40"
                      title={isMounted ? "Chọn màu từ bảng màu" : "Chọn màu từ bảng màu"}
                    >
                      <span
                        className="h-full w-full"
                        style={{ backgroundColor: hexRegex.test(currentHex) ? currentHex : "transparent" }}
                      />
                      <input
                        type="color"
                        value={toPickerHex(currentHex)}
                        onChange={(event) => setValue("hex", event.target.value.toUpperCase(), { shouldValidate: true })}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label={copy.hexLabel}
                      />
                    </label>
                    <Input {...register("hex")} placeholder="#CDE4FE" className="font-mono uppercase" />
                  </div>
                </Field>
              ) : (
                <Field label={copy.descriptionLabel} error={errors.description?.message}><Textarea {...register("description")} /></Field>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t.adminUi.cancel}</Button>
                <Button type="submit" disabled={save.isPending}>{save.isPending ? t.adminUi.saving : copy.saveButton}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(next) => !next && setDeleting(null)}
          title={copy.deleteTitle}
          description={deleting?.themeCount ? copy.deleteDescriptionWithThemes : copy.deleteDescription}
          busy={remove.isPending}
          onConfirm={() => deleting && remove.mutate(deleting.id)}
        />
      </div>
    </PermissionGate>
  );
}
