import { useTruck } from "@/hooks";
import { Truck, Activity, Package, Weight, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export function TruckInfo({ truckId }: { truckId: string }) {
  const { data: truck, isLoading } = useTruck(truckId);

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

  if (!truck)
    return <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Unit tidak ditemukan: {truckId}</span>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
             <p className="text-2xl font-display uppercase tracking-tight leading-none">{truck.license_plate}</p>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{truck.model}</p>
        </div>
        <Truck className="h-8 w-8 text-primary/20" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Muatan Kargo", value: truck.cargo_type, icon: Package },
          { label: "Kapasitas Berat", value: `${truck.capacity_kg} KG`, icon: Weight },
          { label: "ID Registrasi", value: truck.id.substring(0, 12), icon: Database, isMono: true },
          { 
            label: "Status Unit", 
            value: truck.is_available ? "SIAP" : "DIGUNAKAN", 
            icon: Activity,
            isStatus: true
          },
        ].map((item, i) => (
          <div key={i} className="p-3 bg-secondary/10 rounded-xl border border-border/40 group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-1 group-hover:text-primary/60">
              <item.icon className="h-3 w-3" />
              {item.label}
            </div>
            <p className={cn(
              "text-sm font-bold uppercase tracking-tight",
              item.isMono && "font-mono text-xs",
              item.isStatus && (truck.is_available ? "text-green-500" : "text-blue-500")
            )}>{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
         <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em] font-bold">Status Diagnosis</span>
         <span className="text-[10px] font-mono text-primary font-bold">KONEKSI OPTIMAL</span>
      </div>
    </div>
  );
}
