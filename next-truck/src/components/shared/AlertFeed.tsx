"use client";

import { useRecentAlerts } from "@/hooks";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Activity, 
  AlertCircle, 
  Info, 
  Navigation,
  ArrowRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const getAlertStyles = (type: string) => {
  const t = type.toLowerCase();
  
  if (["accident", "breakdown", "canceled", "unauthorized_unloading"].includes(t)) {
    return {
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: <AlertCircle className="h-4 w-4" />,
      label: "KRITIS"
    };
  }
  
  if (["illegal_stop", "route_deviation", "fuel_issue", "gps_lost", "puncture"].includes(t)) {
    return {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "PERINGATAN"
    };
  }
  
  return {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: <Info className="h-4 w-4" />,
    label: "INFORMASI"
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

export function AlertFeed() {
  const { data: alerts, isLoading } = useRecentAlerts();

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
        <Activity className="h-12 w-12 mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Semua aman</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence initial={false}>
        {alerts.slice(0, 15).map((alert, i) => {
          const styles = getAlertStyles(alert.type);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-lg",
                styles.bg,
                styles.border
              )}
            >
              <div className={cn(
                "mt-1 p-2 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm",
                styles.color
              )}>
                {styles.icon}
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", styles.border)}>
                    {styles.label}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(alert.created_at * 1000, { addSuffix: true, locale: id })}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold tracking-tight text-foreground/90 leading-snug">
                  {formatAlertName(alert.type)}
                </h4>
                
                <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>
                
                <div className="pt-2 flex items-center justify-between gap-4">
                   <div className="flex items-center gap-1.5 min-w-0">
                      <Navigation className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground/60 truncate uppercase tracking-tighter">
                         ID: {alert.delivery_id.split('-')[0]}...
                      </span>
                   </div>
                   
                   <Link 
                    href={`/pengiriman/tracking/${alert.delivery_id}`}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest"
                   >
                     Pantau <ArrowRight className="h-3 w-3" />
                   </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      <Link href="/pengiriman" className="block">
        <button className="w-full py-3 rounded-2xl bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
          Lihat Semua Log Pengiriman
        </button>
      </Link>
    </div>
  );
}
