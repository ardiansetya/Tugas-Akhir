import { useRoute } from "@/hooks";
import { Navigation, MapPin, Activity, Clock, Package, CreditCard } from "lucide-react";
import { formatDurationHours } from "@/lib/utils";

export function RouteInfo({ routeId }: { routeId: string }) {
  const { data: route, isLoading } = useRoute(routeId);

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

  if (!route)
    return <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Rute tidak ditemukan: {routeId}</span>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-lg font-display uppercase tracking-tight text-primary">
          <span>{route.start_city_name}</span>
          <div className="flex-1 h-[1px] bg-primary/20 relative">
             <Navigation className="absolute left-1/2 -top-2 -translate-x-1/2 h-4 w-4 text-primary bg-background p-0.5" />
          </div>
          <span>{route.end_city_name}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
           <MapPin className="h-3 w-3" />
           Jalur Rute Resmi
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Jarak Tempuh", value: `${route.distance_km} KM`, icon: Activity },
          { label: "Estimasi Waktu", value: formatDurationHours(route.estimated_duration_hours), icon: Clock },
          { label: "Tipe Kargo", value: route.cargo_type, icon: Package },
          { label: "Harga Dasar", value: `Rp ${route.base_price.toLocaleString("id-ID")}`, icon: CreditCard },
        ].map((item, i) => (

          <div key={i} className="p-3 bg-secondary/10 rounded-xl border border-border/40 group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-1 group-hover:text-primary/60">
              <item.icon className="h-3 w-3" />
              {item.label}
            </div>
            <p className="text-sm font-bold uppercase tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      {route.details && (
        <div className="pt-4 border-t border-dashed border-border/50">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
             <Activity className="h-3 w-3" />
             Catatan Rute:
          </p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium bg-secondary/5 p-3 rounded-lg border border-border/20">
            {route.details}
          </p>
        </div>
      )}
    </div>
  );
}
