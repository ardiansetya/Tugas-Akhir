"use client";

import AlertDeleteTruck from "@/components/shared/alert/AlertDeleteTruck";
import EditTruckModal from "@/components/shared/modal/EditTruckModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToggleTruckAvailability } from "@/hooks";
import { TruckData } from "@/types/api";
import {
  CheckCircle2,
  FileText,
  Package,
  Truck,
  Weight,
  XCircle,
  Activity,
  ArrowRight
} from "lucide-react";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface TruckCardProps {
  truck: TruckData;
  onToggleAvailability: (truckId: string, isAvailable: boolean) => void;
  formatCapacity: (kg: number) => string;
}

export default function TruckCard({
  truck,
  onToggleAvailability,
  formatCapacity,
}: TruckCardProps) {
  const { mutate } = useToggleTruckAvailability();

  return (
    <TechCard
      title={truck.license_plate}
      subtitle={`UNIT_ID: ${truck.id}`}
      icon={
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          truck.is_available 
            ? "bg-green-500/10 text-green-500" 
            : "bg-red-500/10 text-red-500"
        )}>
          <Truck className="h-5 w-5" />
        </div>
      }
      className="h-full flex flex-col"
    >
      <div className="space-y-4 pt-2">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border font-bold",
            truck.is_available
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", truck.is_available ? "bg-green-500" : "bg-red-500")} />
            {truck.is_available ? "Operational" : "Maintenance"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60">
            <Activity className="h-3 w-3" />
            Signal: Stable
          </div>
        </div>

        <div className="space-y-3 py-2 bg-secondary/20 p-3 rounded-xl border border-border/50">
          <div className="flex items-center justify-between group/item">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Model Type</span>
            </div>
            <span className="text-sm font-medium">{truck.model}</span>
          </div>

          <div className="flex items-center justify-between group/item">
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Cargo Class</span>
            </div>
            <span className="text-sm font-medium">{truck.cargo_type}</span>
          </div>

          <div className="flex items-center justify-between group/item">
            <div className="flex items-center gap-2">
              <Weight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Max Payload</span>
            </div>
            <span className="text-sm font-medium">{formatCapacity(truck.capacity_kg)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <div className="flex-1 min-w-[120px]">
            {truck.is_available ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-10 border border-border/50 rounded-xl hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/30 transition-all font-mono text-[10px] uppercase tracking-widest gap-2"
                onClick={() => onToggleAvailability(truck.id, false)}
              >
                <XCircle className="h-3.5 w-3.5" />
                Initialize Service
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full h-10 rounded-xl transition-all font-mono text-[10px] uppercase tracking-widest gap-2"
                onClick={() => mutate(truck.id)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Restore Status
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <EditTruckModal truckId={truck.id} />
            <AlertDeleteTruck truck={truck} />
          </div>
        </div>
      </div>
    </TechCard>
  );
}
