"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDelivery, useRoute, useTruck, useUser } from "@/hooks";
import { TransitData } from "@/types/api";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Package,
  Phone,
  Activity,
  User,
  XCircle,
  Terminal,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface TransitDriverCardProps {
  transit: TransitData;
  status: "pending" | "accepted" | "rejected";
  onAccept: (transitId: string) => void;
  onReject: (transitId: string) => void;
  isProcessing: boolean;
  formatTimeAgo: (timestamp: number) => string;
  formatDate: (timestamp: number) => string;
}

export default function TransitDriverCard({
  transit,
  status,
  onAccept,
  onReject,
  isProcessing,
  formatTimeAgo,
  formatDate,
}: TransitDriverCardProps) {
  const { data: delivery } = useDelivery(transit.delivery_id, true);
  const { data: route } = useRoute(delivery?.route_id || "", !!delivery?.route_id);
  const { data: truck } = useTruck(delivery?.truck_id || "", !!delivery?.truck_id);
  const { data: operator } = useUser(transit.action_by_operator_id, !!transit.action_by_operator_id && transit.actioned_at > 0);

  return (
    <TechCard
      title={transit.id}
      subtitle={`Titik Transit: ${transit.transit_point_id}`}
      icon={<div className={cn(
        "p-2 rounded-lg transition-colors",
        status === "pending" ? "bg-amber-500/10 text-amber-500 animate-pulse" : 
        status === "accepted" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
      )}>
        <MapPin className="h-5 w-5" />
      </div>}
    >
      <div className="space-y-4 pt-2">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border font-bold",
            status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
            status === "accepted" ? "bg-green-500/10 text-green-500 border-green-500/20" :
            "bg-red-500/10 text-red-500 border-red-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", status === "pending" ? "bg-amber-500" : status === "accepted" ? "bg-green-500" : "bg-red-500")} />
            {status === "pending" ? "Menunggu Persetujuan" : status === "accepted" ? "Disetujui" : "Ditolak"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40">
            <Clock className="h-3.5 w-3.5" />
            {formatTimeAgo(transit.arrived_at)}
          </div>
        </div>

        {/* Transmission IDs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/20 rounded-xl border border-border/50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">ID Pengiriman</p>
            <p className="text-sm font-bold truncate">{transit.delivery_id}</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-xl border border-border/50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">ID Titik Transit</p>
            <p className="text-sm font-bold truncate">{transit.transit_point_id}</p>
          </div>
        </div>

        {/* Detailed Data Stream */}
        {delivery && (
          <div className="space-y-3 p-4 bg-background/40 rounded-xl border border-dashed border-border/60">
             <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary/60 uppercase tracking-widest mb-1">
                <Terminal className="h-3 w-3" />
                Info Detail
             </div>

             {route && (
               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-mono text-muted-foreground uppercase">Rute</span>
                     <span className="text-xs font-bold">{route.start_city_name} <ArrowRight className="inline-block h-3 w-3 mx-1" /> {route.end_city_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-mono text-muted-foreground uppercase">Jarak & Estimasi</span>
                     <span className="text-xs font-medium">{route.distance_km}km | {route.estimated_duration_hours}j</span>
                  </div>
               </div>
             )}

             <Separator className="opacity-20" />

             {truck && (
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-mono text-muted-foreground uppercase">Truk</span>
                   <span className="text-xs font-bold text-primary">{truck.license_plate} [{truck.model}]</span>
                </div>
             )}
          </div>
        )}

        {/* Operator Verification (if actioned) */}
        {operator && transit.actioned_at > 0 && (
          <div className="flex items-center gap-4 p-3 bg-secondary/10 rounded-xl border border-border/30">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {operator.username.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-0.5 min-w-0">
               <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Disetujui Oleh</p>
               <p className="text-sm font-bold truncate">{operator.username}</p>
               <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                  <Activity className="h-3 w-3" />
                  ID: {operator.id.substring(0, 8)}...
               </div>
            </div>
          </div>
        )}

        {/* Rejection Diagnostics */}
        {status === "rejected" && transit.reason && (
          <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/20 flex gap-3">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">Alasan Penolakan:</p>
              <p className="text-xs text-red-500/80 leading-relaxed font-medium">{transit.reason}</p>
            </div>
          </div>
        )}

        {/* Control Interface */}
        {status === "pending" && (
          <div className="flex gap-3 pt-2">
            <Button
              size="sm"
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={() => onAccept(transit.id)}
              disabled={isProcessing}
            >
              <ShieldCheck className="h-4 w-4" />
              {isProcessing ? "Memproses..." : "Setujui"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-11 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/5 hover:text-red-500 font-mono text-[10px] uppercase tracking-widest gap-2 bg-background transition-all"
              onClick={() => onReject(transit.id)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4" />
              {isProcessing ? "Memproses..." : "Tolak"}
            </Button>
          </div>
        )}

        {status !== "pending" && (
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 pt-2 italic">
            <span>Waktu Proses: {formatDate(transit.actioned_at * 1000)}</span>
            <Activity className={cn("h-3 w-3", status === "accepted" ? "text-green-500" : "text-red-500")} />
          </div>
        )}
      </div>
    </TechCard>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
