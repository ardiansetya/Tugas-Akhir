"use client";

import { useCity } from '@/hooks';
import { DeliveryTransitData } from '@/types/api';
import React from 'react';

const ExtraCostPayment = ({transit}: {transit: DeliveryTransitData}) => {
  const { data: loadingCity } = useCity(transit.transit_point.loading_city_id);
  const { data: unloadingCity } = useCity(
    transit.transit_point.unloading_city_id
  );
  
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-tighter">RELAY_FEE</span>
        <span className="text-[11px] font-medium max-w-[150px] truncate">
          {loadingCity?.name} → {unloadingCity?.name}
        </span>
      </div>
      <span className="text-xs font-mono font-bold">
        +Rp{transit.transit_point.extra_cost.toLocaleString("id-ID")}
      </span>
    </div>
  );
}

export default ExtraCostPayment;