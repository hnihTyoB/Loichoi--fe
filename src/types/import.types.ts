// ──────────────────────────────────────────────
// Import Job & Draft Types (FE)
// ──────────────────────────────────────────────

export type ImportJobStatus =
  | 'DISCOVERED'
  | 'PROCESSING'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'IMPORTED'
  | 'FAILED'
  | 'DUPLICATE'
  | 'SKIPPED';

export type ImportJobPhase = 'COLLECT' | 'NORMALIZE' | 'PARSE' | 'AI' | 'DRAFT' | 'DONE';

export type DraftValidationStatus = 'PENDING' | 'VALID' | 'INVALID';

export type DownloadSource = 'GOOGLE_DRIVE' | 'DISCORD_ATTACHMENT';

export type Platform = 'IOS' | 'ANDROID' | 'BOTH';

export type ImportFlag =
  | 'MISSING_COVER'
  | 'MISSING_DOWNLOAD'
  | 'DRIVE_LINK_UNREACHABLE'
  | 'LOW_CONFIDENCE'
  | 'OUT_OF_TAXONOMY'
  | 'POSSIBLE_DUPLICATE'
  | 'MISSING_THREAD_NAME'
  | 'REF_NUMBER_NOT_FOUND';

export interface DiscordThreadDto {
  id: string;
  discordThreadId: string;
  discordReferenceNumber: number | null;
  originalName: string;
  createdAtDiscord: string | null;
  createdAt: string;
}

export interface SuggestedTagItem {
  type: 'category' | 'color' | 'style';
  name: string;
  confidence: number;
}

export interface ImportDraftDto {
  id: string;
  englishName: string | null;
  description: string | null;
  platform: Platform | null;
  downloadSource: DownloadSource | null;
  downloadUrl: string | null;
  downloadDiscordMsgId: string | null;
  downloadFileName: string | null;
  coverUrl: string | null;
  previewUrls: string[];
  isDuplicateCandidate: boolean;
  duplicateOfId: string | null;
  duplicateReason: string | null;
  flags: ImportFlag[] | null;
  validationStatus: DraftValidationStatus;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  keyboardThemeId: string | null;

  // AI confidence
  confidenceName: number | null;
  confidenceCategory: number | null;
  confidenceColor: number | null;
  confidenceStyle: number | null;
  confidenceDescription: number | null;

  // Taxonomy IDs
  suggestedCategoryIds: string[];
  suggestedColorIds: string[];
  suggestedStyleIds: string[];
  suggestedTags: SuggestedTagItem[] | null;

  createdAt: string;
  updatedAt: string;
}

export interface ImportJobDto {
  id: string;
  status: ImportJobStatus;
  phase: ImportJobPhase;
  retryCount: number;
  lastError: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  thread: DiscordThreadDto;
  draft: ImportDraftDto | null;
}

// ──────────────────────────────────────────────
// Computed helpers
// ──────────────────────────────────────────────

export function getMinConfidence(draft: ImportDraftDto): number | null {
  const values = [
    draft.confidenceName,
    draft.confidenceCategory,
    draft.confidenceColor,
    draft.confidenceStyle,
    draft.confidenceDescription,
  ].filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return Math.min(...values);
}

export function isBulkApproveCandidate(job: ImportJobDto, threshold = 0.9): boolean {
  if (job.status !== 'NEEDS_REVIEW') return false;
  if (!job.draft) return false;
  if (job.draft.isDuplicateCandidate) return false;
  if ((job.draft.flags?.length ?? 0) > 0) return false;
  const minConf = getMinConfidence(job.draft);
  if (minConf === null || minConf < threshold) return false;
  if (!job.draft.englishName || !job.draft.coverUrl || !job.draft.downloadUrl) return false;
  return true;
}

// ──────────────────────────────────────────────
// API Payloads
// ──────────────────────────────────────────────

export interface CreateImportJobPayload {
  discordThreadId: string;
  discordChannelId?: string;
  originalName: string;
  discordReferenceNumber?: number;
  createdAtDiscord?: string;
  messages: DiscordMessagePayload[];
}

export interface DiscordMessagePayload {
  messageId: string;
  author: string;
  content: string;
  timestamp: string;
  attachments: DiscordAttachmentPayload[];
  embeds: unknown[];
}

export interface DiscordAttachmentPayload {
  filename: string;
  url: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  messageId: string;
}

export interface UpdateDraftPayload {
  englishName?: string;
  description?: string;
  platform?: Platform;
  downloadSource?: DownloadSource;
  downloadUrl?: string;
  suggestedCategoryIds?: string[];
  suggestedColorIds?: string[];
  suggestedStyleIds?: string[];
  adminNotes?: string;
}

export interface BulkApprovePayload {
  jobIds: string[];
}

export interface ApproveResult {
  importJobId: string;
  keyboardThemeId: string;
  slug: string;
}

export interface BulkApproveResult {
  succeeded: ApproveResult[];
  failed: Array<{ importJobId: string; reason: string }>;
}

export interface ImportJobListResponse {
  success: boolean;
  data: ImportJobDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImportJobFilter {
  status?: ImportJobStatus;
  validationStatus?: DraftValidationStatus;
  isDuplicateCandidate?: boolean;
  minConfidence?: number;
  hasFlags?: boolean;
  page?: number;
  limit?: number;
}
