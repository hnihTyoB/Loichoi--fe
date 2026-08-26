"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Eye, Search } from "lucide-react";
import { AsyncState, PageHeader } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { systemService } from "@/services/system.service";
import type { AuditLog } from "@/types/admin.types";

function json(value: unknown) {
  return JSON.stringify(value ?? null, null, 2);
}

function getTargetDisplay(log: AuditLog) {
  const details = log.details && typeof log.details === "object" ? (log.details as Record<string, unknown>) : null;
  if (log.targetType === "USER") {
    return (
      log.targetEmail ||
      log.targetUser?.email ||
      (typeof details?.userEmail === "string" ? details.userEmail : null) ||
      (typeof details?.targetEmail === "string" ? details.targetEmail : null) ||
      (typeof details?.email === "string" ? details.email : null) ||
      log.targetLabel ||
      log.targetId
    );
  }
  return (
    log.targetLabel ||
    (typeof details?.roleName === "string" ? details.roleName : null) ||
    (typeof details?.themeName === "string" ? details.themeName : null) ||
    (typeof details?.categoryName === "string" ? details.categoryName : null) ||
    (typeof details?.key === "string" ? details.key : null) ||
    (typeof details?.templateCode === "string" ? details.templateCode : null) ||
    (typeof details?.collectionName === "string" ? details.collectionName : null) ||
    log.targetId
  );
}

function getActorDisplay(log: AuditLog) {
  const details = log.details && typeof log.details === "object" ? (log.details as Record<string, unknown>) : null;
  return (
    log.actorEmail ||
    log.actor?.email ||
    (typeof details?.actorEmail === "string" ? details.actorEmail : null) ||
    (log.actorId ? log.actorId : "SYSTEM")
  );
}

export default function AuditLogsPage() {
  const { t, isMounted } = useTranslation();
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [actorId, setActorId] = useState("");
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const logs = useQuery({
    queryKey: ["audit-logs", action, targetType, actorId],
    queryFn: () =>
      systemService.getAuditLogs({
        action: action || undefined,
        targetType: targetType || undefined,
        actorId: actorId || undefined,
        limit: 100,
      }),
  });

  const details = selected?.details && typeof selected.details === "object" ? (selected.details as Record<string, unknown>) : null;
  const before = details?.before ?? details?.oldData ?? details?.previous;
  const after = details?.after ?? details?.newData ?? details?.current;

  return (
    <PermissionGate permission={PERMISSIONS.AUDIT_LOG_READ} fallback={<AsyncState error />}>
      <div className="space-y-6">
        <PageHeader
          icon={ClipboardList}
          title={isMounted ? t.adminAuditLogs.title : "Nhật ký kiểm toán"}
          description={isMounted ? t.adminAuditLogs.description : "Theo dõi các thay đổi quan trọng và dữ liệu liên quan đến từng hành động."}
        />
        <Card>
          <CardContent className="grid gap-3 pt-6 md:grid-cols-3 md:pt-8">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-kawaii-mocha/45" />
              <Input
                className="pl-10"
                value={action}
                onChange={(event) => setAction(event.target.value)}
                placeholder={isMounted ? t.adminAuditLogs.filterByAction : "Lọc theo action..."}
              />
            </label>
            <Input
              value={targetType}
              onChange={(event) => setTargetType(event.target.value)}
              placeholder={isMounted ? t.adminAuditLogs.targetTypePlaceholder : "Loại đối tượng..."}
            />
            <Input
              value={actorId}
              onChange={(event) => setActorId(event.target.value)}
              placeholder={isMounted ? t.adminAuditLogs.actorPlaceholder : "Email hoặc ID người thực hiện..."}
            />
          </CardContent>
        </Card>
        <AsyncState
          loading={logs.isLoading}
          error={logs.isError}
          empty={!logs.isLoading && !logs.isError && !logs.data?.data.length}
          emptyText={isMounted ? t.adminAuditLogs.noLogs : "Không có log phù hợp"}
        />
        {logs.data?.data.length ? (
          <Card>
            <CardContent className="overflow-x-auto pt-6 md:pt-8">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-kawaii-sky/40 text-xs text-kawaii-mocha/65">
                    <th className="p-3">{isMounted ? t.adminAuditLogs.thTime : "Thời gian"}</th>
                    <th className="p-3">{isMounted ? t.adminAuditLogs.thAction : "Hành động"}</th>
                    <th className="p-3">{isMounted ? t.adminAuditLogs.thTarget : "Đối tượng"}</th>
                    <th className="p-3">{isMounted ? t.adminAuditLogs.thActor : "Người thực hiện"}</th>
                    <th className="p-3">{isMounted ? t.adminAuditLogs.thIp : "IP"}</th>
                    <th className="p-3 text-right">{isMounted ? t.adminAuditLogs.thDetails : "Chi tiết"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kawaii-sky/20">
                  {logs.data.data.map((log) => {
                    const targetDisplay = getTargetDisplay(log);
                    const actorDisplay = getActorDisplay(log);
                    return (
                      <tr key={log.id} className="hover:bg-kawaii-cloud/30">
                        <td className="p-3 text-xs text-kawaii-mocha/60">{formatDate(log.createdAt)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{log.action}</Badge>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-kawaii-mocha">{log.targetType}</p>
                          <p className="max-w-56 truncate font-medium text-xs text-kawaii-mocha/70" title={targetDisplay}>
                            {targetDisplay}
                          </p>
                        </td>
                        <td className="p-3 max-w-52">
                          <p className="truncate font-medium text-xs text-kawaii-mocha/80" title={actorDisplay}>
                            {actorDisplay}
                          </p>
                        </td>
                        <td className="p-3 text-xs text-kawaii-mocha/60">{log.ipAddress || "—"}</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={isMounted ? t.adminAuditLogs.viewDetailAria : "Xem chi tiết"}
                            onClick={() => setSelected(log)}
                          >
                            <Eye />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : null}
        <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-kawaii-mocha">
                {isMounted ? t.adminAuditLogs.dialogTitle : "Chi tiết audit log"}
              </DialogTitle>
              <DialogDescription>
                {selected?.action} · {selected?.targetType} · {selected ? getTargetDisplay(selected) : ""}
              </DialogDescription>
            </DialogHeader>
            {before !== undefined || after !== undefined ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-kawaii-mocha/60">
                    {isMounted ? t.adminAuditLogs.beforeChange : "Trước thay đổi"}
                  </p>
                  <pre className="max-h-96 overflow-auto rounded-2xl bg-kawaii-blush/20 p-4 text-xs text-kawaii-mocha">
                    {json(before)}
                  </pre>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-kawaii-mocha/60">
                    {isMounted ? t.adminAuditLogs.afterChange : "Sau thay đổi"}
                  </p>
                  <pre className="max-h-96 overflow-auto rounded-2xl bg-kawaii-sky/20 p-4 text-xs text-kawaii-mocha">
                    {json(after)}
                  </pre>
                </div>
              </div>
            ) : (
              <pre className="max-h-[55vh] overflow-auto rounded-2xl bg-kawaii-cloud/40 p-4 text-xs text-kawaii-mocha">
                {json(selected?.details)}
              </pre>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}

