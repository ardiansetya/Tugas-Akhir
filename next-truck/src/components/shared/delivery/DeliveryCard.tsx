"use client";

import AlertDeleteDelivery from "@/components/shared/alert/AlertDeleteDelivery";
import AlertFinishDelivery from "@/components/shared/alert/AlertFinishDelivery";
import DriverDetail from "@/components/shared/DriverDetail";
import RouteDetail from "@/components/shared/RouteDetail";
import TruckDetail from "@/components/shared/TruckDetail";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DeliveryData } from "@/types/api";
import { MapPin, Navigation, Truck, User, UserCog, Activity, Clock } from "lucide-react";
import Link from "next/link";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface DeliveryCardProps {
  delivery: DeliveryData;
  formatTimeAgo: (timestamp: number) => string;
  formatDate: (timestamp: number) => string;
  onChangeDriver: (delivery: DeliveryData) => void;
}

export default function DeliveryCard({
  delivery,
  formatTimeAgo,
  formatDate,
  onChangeDriver,
}: DeliveryCardProps) {
  const isFinished = !!delivery.finished_at;

  return (
    <TechCard
      title={delivery.id}
      subtitle={`Mulai: ${formatTimeAgo(delivery.started_at * 1000)}`}
      icon={<div className={cn(
        "p-2 rounded-lg transition-colors",
        isFinished ? "bg-secondary text-muted-foreground" : "bg-green-500/10 text-green-500"
      )}>
        <Truck className="h-5 w-5" />
      </div>}
      className="group"
    >
      <div className="space-y-4 pt-2">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border font-bold",
            isFinished
              ? "bg-secondary/30 text-muted-foreground border-border/50"
              : "bg-green-500/10 text-green-500 border-green-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isFinished ? "bg-muted-foreground" : "bg-green-500 animate-pulse")} />
            {isFinished ? "Selesai" : "Berjalan"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40">
            <Clock className="h-3 w-3" />
            {formatDate(delivery.started_at * 1000)}
          </div>
        </div>

        {/* Transmission Data Flow */}
        <Link href={`/pengiriman/${delivery.id}`} className="block group/link">
          <div className="space-y-3 p-4 bg-secondary/20 rounded-xl border border-border/50 group-hover/link:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-background rounded-lg border border-border/50">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">Rute Pengiriman</p>
                <div className="font-bold text-sm truncate"><RouteDetail routeId={delivery.route_id} /></div>
              </div>
            </div>

            <Separator className="opacity-30" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-background rounded-md border border-border/50 text-blue-500">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">Truk</p>
                  <div className="text-xs font-medium truncate"><TruckDetail truckId={delivery.truck_id} /></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-7 w-7 border border-border/50">
                  <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">Driver</p>
                  <div className="text-xs font-medium truncate"><DriverDetail driverId={delivery.worker_id} /></div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Command Interface */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link href={`/pengiriman/tracking/${delivery.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-9 rounded-xl border-border/50 font-mono text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary transition-all">
              <Navigation className="h-3.5 w-3.5" />
              Tracking
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/50 font-mono text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary transition-all"
            onClick={(e) => {
              e.preventDefault();
              onChangeDriver(delivery);
            }}
          >
            <UserCog className="h-3.5 w-3.5" />
            Ganti Driver
          </Button>

          <div className="flex gap-2">
            <AlertFinishDelivery delivery={delivery} />
            <AlertDeleteDelivery delivery={delivery} />
          </div>
        </div>
      </div>
    </TechCard>
  );
}
