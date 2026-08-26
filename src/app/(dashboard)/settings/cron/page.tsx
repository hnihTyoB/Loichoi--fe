"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarClock, Play, Search } from "lucide-react";
import { toast } from "sonner";
import { AsyncState, Field, PageHeader } from "@/components/shared/admin-ui";
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
import { formatDate } from "@/lib/utils";
import { cronService } from "@/services/cron.service";
import type { CronJob } from "@/types/admin.types";

const schema = z.object({
  params: z.string().refine((value) => {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Params phải là JSON object hợp lệ"),
});
type Values = z.infer<typeof schema>;

export default function CronPage() {
  const { t, isMounted } = useTranslation();
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
          {jobs.data?.map((job) => (
            <Card key={job.name}>
              <CardContent className="pt-6 md:pt-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-mono text-sm font-black text-kawaii-mocha">{job.name}</h2>
                    <p className="mt-1 text-xs text-kawaii-mocha/55">{job.description}</p>
                  </div>
                  <Badge variant="secondary">{job.cron}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-kawaii-mocha/60">
                  <div>
                    <span className="font-bold">{isMounted ? t.adminSettings.lastRunLabel : "Lần gần nhất"}</span>
                    <p>{job.lastRun ? formatDate(job.lastRun) : (isMounted ? t.adminSettings.notRunYet : "Chưa chạy")}</p>
                  </div>
                  <div>
                    <span className="font-bold">{isMounted ? t.adminSettings.nextRunLabel : "Lần tiếp theo"}</span>
                    <p>{job.nextRun ? formatDate(job.nextRun) : (isMounted ? t.adminSettings.schedulerPlan : "Theo lịch scheduler")}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <Badge variant={job.lastStatus === "FAILED" ? "destructive" : "outline"}>
                    {job.lastStatus || (isMounted ? t.adminSettings.jobReadyStatus : "Sẵn sàng")}
                  </Badge>
                  <PermissionGate permission={PERMISSIONS.CRON_JOB_MANAGE}>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelected(job);
                        reset({ params: "{}" });
                      }}
                    >
                      <Play />
                      {isMounted ? t.adminSettings.runNowBtn : "Chạy ngay"}
                    </Button>
                  </PermissionGate>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? `${t.adminSettings.runJobTitlePrefix} ${selected?.name ?? ""}` : `Chạy ${selected?.name ?? ""}`}
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
                  <Play />
                  {trigger.isPending
                    ? (isMounted ? t.adminSettings.jobRunning : "Đang chạy...")
                    : (isMounted ? t.adminSettings.confirmRunBtn : "Xác nhận chạy")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}

