"use client";

import { useEffect, useRef, useState } from "react";
import {
  Crop,
  FlipHorizontal,
  LoaderCircle,
  Move,
  RotateCcw,
  RotateCw,
  Sparkles,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";

interface AvatarCropDialogProps {
  open: boolean;
  imageFile: File | null;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (croppedFile: File) => Promise<void>;
}

export function AvatarCropDialog({
  open,
  imageFile,
  onOpenChange,
  onCropComplete,
}: AvatarCropDialogProps) {
  const { t, isMounted } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Natural image dimensions
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // Transformations (no zoom, image covers the frame automatically)
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipX, setFlipX] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const viewportSize = 256;

  // Boundary Clamping calculation: strictly prevents dragging past frame boundaries
  const getClampedPosition = (
    pos: { x: number; y: number },
    rot: number,
    size: { width: number; height: number }
  ) => {
    if (!size.width || !size.height) return { x: 0, y: 0 };
    const isRot = rot === 90 || rot === 270;
    const effW = isRot ? size.height : size.width;
    const effH = isRot ? size.width : size.height;

    const coverScale = Math.max(viewportSize / effW, viewportSize / effH);
    const dispW = effW * coverScale;
    const dispH = effH * coverScale;

    const maxDeltaX = Math.max(0, (dispW - viewportSize) / 2);
    const maxDeltaY = Math.max(0, (dispH - viewportSize) / 2);

    return {
      x: Math.max(-maxDeltaX, Math.min(maxDeltaX, pos.x)),
      y: Math.max(-maxDeltaY, Math.min(maxDeltaY, pos.y)),
    };
  };

  // Load image object URL when imageFile changes
  useEffect(() => {
    if (!imageFile) {
      setImageSrc(null);
      setNaturalSize({ width: 0, height: 0 });
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImageSrc(url);
    // Reset transformations
    setRotation(0);
    setFlipX(false);
    setPosition({ x: 0, y: 0 });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  // Image load handler to get natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    setPosition({ x: 0, y: 0 });
  };

  // Drag / Pan handlers with boundary constraints
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const rawPos = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setPosition(getClampedPosition(rawPos, rotation, naturalSize));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Reset transformations
  const handleReset = () => {
    setRotation(0);
    setFlipX(false);
    setPosition({ x: 0, y: 0 });
  };

  // Rotate 90 degrees with position reclamping
  const handleRotateLeft = () => {
    const nextRotation = (rotation - 90 + 360) % 360;
    setRotation(nextRotation);
    setPosition((prev) => getClampedPosition(prev, nextRotation, naturalSize));
  };

  const handleRotateRight = () => {
    const nextRotation = (rotation + 90) % 360;
    setRotation(nextRotation);
    setPosition((prev) => getClampedPosition(prev, nextRotation, naturalSize));
  };

  // Flip horizontal
  const handleFlipHorizontal = () => {
    setFlipX((prev) => !prev);
  };

  // Calculate cover dimensions inside the 256px viewport
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const effectiveW = isRotated90or270 ? naturalSize.height : naturalSize.width;
  const effectiveH = isRotated90or270 ? naturalSize.width : naturalSize.height;

  const baseCoverScale =
    effectiveW && effectiveH
      ? Math.max(viewportSize / effectiveW, viewportSize / effectiveH)
      : 1;

  const previewWidth = naturalSize.width ? naturalSize.width * baseCoverScale : viewportSize;
  const previewHeight = naturalSize.height ? naturalSize.height * baseCoverScale : viewportSize;

  const clampedPos = getClampedPosition(position, rotation, naturalSize);

  // Crop & Export to 512x512 WebP (Cover fit automatically without blank borders)
  const handleConfirm = async () => {
    const img = imageRef.current;
    if (!img) return;

    setIsProcessing(true);
    try {
      const outputSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const scaleToOutput = outputSize / viewportSize;

      ctx.save();
      // Translate to canvas center
      ctx.translate(outputSize / 2, outputSize / 2);

      // Apply Clamped User Pan/Translation (scaled to output size)
      ctx.translate(clampedPos.x * scaleToOutput, clampedPos.y * scaleToOutput);

      // Apply Rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply Flip
      ctx.scale(flipX ? -1 : 1, 1);

      // Cover calculation for 512x512 output
      const imgNaturalWidth = img.naturalWidth || naturalSize.width;
      const imgNaturalHeight = img.naturalHeight || naturalSize.height;

      const outputCoverScale = Math.max(
        outputSize / (isRotated90or270 ? imgNaturalHeight : imgNaturalWidth),
        outputSize / (isRotated90or270 ? imgNaturalWidth : imgNaturalHeight)
      );

      const drawWidth = imgNaturalWidth * outputCoverScale;
      const drawHeight = imgNaturalHeight * outputCoverScale;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      ctx.restore();

      // Convert canvas to Blob (WebP 95% quality)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.95);
      });

      if (!blob) throw new Error("Failed to process cropped avatar");

      const croppedFile = new File([blob], "avatar.webp", {
        type: "image/webp",
      });

      await onCropComplete(croppedFile);
      onOpenChange(false);
    } catch (error) {
      console.error("Crop error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-[2.5rem] border-2 border-kawaii-sky/70 bg-card p-6 shadow-cloud">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner">
              <Crop className="h-4 w-4 text-kawaii-warmbrown" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-kawaii-mocha">
                {isMounted ? t.profile.cropAvatarTitle : "Căn chỉnh ảnh đại diện"}
              </DialogTitle>
              <DialogDescription className="text-xs text-kawaii-mocha/70 mt-0.5">
                {isMounted
                  ? t.profile.cropAvatarDesc
                  : "Hỗ trợ PNG, JPG, WEBP, GIF (tối đa 5MB)"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Cropping Viewport: Fixed 256x256 Circular Window */}
          <div className="relative mx-auto flex items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-kawaii-sky/70 bg-kawaii-cloud/30 p-3 select-none">
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative h-64 w-64 cursor-grab overflow-hidden rounded-full border-4 border-kawaii-sky bg-card shadow-cloud touch-none active:cursor-grabbing"
            >
              {imageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  draggable={false}
                  style={{
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: `translate(calc(-50% + ${clampedPos.x}px), calc(-50% + ${clampedPos.y}px)) rotate(${rotation}deg) scale(${flipX ? -1 : 1}, 1)`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                  }}
                  className="pointer-events-none absolute left-1/2 top-1/2"
                />
              )}

              {/* Center Crosshair Indicator */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
                <Move className="h-6 w-6 text-kawaii-mocha" />
              </div>
            </div>
          </div>

          {/* Quick Guidance Hint */}
          <div className="flex items-center justify-between text-xs px-2 text-kawaii-mocha/60">
            <span className="flex items-center gap-1 font-semibold text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-kawaii-warmbrown" />
              {isMounted ? "Kéo ảnh để căn chỉnh ngang / dọc (giới hạn trong khung)" : "Drag image to adjust alignment"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 text-xs font-bold gap-1 rounded-xl text-kawaii-mocha/70 hover:bg-kawaii-cloud hover:text-kawaii-mocha"
            >
              <Undo2 className="h-3 w-3" />
              {isMounted ? t.profile.reset : "Đặt lại"}
            </Button>
          </div>

          {/* Transform Action Buttons: Rotate & Flip */}
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-kawaii-sky/50 bg-kawaii-cloud/30 p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotateLeft}
              className="h-9 rounded-xl border-kawaii-sky/50 bg-card text-xs font-bold gap-1.5 text-kawaii-mocha hover:bg-kawaii-sky/30 bouncy-hover"
            >
              <RotateCcw className="h-3.5 w-3.5 text-kawaii-warmbrown" />
              <span>{isMounted ? t.profile.rotateLeft : "Xoay trái"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotateRight}
              className="h-9 rounded-xl border-kawaii-sky/50 bg-card text-xs font-bold gap-1.5 text-kawaii-mocha hover:bg-kawaii-sky/30 bouncy-hover"
            >
              <RotateCw className="h-3.5 w-3.5 text-kawaii-warmbrown" />
              <span>{isMounted ? t.profile.rotateRight : "Xoay phải"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFlipHorizontal}
              className="h-9 rounded-xl border-kawaii-sky/50 bg-card text-xs font-bold gap-1.5 text-kawaii-mocha hover:bg-kawaii-sky/30 bouncy-hover"
            >
              <FlipHorizontal className="h-3.5 w-3.5 text-kawaii-warmbrown" />
              <span>{isMounted ? t.profile.flipHorizontal : "Lật ngang"}</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="rounded-2xl text-xs font-bold"
          >
            {isMounted ? t.profile.cancelBtn : "Hủy bỏ"}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing || !imageSrc}
            className="rounded-2xl px-6 font-bold text-xs shadow-cloud gap-2 bouncy-hover"
          >
            {isProcessing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Crop className="h-4 w-4" />
            )}
            <span>
              {isProcessing
                ? (isMounted ? t.profile.cropping : "Đang xử lý...")
                : (isMounted ? t.profile.confirmCropBtn : "Cắt & Tải lên")}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
