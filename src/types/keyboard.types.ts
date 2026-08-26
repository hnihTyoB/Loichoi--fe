export type KeyboardPlatform = "IOS" | "ANDROID" | "BOTH";

export type KeyboardAccessLevel =
  | "FREE"
  | "PREMIUM"
  | "DISCORD_MEMBER"
  | "DISCORD_ROLE";

export type KeyboardSort =
  | "latest"
  | "popular"
  | "liked"
  | "name-asc"
  | "name-desc";

export interface KeyboardCategory {
  id: string;
  name: string;
  slug: string;
  themeCount?: number;
}

export interface KeyboardAuthor {
  id: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface KeyboardCardData {
  id: string;
  slug: string;
  name: string;
  coverUrl: string;
  platform: KeyboardPlatform;
  categories: KeyboardCategory[];
  downloadCount: number;
  accessLevel?: KeyboardAccessLevel;
  likeCount?: number;
  isFeatured?: boolean;
  author?: KeyboardAuthor | null;
  publishedAt?: string | null;
}

export interface KeyboardPreviewImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface KeyboardDetail extends KeyboardCardData {
  description: string | null;
  requiredDiscordRoleIds: string[];
  previewImages: KeyboardPreviewImage[];
  isLiked?: boolean;
}

export interface KeyboardListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  platform?: "ios" | "android" | "both";
  accessLevel?: KeyboardAccessLevel;
  featured?: boolean;
  sort?: KeyboardSort;
}

export interface KeyboardListResult {
  data: KeyboardCardData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
