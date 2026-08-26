"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Laptop,
  LoaderCircle,
  Lock,
  LogOut,
  MessageSquare,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarCropDialog } from "@/components/forms/avatar-crop-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/utils";
import { authService } from "@/services/auth.service";

export default function ProfilePage() {
  const { user, refetch } = useAuth();
  const { t, isMounted } = useTranslation();
  const queryClient = useQueryClient();

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync profile fields from user
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Query Active Sessions
  const sessionsQuery = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: () => authService.getSessions(),
    retry: 1,
  });

  // Avatar file selection -> Open Crop Dialog
  const handleAvatarFileSelected = (file: File) => {
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Định dạng ảnh không hợp lệ! Vui lòng chọn PNG, JPG, WEBP hoặc GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa là 5MB!");
      return;
    }

    setCropFile(file);
    setIsCropOpen(true);
  };

  // Process and upload cropped avatar
  const handleCroppedAvatarUpload = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const newAvatar = await authService.uploadAvatar(croppedFile);
      setAvatarUrl(newAvatar);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatarUrl: newAvatar,
        });
      }
      await refetch();
      toast.success(isMounted ? t.profile.avatarUploadSuccess : "Đã cập nhật ảnh đại diện thành công");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải ảnh đại diện thất bại";
      toast.error(msg);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarFileSelected(file);
    }
    e.target.value = "";
  };

  // Mutation: Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: () =>
      authService.updateProfile({
        fullName: fullName.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      }),
    onSuccess: async () => {
      await refetch();
      toast.success(isMounted ? t.profile.profileUpdatedSuccess : "Đã cập nhật thông tin hồ sơ thành công");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Cập nhật hồ sơ thất bại";
      toast.error(msg);
    },
  });

  // Mutation: Update Password
  const updatePasswordMutation = useMutation({
    mutationFn: () =>
      authService.updatePassword({
        oldPassword: oldPassword || undefined,
        newPassword,
      }),
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(isMounted ? t.profile.passwordUpdatedSuccess : "Đã đổi mật khẩu thành công");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Đổi mật khẩu thất bại";
      toast.error(msg);
    },
  });

  // Mutation: Revoke Session
  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
      toast.success(isMounted ? t.profile.sessionRevokedSuccess : "Đã đăng xuất phiên thành công");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Đăng xuất phiên thất bại";
      toast.error(msg);
    },
  });

  // Mutation: Revoke All Other Sessions
  const revokeOtherSessionsMutation = useMutation({
    mutationFn: () => authService.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
      toast.success(isMounted ? t.profile.allOtherRevokedSuccess : "Đã đăng xuất tất cả các thiết bị khác");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Đăng xuất các thiết bị khác thất bại";
      toast.error(msg);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(isMounted ? t.profile.passwordMismatch : "Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có tối thiểu 8 ký tự");
      return;
    }
    updatePasswordMutation.mutate();
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast.success("Đã sao chép User ID");
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive Avatar Crop & Alignment Dialog */}
      <AvatarCropDialog
        open={isCropOpen}
        imageFile={cropFile}
        onOpenChange={setIsCropOpen}
        onCropComplete={handleCroppedAvatarUpload}
      />

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={onFileInputChange}
      />

      {/* Header Banner */}
      <div className="rounded-[2.5rem] border-2 border-kawaii-sky/80 bg-gradient-to-r from-kawaii-cloud via-card to-kawaii-blush/40 p-6 md:p-8 shadow-cloud flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 text-xs font-bold text-kawaii-mocha border border-kawaii-sky/50 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-kawaii-warmbrown" />
            <span>{isMounted ? t.profile.title : "Hồ Sơ Thành Viên"}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-kawaii-mocha">
            {user?.fullName || user?.name || user?.email?.split("@")[0]}
          </h1>
          <p className="text-sm md:text-base text-kawaii-mocha/75 font-medium">
            {isMounted ? t.profile.subtitle : "Quản lý thông tin tài khoản, bảo mật và quyền hạn trong thế giới Loichoi"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3.5 py-1.5 text-xs font-bold rounded-full border border-kawaii-sky/40">
            <Shield className="mr-1 h-3.5 w-3.5 text-kawaii-warmbrown" />
            {typeof user?.role === "string" ? user.role : user?.role?.name || "USER"}
          </Badge>
          <Badge variant="default" className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
            {isMounted ? t.profile.activeStatus : "Đang hoạt động"}
          </Badge>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Member Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/60 shadow-cloud text-center p-6 space-y-5">
            {/* Avatar container with interactive upload button & hover overlay */}
            <div className="relative mx-auto h-32 w-32 group">
              <div className="h-full w-full rounded-full bg-kawaii-sky/40 border-4 border-kawaii-sky text-kawaii-mocha shadow-cloud overflow-hidden flex items-center justify-center relative">
                {avatarUrl || user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl || user?.avatarUrl || ""}
                    alt={user?.fullName || user?.email}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-kawaii-mocha" />
                )}

                {/* Uploading Spinner Overlay */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                    <LoaderCircle className="h-6 w-6 text-kawaii-warmbrown animate-spin" />
                    <span className="text-[10px] font-bold text-kawaii-mocha">
                      {isMounted ? t.profile.uploadingAvatar : "Đang tải..."}
                    </span>
                  </div>
                )}

                {/* Hover Camera Overlay */}
                {!isUploadingAvatar && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label={isMounted ? t.profile.changeAvatar : "Đổi ảnh đại diện"}
                    title={isMounted ? t.profile.changeAvatar : "Đổi ảnh đại diện"}
                    className="absolute inset-0 bg-kawaii-mocha/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer"
                  >
                    <Camera className="h-6 w-6 mb-1 text-kawaii-cream" />
                    <span className="text-[11px] font-bold text-kawaii-cream">
                      {isMounted ? t.profile.changeAvatar : "Đổi ảnh"}
                    </span>
                  </button>
                )}
              </div>

              {/* Little Camera Badge Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                aria-label={isMounted ? t.profile.uploadAvatarBtn : "Tải ảnh đại diện"}
                title={isMounted ? t.profile.uploadAvatarBtn : "Tải ảnh đại diện"}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-card border-2 border-kawaii-sky shadow-cloud flex items-center justify-center text-kawaii-mocha hover:bg-kawaii-sky/40 transition-transform active:scale-95 bouncy-hover"
              >
                {isUploadingAvatar ? (
                  <LoaderCircle className="h-4 w-4 text-kawaii-warmbrown animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-kawaii-mocha" />
                )}
              </button>
            </div>

            <div>
              <h2 className="text-xl font-black text-kawaii-mocha">
                {user?.fullName || user?.name || "Thành viên Loichoi"}
              </h2>
              <p className="text-xs font-mono text-kawaii-mocha/60 mt-0.5">{user?.email}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <Badge variant="outline" className="px-3 py-1 text-xs font-bold border-kawaii-sky/60 bg-kawaii-cloud/30">
                {typeof user?.role === "string" ? user.role : user?.role?.name || "USER"}
              </Badge>
              {user?.isEmailVerified || user?.isActive ? (
                <Badge variant="default" className="gap-1 px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{isMounted ? t.profile.verifiedBadge : "Đã xác thực"}</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-100 border-amber-300">
                  <XCircle className="h-3 w-3" />
                  <span>{isMounted ? t.profile.unverifiedBadge : "Chưa xác thực"}</span>
                </Badge>
              )}
            </div>

              {/* Quick Metadata Stats */}
            <div className="rounded-2xl border border-kawaii-sky/40 bg-kawaii-cloud/30 p-4 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-kawaii-sky/20 pb-2">
                <span className="font-bold text-kawaii-mocha/70 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-kawaii-warmbrown" />
                  {isMounted ? t.profile.memberSince : "Ngày gia nhập"}
                </span>
                <span className="font-medium text-kawaii-mocha">
                  {user?.createdAt ? formatDate(user.createdAt) : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-kawaii-sky/20 pb-2">
                <span className="font-bold text-kawaii-mocha/70 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#5865F2]" />
                  Discord
                </span>
                <span className="font-medium text-kawaii-mocha">
                  {user?.discordId ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {isMounted ? t.profile.linkedViaOAuth : "Đã liên kết"}
                    </span>
                  ) : (
                    <span className="text-kawaii-mocha/50 font-medium">
                      {isMounted ? t.profile.notLinkedDiscord : "Chưa liên kết"}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="font-bold text-kawaii-mocha/70 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-kawaii-warmbrown" />
                  Permissions
                </span>
                <span className="font-bold text-kawaii-mocha">
                  {user?.permissions?.length || 0} {isMounted ? t.adminRoles.permsCount : "quyền"}
                </span>
              </div>
            </div>

            {!user?.discordId && (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl border-2 border-[#5865F2]/40 bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 font-bold text-xs"
              >
                <a href={authService.getDiscordOAuthUrl()}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {isMounted ? t.profile.linkDiscordBtn : "Liên kết Discord"}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </Card>
        </div>

        {/* Right Column: Tabbed Settings & Details (8 cols) */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full p-1.5 bg-kawaii-cloud/50 border-2 border-kawaii-sky/50 rounded-2xl">
              <TabsTrigger value="profile" className="rounded-xl text-xs font-bold">
                {isMounted ? t.profile.tabProfile : "Thông tin cá nhân"}
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl text-xs font-bold">
                {isMounted ? t.profile.tabSecurity : "Bảo mật & Mật khẩu"}
              </TabsTrigger>
              <TabsTrigger value="sessions" className="rounded-xl text-xs font-bold">
                {isMounted ? t.profile.tabSessions : "Phiên đăng nhập"}
              </TabsTrigger>
              <TabsTrigger value="permissions" className="rounded-xl text-xs font-bold">
                {isMounted ? t.profile.tabPermissions : "Quyền hạn"}
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Personal Info */}
            <TabsContent value="profile" className="space-y-6 mt-0">
              <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/60 shadow-cloud">
                <CardHeader>
                  <CardTitle className="text-lg font-black text-kawaii-mocha">
                    {isMounted ? t.profile.accountDetails : "Chi Tiết Tài Khoản"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isMounted ? t.profile.accountDetailsDesc : "Thông tin định danh và phân cấp vai trò"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-kawaii-mocha ml-1">
                          {isMounted ? t.profile.email : "Địa chỉ Email"}
                        </label>
                        <Input value={user?.email || ""} disabled className="bg-muted/40 font-medium text-xs rounded-2xl" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-kawaii-mocha ml-1 flex items-center justify-between">
                          <span>{isMounted ? t.profile.userId : "Mã ID Người Dùng"}</span>
                          <button
                            type="button"
                            onClick={copyUserId}
                            className="text-[10px] text-kawaii-warmbrown hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </label>
                        <Input value={user?.id || ""} disabled className="bg-muted/40 font-mono text-xs rounded-2xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-kawaii-mocha ml-1">
                          {isMounted ? t.profile.fullName : "Họ và tên"}
                        </label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={isMounted ? t.profile.fullNamePlaceholder : "Nhập họ và tên..."}
                          className="rounded-2xl border-2 border-kawaii-sky/50 focus:border-kawaii-sky text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-kawaii-mocha ml-1">
                          {isMounted ? t.profile.phoneNumber : "Số điện thoại"}
                        </label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder={isMounted ? t.profile.phoneNumberPlaceholder : "Nhập số điện thoại..."}
                          className="rounded-2xl border-2 border-kawaii-sky/50 focus:border-kawaii-sky text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="rounded-2xl px-6 font-bold text-xs shadow-md"
                      >
                        {updateProfileMutation.isPending
                          ? (isMounted ? t.profile.savingProfile : "Đang lưu...")
                          : (isMounted ? t.profile.saveProfileBtn : "Lưu thay đổi")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Security & Password */}
            <TabsContent value="security" className="space-y-6 mt-0">
              <Card className="rounded-[2.25rem] border-2 border-kawaii-blush/60 shadow-blush">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-blush/40 text-kawaii-mocha">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.profile.changePasswordTitle : "Đổi Mật Khẩu"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {isMounted ? t.profile.changePasswordDesc : "Cập nhật mật khẩu để bảo vệ an toàn cho tài khoản của bạn"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-kawaii-mocha ml-1">
                        {isMounted ? t.profile.oldPassword : "Mật khẩu hiện tại"}
                      </label>
                      <PasswordInput
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder={isMounted ? t.profile.oldPasswordPlaceholder : "Nhập mật khẩu hiện tại..."}
                        className="rounded-2xl border-2 border-kawaii-sky/50 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-kawaii-mocha ml-1">
                        {isMounted ? t.profile.newPassword : "Mật khẩu mới"}
                      </label>
                      <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={isMounted ? t.profile.newPasswordPlaceholder : "Nhập mật khẩu mới..."}
                        className="rounded-2xl border-2 border-kawaii-sky/50 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-kawaii-mocha ml-1">
                        {isMounted ? t.profile.confirmNewPassword : "Xác nhận mật khẩu mới"}
                      </label>
                      <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={isMounted ? t.profile.confirmNewPasswordPlaceholder : "Nhập lại mật khẩu mới..."}
                        className="rounded-2xl border-2 border-kawaii-sky/50 text-xs"
                      />
                    </div>

                    <p className="text-[11px] text-kawaii-mocha/60 leading-relaxed">
                      * Mật khẩu cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                    </p>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={updatePasswordMutation.isPending || !newPassword}
                        className="rounded-2xl px-6 font-bold text-xs shadow-md"
                      >
                        {updatePasswordMutation.isPending
                          ? (isMounted ? t.profile.updatingPassword : "Đang cập nhật...")
                          : (isMounted ? t.profile.updatePasswordBtn : "Đổi mật khẩu")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Active Sessions */}
            <TabsContent value="sessions" className="space-y-6 mt-0">
              <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/60 shadow-cloud">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                        <Laptop className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-lg font-black text-kawaii-mocha">
                        {isMounted ? t.profile.activeSessionsTitle : "Phiên Đăng Nhập Hoạt Động"}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {isMounted ? t.profile.activeSessionsDesc : "Danh sách các thiết bị và trình duyệt đang duy trì đăng nhập"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={revokeOtherSessionsMutation.isPending}
                    onClick={() => revokeOtherSessionsMutation.mutate()}
                    className="rounded-2xl text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <LogOut className="mr-1.5 h-3.5 w-3.5" />
                    {isMounted ? t.profile.revokeOtherSessionsBtn : "Đăng xuất thiết bị khác"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {sessionsQuery.isLoading ? (
                    <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                      {isMounted ? t.adminUi.loadingData : "Đang tải dữ liệu..."}
                    </div>
                  ) : !sessionsQuery.data || sessionsQuery.data.length === 0 ? (
                    <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                      {isMounted ? t.adminUi.emptyData : "Chưa có dữ liệu phiên"}
                    </div>
                  ) : (
                    sessionsQuery.data.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between rounded-2xl border border-kawaii-sky/30 bg-kawaii-cloud/30 p-4 transition-colors hover:bg-kawaii-cloud/60"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-kawaii-sky/40 flex items-center justify-center text-kawaii-mocha shrink-0">
                            {session.userAgent?.toLowerCase().includes("mobile") ? (
                              <Smartphone className="h-5 w-5" />
                            ) : (
                              <Laptop className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-kawaii-mocha text-xs truncate max-w-xs sm:max-w-md">
                                {session.userAgent || "Unknown Browser"}
                              </p>
                              {session.isCurrent && (
                                <Badge variant="default" className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white font-bold">
                                  {isMounted ? t.profile.currentDeviceBadge : "Thiết bị hiện tại"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-kawaii-mocha/60 mt-0.5">
                              IP: <span className="font-mono">{session.ipAddress || "—"}</span> · {formatDate(session.createdAt)}
                            </p>
                          </div>
                        </div>

                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={revokeSessionMutation.isPending}
                            onClick={() => revokeSessionMutation.mutate(session.id)}
                            className="text-xs text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                          >
                            <LogOut className="h-3.5 w-3.5 mr-1" />
                            {isMounted ? t.profile.revokeSessionBtn : "Đăng xuất"}
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Permissions */}
            <TabsContent value="permissions" className="space-y-6 mt-0">
              <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/60 shadow-cloud">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.profile.permissionsTitle : "Danh Sách Quyền (Permissions)"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {isMounted ? t.profile.permissionsDesc : "Các quyền được cấp theo vai trò hệ thống của bạn"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {typeof user?.role === "object" && user?.role?.description && (
                    <div className="rounded-2xl border border-kawaii-sky/40 bg-kawaii-cloud/30 p-3.5 text-xs text-kawaii-mocha/80">
                      <span className="font-bold text-kawaii-mocha mr-1">Mô tả vai trò ({user.role.name}):</span>
                      {user.role.description}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl border-2 border-kawaii-sky/40 bg-kawaii-cloud/20">
                    {user?.permissions && user.permissions.length > 0 ? (
                      user.permissions.map((perm) => (
                        <Badge
                          key={perm}
                          variant="outline"
                          className="border-kawaii-sky/60 bg-card font-mono text-xs text-kawaii-mocha px-3 py-1 shadow-sm"
                        >
                          <Lock className="mr-1.5 h-3 w-3 text-kawaii-warmbrown" />
                          {perm}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-kawaii-mocha/60 font-medium">
                        {isMounted ? t.profile.standardPermission : "Quyền thành viên tiêu chuẩn"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

