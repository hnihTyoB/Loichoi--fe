"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Copy,
  Download,
  Flag,
  Loader2,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, selectClassName, ConfirmDialog } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { useImportJob, useApproveImport, useUpdateDraft, useRejectImport, useReprocessImport } from "@/hooks/use-imports";
import { PERMISSIONS } from "@/lib/constants";
import type { UpdateDraftPayload, ImportFlag } from "@/types/import.types";
import { getMinConfidence } from "@/types/import.types";

// ──────────────────────────────────────────────
// Confidence bar component
// ──────────────────────────────────────────────

function ConfidenceBar({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const color = value >= 0.9 ? "bg-emerald-400" : value >= 0.7 ? "bg-amber-400" : "bg-red-400";
  const textColor = value >= 0.9 ? "text-emerald-600 font-bold" : value >= 0.7 ? "text-amber-600 font-semibold" : "text-red-500 font-semibold";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-kawaii-mocha/70 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-kawaii-cloud/80 overflow-hidden shadow-inner border border-kawaii-sky/20">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className={`text-xs tabular-nums w-10 text-right ${textColor}`}>{pct}%</span>
    </div>
  );
}

// ──────────────────────────────────────────────
// Flag badge
// ──────────────────────────────────────────────

const FLAG_LABELS: Record<ImportFlag, { label: string; className: string }> = {
  MISSING_COVER: { label: "Thiếu ảnh bìa", className: "bg-red-100 text-red-700 border-red-200" },
  MISSING_DOWNLOAD: { label: "Thiếu link tải", className: "bg-red-100 text-red-700 border-red-200" },
  DRIVE_LINK_UNREACHABLE: { label: "Drive không truy cập được", className: "bg-orange-100 text-orange-700 border-orange-200" },
  LOW_CONFIDENCE: { label: "Độ tin cậy AI thấp", className: "bg-amber-100 text-amber-700 border-amber-200" },
  OUT_OF_TAXONOMY: { label: "Chưa phân loại", className: "bg-purple-100 text-purple-700 border-purple-200" },
  POSSIBLE_DUPLICATE: { label: "Nghi ngờ trùng lặp", className: "bg-purple-100 text-purple-700 border-purple-200" },
  MISSING_THREAD_NAME: { label: "Thiếu tên thread", className: "bg-slate-100 text-slate-600 border-slate-200" },
  REF_NUMBER_NOT_FOUND: { label: "Không có mã #", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────

export default function ImportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data, isLoading } = useImportJob(id);
  const job = data?.data;
  const draft = job?.draft;

  // Local form state
  const [form, setForm] = useState<UpdateDraftPayload>({});
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // Sync form with loaded data
  useEffect(() => {
    if (draft) {
      setForm({
        englishName: draft.englishName ?? "",
        description: draft.description ?? "",
        platform: draft.platform ?? undefined,
        downloadSource: draft.downloadSource ?? undefined,
        downloadUrl: draft.downloadUrl ?? "",
        suggestedCategoryIds: draft.suggestedCategoryIds,
        suggestedColorIds: draft.suggestedColorIds,
        suggestedStyleIds: draft.suggestedStyleIds,
        adminNotes: draft.adminNotes ?? "",
      });
    }
  }, [draft]);

  const updateDraftMutation = useUpdateDraft(id);
  const approveMutation = useApproveImport();
  const rejectMutation = useRejectImport();
  const reprocessMutation = useReprocessImport();

  async function handleSaveDraft() {
    await updateDraftMutation.mutateAsync(form);
  }

  async function handleApprove() {
    // Save draft first, then approve
    await updateDraftMutation.mutateAsync(form);
    await approveMutation.mutateAsync(id);
    router.push("/imports");
  }

  async function handleRejectConfirm() {
    await rejectMutation.mutateAsync({ id, reason: rejectReason || undefined });
    setRejectOpen(false);
    router.push("/imports");
  }

  async function handleReprocess() {
    await reprocessMutation.mutateAsync(id);
  }

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center h-64 text-kawaii-mocha/50 text-sm font-semibold">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Đang tải thông tin chi tiết...
      </div>
    );
  }

  const allImages = [
    ...(draft?.coverUrl ? [draft.coverUrl] : []),
    ...(draft?.previewUrls ?? []),
  ];

  const isPublished = job.status === "IMPORTED";
  const minConf = draft ? getMinConfidence(draft) : null;

  return (
    <PermissionGate permission={PERMISSIONS.IMPORT_READ}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ─── Back + header ─── */}
        <div className="flex items-center gap-3">
          <Link href="/imports">
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 text-kawaii-mocha/60 hover:text-kawaii-mocha hover:bg-kawaii-sky/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-kawaii-mocha font-display tracking-tight truncate">
                {draft?.englishName ?? job.thread.originalName}
              </h1>
              {job.thread.discordReferenceNumber && (
                <span className="text-xs text-kawaii-babyblue font-mono font-black bg-kawaii-sky/30 border border-kawaii-sky/40 px-2.5 py-0.5 rounded-lg shadow-sm">
                  #{job.thread.discordReferenceNumber}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isPublished
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }`}
              >
                {job.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-kawaii-mocha/55 mt-0.5 truncate font-medium">
              Thread gốc: {job.thread.originalName} · Job ID: {job.id.slice(0, 8)}…
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left column: Images ─── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-kawaii-cloud/50 border-2 border-kawaii-sky/30 shadow-sm relative">
              {allImages[selectedImage] ? (
                <Image
                  src={allImages[selectedImage]}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-kawaii-mocha/40">
                  <AlertTriangle className="h-8 w-8 text-amber-400" />
                  <span className="text-xs font-semibold">Chưa có ảnh bìa</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`h-16 w-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-kawaii-babyblue shadow-md scale-105"
                        : "border-kawaii-sky/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt="" width={64} height={64} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Flags */}
            {(draft?.flags?.length ?? 0) > 0 && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-card/60 border border-kawaii-sky/30">
                <p className="text-xs font-bold text-kawaii-mocha/70 flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5 text-amber-500" /> Cảnh báo hệ thống
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft!.flags!.map((flag) => {
                    const cfg = FLAG_LABELS[flag as ImportFlag];
                    return cfg ? (
                      <span key={flag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    ) : (
                      <span key={flag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-slate-100 text-slate-600 border-slate-200">
                        {flag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Duplicate warning */}
            {draft?.isDuplicateCandidate && (
              <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                <Copy className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Nghi ngờ trùng lặp. {draft.duplicateReason && `Tiêu chí trùng: ${draft.duplicateReason}`}</span>
              </div>
            )}

            {/* Download info */}
            {draft?.downloadUrl && (
              <div className="p-3.5 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 space-y-1.5">
                <p className="text-xs font-bold text-kawaii-mocha/70 flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-kawaii-babyblue" /> Liên kết tải / Tin nhắn nguồn
                </p>
                <p className="text-xs text-kawaii-mocha/80 font-mono break-all font-semibold">
                  {draft.downloadFileName ?? (draft.downloadUrl.includes("discord.com") ? "Tin nhắn Discord chứa file" : "Google Drive Link")}
                </p>
                <a
                  href={draft.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-kawaii-babyblue hover:underline font-bold pt-1"
                >
                  {draft.downloadUrl.includes("discord.com") ? "Mở tin nhắn Discord gốc" : "Mở liên kết tải về"} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* ─── Right column: Edit form ─── */}
          <div className="lg:col-span-2 space-y-5">
            {/* English name */}
            <Field label="Tên tiếng Anh (English Name) *">
              <Input
                value={form.englishName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, englishName: e.target.value }))}
                placeholder="VD: Sakura Dream Keyboard Theme"
                className="h-11 rounded-2xl border-2 border-input bg-background text-sm font-semibold"
                disabled={isPublished}
              />
            </Field>

            {/* Description */}
            <Field label="Mô tả bàn phím (Description)">
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả phong cách, tone màu và thiết kế..."
                className="rounded-2xl border-2 border-input bg-background resize-none text-sm"
                rows={3}
                disabled={isPublished}
              />
            </Field>

            {/* Platform & Download Source & Access Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Nền tảng hỗ trợ (Platform)">
                <select
                  value={form.platform ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, platform: (e.target.value || undefined) as any }))}
                  className={selectClassName}
                  disabled={isPublished}
                >
                  <option value="">Chọn nền tảng</option>
                  <option value="IOS">iOS (.bdi)</option>
                  <option value="ANDROID">Android (.bds)</option>
                  <option value="BOTH">Cả hai (Both)</option>
                </select>
              </Field>

              <Field label="Nguồn tải (Download Source)">
                <select
                  value={form.downloadSource ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, downloadSource: (e.target.value || undefined) as any }))}
                  className={selectClassName}
                  disabled={isPublished}
                >
                  <option value="">Chọn nguồn tải</option>
                  <option value="GOOGLE_DRIVE">Google Drive</option>
                  <option value="DISCORD_ATTACHMENT">Discord Attachment</option>
                </select>
              </Field>

              <Field label="Quyền truy cập (Access Tier)">
                <div className="h-11 px-3 rounded-2xl border-2 border-kawaii-sky/30 bg-kawaii-sky/15 flex items-center gap-1.5 text-xs font-bold text-kawaii-babyblue">
                  <span>💎 Thành viên Discord</span>
                </div>
              </Field>
            </div>

            {/* Download URL override */}
            <Field label="URL tải về (Download URL)">
              <Input
                value={form.downloadUrl ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className="h-11 rounded-2xl border-2 border-input bg-background font-mono text-xs"
                disabled={isPublished}
              />
            </Field>

            {/* AI Suggested Tags / Categories */}
            {draft && (draft.suggestedCategoryIds.length > 0 || draft.suggestedColorIds.length > 0 || draft.suggestedStyleIds.length > 0) && (
              <div className="p-4 rounded-3xl bg-kawaii-cloud/30 border border-kawaii-sky/30 space-y-2.5">
                <p className="text-xs font-bold text-kawaii-mocha/80 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-kawaii-babyblue" /> Phân loại tự động (AI Suggested Tags)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.suggestedCategoryIds.map((id) => (
                    <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      📂 Danh mục: {id.slice(0, 8)}
                    </span>
                  ))}
                  {draft.suggestedColorIds.map((id) => (
                    <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                      🎨 Màu sắc: {id.slice(0, 8)}
                    </span>
                  ))}
                  {draft.suggestedStyleIds.map((id) => (
                    <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      ✨ Phong cách: {id.slice(0, 8)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Confidence bars */}
            {draft && (
              <div className="p-4 rounded-3xl bg-card/70 border-2 border-kawaii-sky/30 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-kawaii-mocha/80 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-kawaii-babyblue" /> Độ tin cậy AI (Confidence Breakdown)
                  </p>
                  {minConf !== null && (
                    <span className={`text-xs font-bold ${minConf >= 0.9 ? "text-emerald-600" : minConf >= 0.7 ? "text-amber-600" : "text-red-500"}`}>
                      Thấp nhất: {Math.round(minConf * 100)}%
                    </span>
                  )}
                </div>
                <ConfidenceBar label="Tên gọi" value={draft.confidenceName} />
                <ConfidenceBar label="Danh mục" value={draft.confidenceCategory} />
                <ConfidenceBar label="Màu sắc" value={draft.confidenceColor} />
                <ConfidenceBar label="Phong cách" value={draft.confidenceStyle} />
                <ConfidenceBar label="Mô tả" value={draft.confidenceDescription} />
              </div>
            )}

            {/* Admin notes */}
            <Field label="Ghi chú nội bộ quản trị (Admin Notes)">
              <Textarea
                value={form.adminNotes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
                placeholder="Ghi chú nội bộ về bản draft này..."
                className="rounded-2xl border-2 border-input bg-background resize-none text-xs"
                rows={2}
              />
            </Field>

            {/* ─── Action buttons ─── */}
            {!isPublished ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PermissionGate permission={PERMISSIONS.IMPORT_MANAGE}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl border-kawaii-sky/50 text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/30 bouncy-hover"
                    onClick={handleSaveDraft}
                    disabled={updateDraftMutation.isPending}
                  >
                    {updateDraftMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : null}
                    Lưu nháp
                  </Button>
                </PermissionGate>

                <PermissionGate permission={PERMISSIONS.IMPORT_MANAGE}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-700 bouncy-hover"
                    onClick={handleReprocess}
                    disabled={reprocessMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${reprocessMutation.isPending ? "animate-spin" : ""}`} />
                    Chạy lại Parser
                  </Button>
                </PermissionGate>

                <PermissionGate permission={PERMISSIONS.IMPORT_APPROVE}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl border-destructive/40 text-xs font-bold text-destructive hover:bg-destructive/10 bouncy-hover"
                    onClick={() => setRejectOpen(true)}
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Từ chối
                  </Button>

                  <Button
                    type="button"
                    className="h-11 rounded-2xl bg-kawaii-babyblue hover:bg-kawaii-babyblue/90 text-white text-xs font-bold shadow-md ml-auto bouncy-hover"
                    onClick={handleApprove}
                    disabled={approveMutation.isPending || updateDraftMutation.isPending}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    )}
                    Duyệt & Phát hành
                  </Button>
                </PermissionGate>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold">Bàn phím đã được phát hành thành công!</p>
                  {draft?.keyboardThemeId && (
                    <Link
                      href="/keyboards/manage"
                      className="text-xs text-emerald-700 hover:underline font-semibold"
                    >
                      Xem trong danh sách Quản trị theme →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Reject Confirm Dialog ─── */}
        <ConfirmDialog
          open={rejectOpen}
          onOpenChange={setRejectOpen}
          title="Từ chối bản Import này?"
          description="Bản import sẽ được đánh dấu là SKIPPED (đã bỏ qua) và không xuất hiện trong danh sách cần duyệt."
          confirmText="Xác nhận từ chối"
          cancelText="Hủy"
          busy={rejectMutation.isPending}
          onConfirm={handleRejectConfirm}
        />
      </div>
    </PermissionGate>
  );
}
