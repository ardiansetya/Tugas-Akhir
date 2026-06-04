"use client";

import { useCity } from "@/hooks";
import { DeliveryTransitData } from "@/types/api";
import { ArrowRight, Package, Clock, CreditCard, MapPin } from "lucide-react";

const TransitContent = ({ transit }: { transit: DeliveryTransitData }) => {
  const { data: loadingCity } = useCity(transit.transit_point.loading_city_id);
  const { data: unloadingCity } = useCity(
    transit.transit_point.unloading_city_id
  );

  const metrics = [
    { label: "Vector_Path", value: `${loadingCity?.name} → ${unloadingCity?.name}`, icon: MapPin },
    { label: "Cargo_Class", value: transit.transit_point.cargo_type, icon: Package },
    { label: "Dur_Est", value: `${transit.transit_point.estimated_duration_minute}M`, icon: Clock },
    { label: "Extra_V_Cost", value: `Rp ${transit.transit_point.extra_cost.toLocaleString("id-ID")}`, icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/10 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
            <m.icon className="h-3 w-3" />
            {m.label}
          </div>
          <span className="text-xs font-bold uppercase tracking-tight truncate ml-4">
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TransitContent;
