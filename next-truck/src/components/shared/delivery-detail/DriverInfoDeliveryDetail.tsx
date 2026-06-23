"use client";

import { useTakeoverLogs, useUser } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, UserCog, User, Mail, Phone, Calendar, Activity, Shield } from "lucide-react";
import { TakeoverLogData } from "@/types/api";
import { cn } from "@/lib/utils";

function TakeoverLogItem({ log }: { log: TakeoverLogData }) {
  const { data: operator } = useUser(log.action_by_operator);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3 bg-secondary/10 rounded-xl border border-border/40 space-y-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-5">
         <Shield className="h-4 w-4" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCog className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/80">
            {formatDate(log.handover_at)}
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/5 text-[8px] font-mono font-bold uppercase tracking-tighter text-primary">
          Protokol Serah Terima
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-mono text-muted-foreground/60 uppercase">Sopir Keluar</p>
          <p className="text-xs font-bold truncate">{log.from_worker}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-mono text-muted-foreground/60 uppercase">Sopir Masuk</p>
          <p className="text-xs font-bold truncate text-primary">{log.to_worker}</p>
        </div>
      </div>

      {log.reason && (
        <div className="p-2 bg-background/40 rounded-lg border border-border/30">
          <p className="text-[9px] font-mono text-muted-foreground/60 uppercase mb-1">Alasan Penggantian:</p>
          <p className="text-[11px] leading-tight text-muted-foreground/80">{log.reason}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
        <span>Disetujui Oleh: {operator?.username || log.action_by_operator}</span>
        <Activity className="h-3 w-3 text-green-500/30" />
      </div>
    </div>
  );
}

export function DriverInfo({
  driverId,
  deliveryId,
}: {
  driverId: string;
  deliveryId?: string;
}) {
  const { data: driver, isLoading } = useUser(driverId);
  const {
    data: takeoverLogs,
    isLoading: logsLoading,
  } = useTakeoverLogs(deliveryId || "", !!deliveryId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-secondary/30 animate-pulse rounded-lg w-3/4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-secondary/20 animate-pulse rounded-lg"></div>
          <div className="h-10 bg-secondary/20 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!driver)
    return <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Sopir Tidak Ditemukan: {driverId}</span>;

  const hasTakeoverLogs = takeoverLogs && takeoverLogs.length > 0;

  return (
    <div className="space-y-6">
      {/* Current Driver Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p className="text-2xl font-display uppercase tracking-tight leading-none">{driver.username}</p>
             </div>
             <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{driver.role}</p>
          </div>
          <User className="h-8 w-8 text-primary/20" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Email", value: driver.email, icon: Mail, isTruncate: true },
            { label: "Nomor Telepon", value: driver.phone_number, icon: Phone },
            { label: "Umur", value: `${driver.age} Tahun`, icon: Calendar },
            { label: "ID Registrasi", value: driver.id.substring(0, 12), icon: Activity, isMono: true },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-secondary/10 rounded-xl border border-border/40 group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-1 group-hover:text-primary/60">
                <item.icon className="h-3 w-3" />
                {item.label}
              </div>
              <p className={cn(
                "text-sm font-bold uppercase tracking-tight",
                item.isTruncate && "truncate",
                item.isMono && "font-mono text-[10px] opacity-60"
              )}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Takeover Logs Section */}
      {hasTakeoverLogs && (
        <div className="space-y-4 pt-6 mt-6 border-t border-dashed border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary/80 uppercase tracking-widest">
              <History className="h-3.5 w-3.5" />
              Riwayat Pergantian Driver
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/40 font-bold">
              Jumlah: {takeoverLogs.length}
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-all">
            {logsLoading ? (
              <div className="space-y-3">
                <div className="h-24 bg-secondary/10 animate-pulse rounded-xl"></div>
                <div className="h-24 bg-secondary/10 animate-pulse rounded-xl"></div>
              </div>
            ) : (
              takeoverLogs.map((log, index) => (
                <TakeoverLogItem key={index} log={log} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
