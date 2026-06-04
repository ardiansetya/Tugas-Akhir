"use client";

import { useRecentAlerts } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
  CheckCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const getAlertStyles = (type: string) => {
  const t = type.toLowerCase();
  
  if (["accident", "breakdown", "canceled", "unauthorized_unloading"].includes(t)) {
    return {
      color: "text-red-500",
      bg: "bg-red-500/10",
      icon: <AlertCircle className="h-4 w-4" />,
      label: "KRITIS"
    };
  }
  
  if (["illegal_stop", "route_deviation", "fuel_issue", "gps_lost", "puncture"].includes(t)) {
    return {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "PERINGATAN"
    };
  }
  
  return {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    icon: <Info className="h-4 w-4" />,
    label: "INFO"
  };
};

const formatAlertName = (type: string) => {
  const mapping: Record<string, string> = {
    accident: "Kecelakaan",
    breakdown: "Kendaraan Mogok",
    canceled: "Dibatalkan",
    unauthorized_unloading: "Pembongkaran Ilegal",
    illegal_stop: "Berhenti Tidak Terjadwal",
    route_deviation: "Penyimpangan Rute",
    fuel_issue: "Masalah Bahan Bakar",
    gps_lost: "Sinyal GPS Hilang",
    puncture: "Ban Bocor",
    delivery_started: "Pengiriman Dimulai",
    delivery_finished: "Pengiriman Selesai",
    transit_arrived: "Tiba di Titik Transit",
    transit_departed: "Berangkat dari Titik Transit",
    takeover: "Serah Terima Driver"
  };
  
  return mapping[type.toLowerCase()] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export function NotificationDropdown() {
  const { data: alerts, isLoading } = useRecentAlerts();
  const [lastReadTime, setLastReadTime] = useState<number>(0);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("last_notif_read_time");
    if (saved) {
      setLastReadTime(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const newestAlert = alerts[0].created_at;
      if (newestAlert > lastReadTime) {
        setHasNew(true);
      } else {
        setHasNew(false);
      }
    }
  }, [alerts, lastReadTime]);

  const markAsRead = () => {
    const now = Math.floor(Date.now() / 1000);
    localStorage.setItem("last_notif_read_time", now.toString());
    setLastReadTime(now);
    setHasNew(false);
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (open && hasNew) { /* Optional: mark as read on open */ } }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 border-none hover:bg-secondary/50 rounded-2xl">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {hasNew && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px] mt-4 p-2 rounded-2xl border-white/20 bg-background/80 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="text-[10px] text-muted-foreground tracking-widest uppercase">Pemberitahuan</DropdownMenuLabel>
          {hasNew && (
            <button 
              onClick={markAsRead}
              className="flex items-center gap-1 text-[9px] font-bold text-primary hover:opacity-80 transition-opacity uppercase tracking-wider"
            >
              <CheckCheck className="h-3 w-3" />
              Tandai Dibaca
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-1 py-1">
          {isLoading ? (
             <div className="py-8 text-center">
                <div className="h-5 w-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Memuat...</p>
             </div>
          ) : !alerts || alerts.length === 0 ? (
            <div className="py-12 text-center opacity-40">
              <Bell className="h-8 w-8 mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada notifikasi</p>
            </div>
          ) : (
            alerts.slice(0, 10).map((alert) => {
              const styles = getAlertStyles(alert.type);
              const isNew = alert.created_at > lastReadTime;
              
              return (
                <DropdownMenuItem key={alert.id} asChild className="rounded-xl mb-1 focus:bg-secondary/50 p-0 cursor-pointer">
                  <Link href={`/pengiriman/tracking/${alert.delivery_id}`} className="flex items-start gap-3 p-3 w-full">
                    <div className={cn(
                      "mt-0.5 p-2 rounded-lg border shrink-0",
                      styles.bg,
                      styles.color,
                      "border-white/5"
                    )}>
                      {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={cn(
                          "text-[8px] font-bold px-1.5 py-0.5 rounded-full",
                          isNew ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        )}>
                          {isNew ? "BARU" : styles.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {formatDistanceToNow(alert.created_at * 1000, { addSuffix: true, locale: id })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold truncate">
                        {formatAlertName(alert.type)}
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {alert.message}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="rounded-xl mt-1 focus:bg-primary/10 transition-colors">
          <Link href="/pengiriman" className="flex items-center justify-center gap-2 py-2 w-full text-[10px] font-bold uppercase tracking-widest text-primary">
            Lihat Semua Aktivitas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
