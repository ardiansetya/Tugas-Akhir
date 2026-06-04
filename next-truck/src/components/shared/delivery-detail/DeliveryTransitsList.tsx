"use client";

import { DeliveryTransitData } from "@/types/api";
import { CheckCircle2, Package, XCircle, Waypoints, Activity, MapPin } from "lucide-react";
import TransitContent from "./TransitContent";
import { BentoCard } from "@/components/shared/BentoCard";
import { cn } from "@/lib/utils";

interface DeliveryTransitListProps {
  transits: DeliveryTransitData[];
  formatDateTime: (t: number) => string;
}

export function DeliveryTransitList({
  transits,
}: DeliveryTransitListProps) {

  return (
    <BentoCard
      title="Titik Transit"
      subtitle="Urutan titik henti pengiriman"
      icon={<Waypoints className="h-5 w-5" />}
    >
      <div className="space-y-6 pt-4">
        {transits.length > 0 ? (
          <div className="space-y-6 relative">
            {/* Background connector line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-border/40 z-0" />
            
            {transits.map((transit, i) => (
              <div
                key={transit.id}
                className="relative z-10 pl-12"
              >
                {/* Node indicator */}
                <div className={cn(
                  "absolute left-0 top-1 h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all bg-background",
                  transit.is_accepted === null ? "border-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/5" :
                    transit.is_accepted ? "border-green-500/20 text-green-500 shadow-lg shadow-green-500/5" :
                      "border-red-500/20 text-red-500 shadow-lg shadow-red-500/5"
                )}>
                  {transit.is_accepted === null ? (
                    <Package className="h-6 w-6" />
                  ) : transit.is_accepted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-lg bg-secondary border flex items-center justify-center text-[10px] font-bold text-foreground/50">
                     {i + 1}
                  </div>
                </div>

                <div className="p-6 bg-secondary/10 rounded-3xl border border-border/40 hover:border-primary/20 hover:bg-secondary/20 transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold tracking-tight text-foreground/80">
                         {transit.is_accepted === null ? "Menunggu Persetujuan" : transit.is_accepted ? "Transit Disetujui" : "Transit Ditolak"}
                      </h4>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-1">
                        ID Transit: {transit.id.slice(0, 12)}...
                      </p>
                    </div>

                    <div className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                      transit.is_accepted === null ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                        transit.is_accepted ? "bg-green-500/5 text-green-600 border-green-500/20" :
                          "bg-red-500/5 text-red-600 border-red-500/20"
                    )}>
                      {transit.is_accepted === null ? "Menunggu" : transit.is_accepted ? "Disetujui" : "Ditolak"}
                    </div>
                  </div>
                  
                  <div className="bg-background/40 rounded-2xl p-2 border border-border/20">
                    <TransitContent transit={transit} />
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Waktu Transit</span>
                    <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Titik_{transit.transit_point.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/5 rounded-3xl border-2 border-dashed border-border/50">
            <div className="p-6 bg-background rounded-3xl w-fit mx-auto mb-4 border border-border/50 shadow-sm relative">
               <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl" />
               <Waypoints className="h-10 w-10 text-muted-foreground opacity-20 relative z-10" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/60">Belum ada titik transit</h3>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Rute tidak melewati titik transit</p>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
