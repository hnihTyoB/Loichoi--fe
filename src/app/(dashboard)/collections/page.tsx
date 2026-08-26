"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Images, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, ConfirmDialog, Field, PageHeader, selectClassName } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { collectionService } from "@/services/collection.service";
import { keyboardService } from "@/services/keyboard.service";
import type { AdminCollection } from "@/types/admin.types";

const schema = z.object({
  name: z.string().min(3, "Tên cần ít nhất 3 ký tự").max(100),
  slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"),
  description: z.string().max(1000),
  coverUrl: z.string().refine((value) => !value || z.string().url().safeParse(value).success, "URL ảnh không hợp lệ"),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
});
type Values = z.infer<typeof schema>;

export default function CollectionsPage() {
  const { t, isMounted } = useTranslation();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCollection | null>(null);
  const [deleting, setDeleting] = useState<AdminCollection | null>(null);
  const [manager, setManager] = useState<AdminCollection | null>(null);
  const [themeId, setThemeId] = useState("");
  const [position, setPosition] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", coverUrl: "", isPublic: true, isFeatured: false },
  });

  const list = useQuery({
    queryKey: ["collections", search],
    queryFn: () => collectionService.getList({ search: search || undefined, limit: 100 }),
  });
  const themes = useQuery({
    queryKey: ["keyboards", "manage", "collection-options"],
    queryFn: () => keyboardService.getManagementList({ limit: 100 }),
  });

  const refresh = () => client.invalidateQueries({ queryKey: ["collections"] });
  const save = useMutation({
    mutationFn: async (values: Values) => {
      const payload = {
        ...values,
        slug: values.slug || undefined,
        description: values.description || undefined,
        coverUrl: values.coverUrl || undefined,
      };
      return editing ? collectionService.update(editing.id, payload) : collectionService.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? (isMounted ? t.adminCollections.updatedSuccess : "Đã cập nhật bộ sưu tập") : (isMounted ? t.adminCollections.createdSuccess : "Đã tạo bộ sưu tập"));
      setFormOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: collectionService.delete,
    onSuccess: () => {
      toast.success(isMounted ? t.adminCollections.deletedSuccess : "Đã xóa bộ sưu tập");
      setDeleting(null);
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const addTheme = useMutation({
    mutationFn: () => collectionService.addTheme(manager!.id, themeId, position ? Number(position) : undefined),
    onSuccess: async () => {
      toast.success(isMounted ? t.adminCollections.themeAddedSuccess : "Đã thêm theme");
      setThemeId("");
      setPosition("");
      if (manager) setManager(await collectionService.getBySlug(manager.slug));
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeTheme = useMutation({
    mutationFn: (id: string) => collectionService.removeTheme(manager!.id, id),
    onSuccess: async () => {
      toast.success(isMounted ? t.adminCollections.themeRemovedSuccess : "Đã gỡ theme");
      if (manager) setManager(await collectionService.getBySlug(manager.slug));
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const showForm = (item?: AdminCollection) => {
    setEditing(item ?? null);
    reset(
      item
        ? { name: item.name, slug: item.slug, description: item.description ?? "", coverUrl: item.coverUrl ?? "", isPublic: item.isPublic, isFeatured: item.isFeatured }
        : { name: "", slug: "", description: "", coverUrl: "", isPublic: true, isFeatured: false },
    );
    setFormOpen(true);
  };

  const showManager = async (item: AdminCollection) => {
    try {
      setManager(await collectionService.getBySlug(item.slug));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.COLLECTION_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={Images}
          title={isMounted ? t.adminCollections.title : "Quản lý bộ sưu tập"}
          description={isMounted ? t.adminCollections.description : "Biên tập các nhóm theme nổi bật và thứ tự hiển thị."}
          actions={
            <PermissionGate permission={PERMISSIONS.COLLECTION_CREATE}>
              <Button onClick={() => showForm()}>
                <Plus />
                {isMounted ? t.adminCollections.createCollection : "Tạo bộ sưu tập"}
              </Button>
            </PermissionGate>
          }
        />
        <Card>
          <CardContent className="pt-6 md:pt-8">
            <label className="relative block max-w-xl">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
              <Input
                className="pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={isMounted ? t.adminCollections.searchPlaceholder : "Tìm bộ sưu tập..."}
              />
            </label>
          </CardContent>
        </Card>
        <AsyncState
          loading={list.isLoading}
          error={list.isError}
          empty={!list.isLoading && !list.isError && !list.data?.data.length}
          emptyText={isMounted ? t.adminCollections.noCollections : "Chưa có bộ sưu tập công khai"}
        />
        {list.data?.data.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.data.data.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6 md:pt-8">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-kawaii-mocha">{item.name}</h2>
                      <p className="text-xs text-kawaii-mocha/55">/{item.slug}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={item.isPublic ? "default" : "secondary"}>
                        {item.isPublic
                          ? (isMounted ? t.adminCollections.public : "Công khai")
                          : (isMounted ? t.adminCollections.private : "Riêng tư")}
                      </Badge>
                      {item.isFeatured && <Badge variant="outline">{isMounted ? t.adminCollections.featured : "Nổi bật"}</Badge>}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm text-kawaii-mocha/65">
                    {item.description || (isMounted ? t.adminCollections.noDescription : "Chưa có mô tả")}
                  </p>
                  <p className="mt-4 text-sm font-bold text-kawaii-mocha">
                    {item.itemsCount} {isMounted ? t.adminCollections.themesCount : "theme"}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <PermissionGate permission={PERMISSIONS.COLLECTION_UPDATE}>
                      <Button variant="outline" size="sm" onClick={() => showManager(item)}>
                        <Images />
                        {isMounted ? t.adminCollections.themesBtn : "Theme"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => showForm(item)}>
                        <Edit3 />
                        {isMounted ? t.adminUi.edit : "Sửa"}
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission={PERMISSIONS.COLLECTION_DELETE}>
                      <Button variant="destructive" size="icon" onClick={() => setDeleting(item)} aria-label={isMounted ? t.adminUi.delete : "Xóa"}>
                        <Trash2 />
                      </Button>
                    </PermissionGate>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {editing
                  ? (isMounted ? t.adminCollections.editTitle : "Chỉnh sửa bộ sưu tập")
                  : (isMounted ? t.adminCollections.createTitle : "Tạo bộ sưu tập")}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminCollections.formDesc : "Thiết lập metadata và phạm vi hiển thị."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit((values) => save.mutate(values))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={isMounted ? t.adminCollections.nameLabel : "Tên"} error={errors.name?.message}>
                  <Input {...register("name")} />
                </Field>
                <Field label={isMounted ? t.adminCollections.slugLabel : "Slug"} error={errors.slug?.message}>
                  <Input {...register("slug")} />
                </Field>
              </div>
              <Field label={isMounted ? t.adminCollections.descLabel : "Mô tả"} error={errors.description?.message}>
                <Textarea {...register("description")} />
              </Field>
              <Field label={isMounted ? t.adminCollections.coverUrlLabel : "URL ảnh bìa"} error={errors.coverUrl?.message}>
                <Input {...register("coverUrl")} />
              </Field>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-2xl bg-kawaii-sky/20 p-3 text-sm font-bold text-kawaii-mocha">
                  <input type="checkbox" {...register("isPublic")} />
                  {isMounted ? t.adminCollections.publicLabel : "Công khai"}
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-kawaii-blush/25 p-3 text-sm font-bold text-kawaii-mocha">
                  <input type="checkbox" {...register("isFeatured")} />
                  {isMounted ? t.adminCollections.featuredLabel : "Nổi bật"}
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  {isMounted ? t.adminUi.cancel : "Hủy"}
                </Button>
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending
                    ? (isMounted ? t.adminUi.saving : "Đang lưu...")
                    : (isMounted ? t.adminUi.save : "Lưu")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={Boolean(manager)} onOpenChange={(next) => !next && setManager(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? `${t.adminCollections.manageThemesTitlePrefix} ${manager?.name ?? ""}` : `Theme trong ${manager?.name ?? ""}`}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminCollections.manageThemesDesc : "Chọn theme và vị trí để thêm vào bộ sưu tập."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-[1fr_110px_auto]">
              <select className={selectClassName} value={themeId} onChange={(event) => setThemeId(event.target.value)}>
                <option value="">{isMounted ? t.adminCollections.selectThemePlaceholder : "Chọn theme"}</option>
                {themes.data?.data.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={0}
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                placeholder={isMounted ? t.adminCollections.positionPlaceholder : "Vị trí"}
              />
              <Button disabled={!themeId || addTheme.isPending} onClick={() => addTheme.mutate()}>
                <Plus />
                {isMounted ? t.adminCollections.addThemeBtn : "Thêm"}
              </Button>
            </div>
            <div className="space-y-2">
              {manager?.items?.length ? (
                manager.items
                  .sort((a, b) => a.position - b.position)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-kawaii-sky/40 bg-kawaii-cloud/25 p-3">
                      <div>
                        <p className="font-bold text-kawaii-mocha">{item.theme.name}</p>
                        <p className="text-xs text-kawaii-mocha/55">
                          {isMounted ? `${t.adminCollections.positionLabel} ${item.position}` : `Vị trí ${item.position}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={isMounted ? t.adminCollections.removeThemeAria : "Gỡ theme"}
                        disabled={removeTheme.isPending}
                        onClick={() => removeTheme.mutate(item.theme.id)}
                      >
                        <X />
                      </Button>
                    </div>
                  ))
              ) : (
                <AsyncState
                  empty
                  emptyText={isMounted ? t.adminCollections.noThemesInCollection : "Bộ sưu tập chưa có theme"}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(next) => !next && setDeleting(null)}
          title={isMounted ? t.adminCollections.deleteTitle : "Xóa bộ sưu tập?"}
          description={
            isMounted
              ? `${t.adminCollections.deleteDescriptionPrefix} "${deleting?.name ?? ""}" ${t.adminCollections.deleteDescriptionSuffix}`
              : `Bộ sưu tập “${deleting?.name ?? ""}” và các liên kết theme sẽ bị xóa.`
          }
          busy={remove.isPending}
          onConfirm={() => deleting && remove.mutate(deleting.id)}
        />
      </div>
    </PermissionGate>
  );
}
