"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarClock, Play, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, Field, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { cn, formatDate } from "@/lib/utils";
import { cronService } from "@/services/cron.service";
import type { CronJob } from "@/types/admin.types";

const schema = z.object({
  params: z.string().refine((value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, "JSON không hợp lệ"),
});
type Values = z.infer<typeof schema>;

export default function CronPage() {
  const { t, isMounted, language } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CronJob | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { params: "{}" },
  });

  const jobs = useQuery({ queryKey: ["cron", "jobs", search], queryFn: () => cronService.getJobs(search) });
  const trigger = useMutation({
    mutationFn: (values: Values) => cronService.trigger(selected!.name, JSON.parse(values.params) as Record<string, unknown>),
    onSuccess: () => {
      toast.success(isMounted ? `${t.adminSettings.jobTriggerSuccessPrefix} ${selected?.name ?? ""}` : `Đã chạy tác vụ ${selected?.name ?? ""}`);
      setSelected(null);
      reset();
      jobs.refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ name, enabled }: { name: string; enabled: boolean }) =>
      cronService.toggleJob(name, enabled),
    onSuccess: (_data, variables) => {
      toast.success(
        variables.enabled
          ? (language === "en" ? `Auto scheduler enabled for ${variables.name}` : `Đã BẬT lịch chạy tự động cho ${variables.name}`)
          : (language === "en" ? `Auto scheduler disabled for ${variables.name}` : `Đã TẮT lịch chạy tự động cho ${variables.name}`),
      );
      jobs.refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PermissionGate permission={PERMISSIONS.CRON_JOB_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={CalendarClock}
          title={isMounted ? t.adminSettings.cronTitle : "Tác vụ định kỳ"}
          description={isMounted ? t.adminSettings.cronDesc : "Theo dõi lịch chạy và kích hoạt thủ công các công việc nền được cho phép."}
        />
        <Card>
          <CardContent className="pt-6 md:pt-8">
            <label className="relative block max-w-xl">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
              <Input
                className="pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={isMounted ? t.adminSettings.searchJobPlaceholder : "Tìm tên tác vụ..."}
              />
            </label>
          </CardContent>
        </Card>
        <AsyncState
          loading={jobs.isLoading}
          error={jobs.isError}
          empty={!jobs.isLoading && !jobs.isError && !jobs.data?.length}
          emptyText={isMounted ? t.adminSettings.noJobs : "Không có tác vụ"}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.data?.map((job) => {
            const isEnabled = job.isEnabled !== false;
            return (
              <Card
                key={job.name}
                className={cn(
                  "transition-all",
                  !isEnabled && "opacity-85 border-dashed bg-kawaii-cloud/10",
                )}
              >
                <CardContent className="pt-6 md:pt-8">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-mono text-sm font-black text-kawaii-mocha">{job.name}</h2>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-[10px] font-bold",
                            isEnabled
                              ? "border-kawaii-sky bg-kawaii-sky/30 text-kawaii-mocha"
                              : "border-border bg-muted/60 text-kawaii-mocha/50",
                          )}
                        >
                          {isEnabled
                            ? (language === "en" ? "Auto: ON" : "Tự động: BẬT")
                            : (language === "en" ? "Auto: OFF" : "Tự động: TẮT")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-kawaii-mocha/55">{job.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant="secondary" className="font-mono text-xs">{job.cron}</Badge>
                      <PermissionGate permission={PERMISSIONS.CRON_JOB_MANAGE}>
                        <label className="flex cursor-pointer items-center gap-1.5" title={isEnabled ? "Tắt tự động" : "Bật tự động"}>
                          <span className="text-[11px] font-bold text-kawaii-mocha/60">
                            {isEnabled ? (language === "en" ? "Active" : "Bật") : (language === "en" ? "Disabled" : "Tắt")}
                          </span>
                          <Switch
                            checked={isEnabled}
                            disabled={toggleMutation.isPending}
                            onCheckedChange={(checked) =>
                              toggleMutation.mutate({ name: job.name, enabled: checked })
                            }
                          />
                        </label>
                      </PermissionGate>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-kawaii-mocha/60">
                    <div>
                      <span className="font-bold">{isMounted ? t.adminSettings.lastRunLabel : "Lần gần nhất"}</span>
                      <p>{job.lastRun ? formatDate(job.lastRun) : (isMounted ? t.adminSettings.notRunYet : "Chưa chạy")}</p>
                    </div>
                    <div>
                      <span className="font-bold">{isMounted ? t.adminSettings.nextRunLabel : "Lần tiếp theo"}</span>
                      <p>
                        {!isEnabled
                          ? (language === "en" ? "Suspended (Disabled)" : "Đã tạm dừng (Đang tắt)")
                          : (job.nextRun ? formatDate(job.nextRun) : (isMounted ? t.adminSettings.schedulerPlan : "Theo lịch scheduler"))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Badge variant={job.lastStatus === "FAILED" ? "destructive" : "outline"}>
                      {job.lastStatus || (isMounted ? t.adminSettings.jobReadyStatus : "Sẵn sàng")}
                    </Badge>
                    <PermissionGate permission={PERMISSIONS.CRON_JOB_MANAGE}>
                      <Button
                        size="sm"
                        variant={job.lastRun || job.lastStatus === "SUCCESS" ? "outline" : "default"}
                        onClick={() => {
                          setSelected(job);
                          reset({ params: "{}" });
                        }}
                      >
                        {job.lastRun || job.lastStatus === "SUCCESS" ? <RotateCcw /> : <Play />}
                        {job.lastRun || job.lastStatus === "SUCCESS"
                          ? (language === "en" ? "Re-run" : "Chạy lại")
                          : (language === "en" ? "Run now" : "Chạy ngay")}
                      </Button>
                    </PermissionGate>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {selected?.lastRun || selected?.lastStatus === "SUCCESS"
                  ? (language === "en" ? `Re-run ${selected?.name ?? ""}` : `Chạy lại ${selected?.name ?? ""}`)
                  : (language === "en" ? `Run ${selected?.name ?? ""}` : `Chạy ${selected?.name ?? ""}`)}
              </DialogTitle>
              <DialogDescription>
                {isMounted ? t.adminSettings.runJobDesc : "Tác vụ chạy ngay trên worker. Chỉ truyền các params thực sự cần thiết."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit((values) => trigger.mutate(values))}>
              <Field label="Params JSON" error={errors.params?.message}>
                <Textarea className="min-h-40 font-mono" {...register("params")} />
              </Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                  {isMounted ? t.adminUi.cancel : "Hủy"}
                </Button>
                <Button type="submit" disabled={trigger.isPending}>
                  {selected?.lastRun || selected?.lastStatus === "SUCCESS" ? <RotateCcw /> : <Play />}
                  {trigger.isPending
                    ? (language === "en" ? "Running..." : "Đang chạy...")
                    : (selected?.lastRun || selected?.lastStatus === "SUCCESS"
                        ? (language === "en" ? "Confirm re-run" : "Xác nhận chạy lại")
                        : (language === "en" ? "Confirm run" : "Xác nhận chạy"))}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}

