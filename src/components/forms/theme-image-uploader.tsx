"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Link2,
  LoaderCircle,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/errors";
import { keyboardService } from "@/services/keyboard.service";


const MAX_IMAGES = 10;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

interface ThemeImageUploaderProps {
  coverUrl: string;
  previewUrls: string[];
  onChange: (data: { coverUrl: string; previewUrls: string[] }) => void;
  disabled?: boolean;
}

export function ThemeImageUploader({
  coverUrl,
  previewUrls,
  onChange,
  disabled = false,
}: ThemeImageUploaderProps) {
  const { t, isMounted } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [, startTransition] = useTransition();

  // Danh sách toàn bộ ảnh hiện có (coverUrl + previewUrls)
  const allImages: string[] = [
    ...(coverUrl ? [coverUrl] : []),
    ...previewUrls.filter((url) => url !== coverUrl),
  ];

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Kiểm tra số lượng ảnh tối đa
    const currentCount = allImages.length;
    if (currentCount + files.length > MAX_IMAGES) {
      toast.error(
        isMounted
          ? t.adminKeyboards.maxImagesLimit
          : "Đã đạt giới hạn tối đa 10 ảnh",
      );
      return;
    }

    // Kiểm tra từng file
    const validFiles: File[] = [];
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(
          `${isMounted ? t.adminKeyboards.fileTypeInvalid : "Định dạng không hỗ trợ"}: ${file.name}`,
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `${isMounted ? t.adminKeyboards.fileTooLarge : "Vượt quá 10MB"}: ${file.name}`,
        );
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(
      isMounted
        ? t.adminKeyboards.uploadingImages
        : "Đang tải ảnh lên Cloudflare R2...",
    );

    try {
      // Tải trực tiếp các file lên R2 thông qua presigned URLs
      const uploadedUrls = await keyboardService.uploadMultipleImagesToR2(validFiles);

      startTransition(() => {
        let newCoverUrl = coverUrl;
        const newPreviewUrls = [...previewUrls];

        for (const url of uploadedUrls) {
          if (!newCoverUrl) {
            newCoverUrl = url;
          } else if (!newPreviewUrls.includes(url) && url !== newCoverUrl) {
            newPreviewUrls.push(url);
          }
        }

        onChange({
          coverUrl: newCoverUrl,
          previewUrls: newPreviewUrls,
        });
      });

      toast.success(
        isMounted
          ? t.adminKeyboards.uploadSuccess
          : "Đã tải ảnh lên R2 thành công",
        { id: toastId },
      );
    } catch (error: unknown) {
      toast.error(
        `${isMounted ? t.adminKeyboards.uploadError : "Tải ảnh thất bại"}: ${getErrorMessage(error)}`,
        { id: toastId },
      );
    } finally {

      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetCover = (targetUrl: string) => {
    if (targetUrl === coverUrl) return;
    const remaining = allImages.filter((url) => url !== targetUrl);
    onChange({
      coverUrl: targetUrl,
      previewUrls: remaining,
    });
  };

  const handleRemoveImage = (targetUrl: string) => {
    const remaining = allImages.filter((url) => url !== targetUrl);
    if (targetUrl === coverUrl) {
      const nextCover = remaining[0] || "";
      const nextPreviews = remaining.slice(1);
      onChange({
        coverUrl: nextCover,
        previewUrls: nextPreviews,
      });
    } else {
      onChange({
        coverUrl,
        previewUrls: previewUrls.filter((url) => url !== targetUrl),
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề và mô tả */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
            <Sparkles className="h-4 w-4 text-kawaii-mocha" />
          </div>
          <h4 className="text-sm font-bold text-kawaii-mocha">
            {isMounted ? t.adminKeyboards.uploadImages : "Hình ảnh theme"}
          </h4>
        </div>

        <Badge variant="outline" className="text-xs text-kawaii-mocha">
          {allImages.length} / {MAX_IMAGES} ảnh
        </Badge>
      </div>

      {/* Dropzone Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragging
            ? "border-kawaii-babyblue bg-kawaii-sky/30 scale-[1.01] shadow-[0_10px_30px_rgba(162,207,254,0.3)]"
            : "border-kawaii-sky/50 bg-kawaii-cloud/30 hover:border-kawaii-babyblue/80 hover:bg-kawaii-sky/20"
        } ${disabled || isUploading ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_MIME_TYPES.join(",")}
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner transition-transform group-hover:scale-110">
          {isUploading ? (
            <LoaderCircle className="h-7 w-7 animate-spin text-kawaii-mocha" />
          ) : (
            <UploadCloud className="h-7 w-7 text-kawaii-mocha" />
          )}
        </div>

        <p className="mt-3 text-sm font-bold text-kawaii-mocha">
          {isUploading
            ? (isMounted ? t.adminKeyboards.uploadingImages : "Đang tải ảnh lên R2...")
            : (isMounted ? t.adminKeyboards.dropzonePrompt : "Kéo thả nhiều file ảnh vào đây hoặc bấm để chọn ảnh")}
        </p>
        <p className="mt-1 text-xs text-kawaii-mocha/60">
          {isMounted
            ? t.adminKeyboards.dropzoneHint
            : "Hỗ trợ định dạng PNG, JPG, WebP, GIF, AVIF (Tối đa 10MB/file, tối đa 10 ảnh)"}
        </p>
      </div>

      {/* Grid danh sách ảnh đã tải lên */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {allImages.map((url, index) => {
            const isCover = url === coverUrl;

            return (
              <div
                key={url + index}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                  isCover
                    ? "border-kawaii-babyblue bg-kawaii-sky/20 shadow-[0_8px_20px_rgba(162,207,254,0.35)]"
                    : "border-kawaii-sky/30 bg-kawaii-cloud/30 hover:border-kawaii-sky/80 hover:shadow-md"
                }`}
              >
                {/* Image Preview */}
                <div className="relative aspect-video w-full bg-kawaii-cloud/40">
                  <Image
                    src={url}
                    alt={`Theme image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                  {/* Badge */}
                  <div className="absolute left-2 top-2 z-10">
                    {isCover ? (
                      <Badge className="bg-kawaii-babyblue text-xs font-bold text-kawaii-mocha shadow-sm">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {isMounted ? t.adminKeyboards.coverBadge : "Ảnh bìa chính"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs text-kawaii-mocha/80 shadow-sm">
                        {isMounted ? t.adminKeyboards.previewBadge : "Ảnh xem trước"} #{index}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Delete Overlay Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(url);
                    }}
                    disabled={disabled}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/85 text-white opacity-90 shadow transition-transform hover:scale-110 hover:bg-destructive"
                    title={isMounted ? t.adminKeyboards.removeImage : "Xóa ảnh"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between p-2">
                  {!isCover ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetCover(url)}
                      disabled={disabled}
                      className="h-7 w-full text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/30"
                    >
                      <Star className="mr-1 h-3 w-3 text-kawaii-mocha" />
                      {isMounted ? t.adminKeyboards.setAsCover : "Đặt làm ảnh bìa"}
                    </Button>
                  ) : (
                    <span className="w-full text-center text-xs font-bold text-kawaii-mocha/75">
                      {isMounted ? t.adminKeyboards.coverBadge : "Ảnh bìa chính"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expandable Manual URL Fallback Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="flex items-center gap-1.5 text-xs font-bold text-kawaii-mocha/70 hover:text-kawaii-mocha underline"
        >
          <Link2 className="h-3.5 w-3.5" />
          {isMounted ? t.adminKeyboards.manualUrlToggle : "Hoặc nhập URL thủ công"}
        </button>

        {showManualUrl && (
          <div className="mt-3 space-y-3 rounded-2xl border-2 border-kawaii-sky/35 bg-kawaii-cloud/20 p-3">
            <div>
              <label className="text-xs font-bold text-kawaii-mocha">
                {isMounted ? t.adminKeyboards.formCoverUrl : "URL ảnh bìa"}
              </label>
              <Input
                value={coverUrl}
                onChange={(e) =>
                  onChange({
                    coverUrl: e.target.value.trim(),
                    previewUrls,
                  })
                }
                placeholder="https://..."
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-kawaii-mocha">
                {isMounted ? t.adminKeyboards.formPreviewUrls : "URL ảnh xem trước, mỗi dòng một URL"}
              </label>
              <Textarea
                value={previewUrls.join("\n")}
                onChange={(e) =>
                  onChange({
                    coverUrl,
                    previewUrls: e.target.value
                      .split("\n")
                      .map((u) => u.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="https://...&#10;https://..."
                className="mt-1"
                rows={3}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
